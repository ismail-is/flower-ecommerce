const express= require('express');
const app=express();
const dotenv = require('dotenv');
const mongoDB=require('./config/db')
const productRoutes=require('./Router/productRoutes');
const categoryRoutes=require('./Router/categoryRoutes');
const orderRouter=require('./Router/orderRoutes');
const reviewRouter=require('./Router/reviewRouter');






const path = require('path');
const fs = require('fs');
const port=7000;
dotenv.config()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✓ Uploads directory created');
}

const productsDir = path.join(uploadsDir, 'products');
if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir, { recursive: true });
  console.log('✓ Products directory created');
}

app.use('/api',productRoutes);
app.use('/api',categoryRoutes);
app.use('/api',orderRouter);
app.use('/api',reviewRouter);




mongoDB()
app.listen(port,()=>{
    console.log(`Server running on port ${port}`); 
})