const Product = require('../Model/Product');
const Order = require('../Model/Order');
const mongoose = require("mongoose");


const {sendOrderEmail,sendCancelEmail} = require("../Config/sendEmail");

const createOrder = async (req, res) => {
  try {
    const { products, totalAmount, shippingAddress, userEmail } = req.body;

    // 1 Validation
    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Products are required"
      });
    }

    //  Check stock
    for (let item of products) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found"
        });
      }

      if (item.quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available for ${product.name}`
        });
      }
    }

    //  Reduce stock
    for (let item of products) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    //  Create order
    const order = new Order({
      products,
      totalAmount,
      shippingAddress,
      userEmail
    });

    await order.save();

    //  Send confirmation email (FREE)
    await sendOrderEmail(
      userEmail,
      order._id,
      totalAmount
    );

    //  Response
    res.status(201).json({
      success: true,
      message: "Order placed successfully & email sent",
      order
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Order creation failed",
      error: error.message
    });
  }
};


// order view
const orderView = async (req, res) => {
  try {
    const orders = await Order.find().populate('products.product');

    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve orders",
      error: error.message
    });
  }
};

//oder single view
const orderSingleView = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate('products.product');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve order",
      error: error.message
    });
  }
};

//oder update

const orderUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { products, totalAmount, shippingAddress, status } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // ✅ CHECK STOCK (same as createOrder)
    for (let item of products) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found"
        });
      }

      if (item.quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} items available for ${product.name}`
        });
      }
    }

    // ✅ REDUCE STOCK (same as createOrder)
    for (let item of products) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }
      );
    }

    // ✅ UPDATE ORDER
    order.products = products;
    order.totalAmount = totalAmount;
    order.shippingAddress = shippingAddress;
    order.status = status || order.status;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Order update failed",
      error: error.message
    });
  }
};


//oder delete(cancel)

const orderDelete = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Find order
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // 2️⃣ Restore product stock
    for (let item of order.products) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } }
      );
    }

    // 3️⃣ Send cancel email
    await sendCancelEmail(order.userEmail, order._id);

    // 4️⃣ Delete order
    await Order.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully & email sent"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Order delete failed",
      error: error.message
    });
  }
};



module.exports = { createOrder, orderView, orderSingleView, orderUpdate, orderDelete };