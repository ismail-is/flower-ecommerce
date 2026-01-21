const Product = require('../Model/Product');
const Order = require('../Model/Order');



// create order
const createOrder = async (req, res) => {
  try {
    const { products, totalAmount, shippingAddress } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Products are required"
      });
    }

    //  Check stock for each product
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
      shippingAddress
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
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
    const { status } = req.body;
    const { stock } = req.body;


    
    //  Find order
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    //  Handle stock when status changes
    if (status === "processing" && order.status === "pending") {
      for (let item of order.products) {
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
            message: `Only ${product.stock} items left`
          });
        }

        product.stock -= item.quantity;
        await product.save();
      }
    }

    //  Restore stock if cancelled
    if (status === "cancelled" && order.status !== "cancelled") {
      for (let item of order.products) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: item.quantity } }
        );
      }
    }

    //  Update order status
    order.status = status;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order
    });

  } catch (error) {
    console.error("Order update error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update order",
      error: error.message
    });
  }
};


module.exports = { createOrder, orderView, orderSingleView,orderUpdate };