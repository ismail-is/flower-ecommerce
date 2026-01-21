// categoryRoutes 

const express =require('express');
const { createCategory, updateCategory, getAllCategories, getCategoryById } = require('../Controllers/categoryController');
const router=express.Router();

router.post('/categoryinsert',createCategory);
router.get('/categoryview',getAllCategories);
router.get('/categoryview/:id',getCategoryById);
router.put('/categoryupdate/:id',updateCategory);

module.exports=router;
