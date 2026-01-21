 const mongoose =require('mongoose');
const {Schema} =mongoose;

const productSchema = new  Schema({
  
    name: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    exactPrice: {
      type: Number,
      required: true
    },
    discountPrice: {
      type: Number
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category', // Foreign Key
      // required: true
    },
    stock: {
      type: Number,
      default: 0
    },
    deliveryInfo: {
      type: String,
      required: true
    },
    images: [{
      type: String,
      default: []
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);