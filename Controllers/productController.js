const Product = require('../Model/Product');

const createProduct = async (req, res) => {
    try {
        // Log the incoming request
        console.log('Request Body:', req.body);
        console.log('Request Files:', req.files);

        const { name, title, description, exactPrice, discountPrice, category, stock, deliveryInfo } = req.body;

        // Validate required fields
        if (!name || !title || !exactPrice || !deliveryInfo) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: name, title, exactPrice, and deliveryInfo are required'
            });
        }

        // Handle images
        let images = [];
        if (req.files && req.files.length > 0) {
            images = req.files.map(file => `/uploads/products/${file.filename}`);
        }

        // Parse numeric fields
        const numericPrice = parseFloat(exactPrice);
        const numericDiscount = discountPrice ? parseFloat(discountPrice) : null;
        const numericStock = stock ? parseInt(stock) : 0;

        // Create new product
        const product = new Product({
            name: name.trim(),
            title: title.trim(),
            description: description ? description.trim() : '',
            exactPrice: numericPrice,
            discountPrice: numericDiscount,
            category: category ? category.trim() : 'Uncategorized',
            stock: numericStock,
            deliveryInfo: deliveryInfo.trim(),
            images
        });

        // Save to database
        await product.save();

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating product',
            error: error.message
        });
    }
};
 

// product all view
const productView=async(req,res)=>{

  try{
    const data= await Product.find().populate("category");
    res.send({'all product view': data});


  }
  catch(err){
    console.log("all product view faild");
    res.status(500).json({success:true,message:"all product view faild"})
  }
}

//single product view
const singleProductView = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (err) {
    console.log("Single product view failed");
    res.status(500).json({ success: false, message: "Single product view failed" });
  }
};

// product updates 
const productUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Handle image updates
    if (req.files && req.files.length > 0) {
      updatedData.images = req.files.map(file => `/uploads/products/${file.filename}`);
    }

    const product = await Product.findByIdAndUpdate(id, updatedData, { new: true });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (err) {
    console.log("Product update failed");
    res.status(500).json({ success: false, message: "Product update failed" });
  }
};


//single product delete
const productDelete=async(req,res)=>{
  try{
    const {id}=req.params;
    const deletedProduct=await Product.findByIdAndDelete(id);
    if(!deletedProduct){
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    console.log("Product delete failed");
    res.status(500).json({ success: false, message: "Product delete failed" });
  }
};

module.exports = { 
    createProduct,productView,singleProductView,productUpdate,productDelete
};