//categoryController
const Category = require('../Model/Category');

// Create Category
const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        // Validate required fields
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Missing required field: name is required'
            });
        }
        // Create new category
        const category = new Category({
            name: name.trim(),
            description: description ? description.trim() : ''
        });

        // Save to database
        await category.save();

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            category
        });
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating category',
            error: error.message
        });
    }
};

// category all view

const getAllCategories = async (req, res) => {
    try{
        const categories = await Category.find();
        res.status(200).json({
            success: true,
            categories
        });

    }
    catch(error){
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching categories',
            error: error.message
        });
    }
};


//category single view
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.status(200).json({
            success: true,
            category
        });
    } catch (error) {
        console.error('Error fetching category:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching category',
            error: error.message
        });
    }
};


// update category
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        // Find category by ID
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Update category fields
        category.name = name ? name.trim() : category.name;
        category.description = description ? description.trim() : category.description;

        // Save updated category
        await category.save();

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            category
        });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating category',
            error: error.message
        });
    }
};

module.exports = { createCategory,updateCategory,getAllCategories,getCategoryById };