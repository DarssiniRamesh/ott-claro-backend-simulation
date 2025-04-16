/**
 * Item controller
 * Controller functions for CRUD operations on items
 */

const Item = require('../models/item.model');
const { ApiError } = require('../middleware/error.middleware');

/**
 * Get all items
 * @PUBLIC_INTERFACE
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getAllItems = async (req, res, next) => {
  try {
    // In a real application, this would fetch items from the database
    // For this simulation, we'll return mock data
    const items = [
      {
        id: '1',
        name: 'Item 1',
        description: 'Description for Item 1',
        price: 19.99,
        category: 'Category A',
        inStock: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Item 2',
        description: 'Description for Item 2',
        price: 29.99,
        category: 'Category B',
        inStock: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        name: 'Item 3',
        description: 'Description for Item 3',
        price: 39.99,
        category: 'Category A',
        inStock: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    res.json({
      status: 'success',
      results: items.length,
      data: {
        items
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a specific item by ID
 * @PUBLIC_INTERFACE
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getItemById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // In a real application, this would fetch the item from the database
    // For this simulation, we'll return mock data or a 404 error
    if (id === '1' || id === '2' || id === '3') {
      const item = {
        id,
        name: `Item ${id}`,
        description: `Description for Item ${id}`,
        price: id * 10 - 0.01,
        category: id % 2 === 0 ? 'Category B' : 'Category A',
        inStock: id !== '3',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      res.json({
        status: 'success',
        data: {
          item
        }
      });
    } else {
      throw new ApiError(404, `Item not found with id: ${id}`);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new item
 * @PUBLIC_INTERFACE
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const createItem = async (req, res, next) => {
  try {
    const { name, description, price, category, inStock } = req.body;
    
    // Validate required fields
    if (!name || !description || !price || !category) {
      throw new ApiError(400, 'Please provide all required fields: name, description, price, category');
    }
    
    // In a real application, this would create the item in the database
    // For this simulation, we'll return the created item with a mock ID
    const newItem = {
      id: Date.now().toString(),
      name,
      description,
      price: Number(price),
      category,
      inStock: inStock !== undefined ? inStock : true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    res.status(201).json({
      status: 'success',
      data: {
        item: newItem
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing item
 * @PUBLIC_INTERFACE
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const updateItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, inStock } = req.body;
    
    // In a real application, this would update the item in the database
    // For this simulation, we'll check if the item exists and return the updated item
    if (id === '1' || id === '2' || id === '3') {
      // Get the existing item (mock data)
      const existingItem = {
        id,
        name: `Item ${id}`,
        description: `Description for Item ${id}`,
        price: id * 10 - 0.01,
        category: id % 2 === 0 ? 'Category B' : 'Category A',
        inStock: id !== '3',
        createdAt: new Date(Date.now() - 86400000), // 1 day ago
        updatedAt: new Date()
      };
      
      // Update the item with new values
      const updatedItem = {
        ...existingItem,
        name: name || existingItem.name,
        description: description || existingItem.description,
        price: price !== undefined ? Number(price) : existingItem.price,
        category: category || existingItem.category,
        inStock: inStock !== undefined ? inStock : existingItem.inStock,
        updatedAt: new Date()
      };
      
      res.json({
        status: 'success',
        data: {
          item: updatedItem
        }
      });
    } else {
      throw new ApiError(404, `Item not found with id: ${id}`);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Delete an item
 * @PUBLIC_INTERFACE
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const deleteItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // In a real application, this would delete the item from the database
    // For this simulation, we'll check if the item exists and return a success message
    if (id === '1' || id === '2' || id === '3') {
      res.json({
        status: 'success',
        data: null,
        message: `Item with id: ${id} deleted successfully`
      });
    } else {
      throw new ApiError(404, `Item not found with id: ${id}`);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem
};
