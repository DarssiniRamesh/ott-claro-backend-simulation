/**
 * Item model definition
 * Defines the Mongoose schema and model for items
 */

const mongoose = require('mongoose');

/**
 * Item Schema
 * @typedef {Object} Item
 * @property {string} name - The name of the item
 * @property {string} description - The description of the item
 * @property {number} price - The price of the item
 * @property {string} category - The category of the item
 * @property {boolean} inStock - Whether the item is in stock
 * @property {Date} createdAt - The date the item was created
 * @property {Date} updatedAt - The date the item was last updated
 */
const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    maxlength: [100, 'Item name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Item description is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Item price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Item category is required'],
    trim: true
  },
  inStock: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  versionKey: false
});

// Create and export the Item model
const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
