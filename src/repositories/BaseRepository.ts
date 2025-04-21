import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';
import winston from 'winston';

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Base repository interface
export interface IBaseRepository<T extends Document> {
  create(item: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  find(filter: FilterQuery<T>): Promise<T[]>;
  findOne(filter: FilterQuery<T>): Promise<T | null>;
  update(id: string, item: UpdateQuery<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

// Base repository implementation
export class BaseRepository<T extends Document> implements IBaseRepository<T> {
  constructor(
    protected readonly model: Model<T>,
    private readonly modelName: string
  ) {}

  async create(item: Partial<T>): Promise<T> {
    try {
      const newItem = new this.model(item);
      const savedItem = await newItem.save();
      logger.info(`Created ${this.modelName}`, { id: savedItem._id });
      return savedItem;
    } catch (error) {
      logger.error(`Error creating ${this.modelName}`, { error });
      throw this.handleError(error);
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      const item = await this.model.findById(id);
      logger.debug(`Found ${this.modelName} by id`, { id });
      return item;
    } catch (error) {
      logger.error(`Error finding ${this.modelName} by id`, { error, id });
      throw this.handleError(error);
    }
  }

  async find(filter: FilterQuery<T>): Promise<T[]> {
    try {
      const items = await this.model.find(filter);
      logger.debug(`Found ${this.modelName} list`, { count: items.length });
      return items;
    } catch (error) {
      logger.error(`Error finding ${this.modelName} list`, { error });
      throw this.handleError(error);
    }
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    try {
      const item = await this.model.findOne(filter);
      logger.debug(`Found ${this.modelName}`, { filter });
      return item;
    } catch (error) {
      logger.error(`Error finding ${this.modelName}`, { error });
      throw this.handleError(error);
    }
  }

  async update(id: string, item: UpdateQuery<T>): Promise<T | null> {
    try {
      const updatedItem = await this.model.findByIdAndUpdate(id, item, { new: true });
      logger.info(`Updated ${this.modelName}`, { id });
      return updatedItem;
    } catch (error) {
      logger.error(`Error updating ${this.modelName}`, { error, id });
      throw this.handleError(error);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id);
      const success = result !== null;
      if (success) {
        logger.info(`Deleted ${this.modelName}`, { id });
      }
      return success;
    } catch (error) {
      logger.error(`Error deleting ${this.modelName}`, { error, id });
      throw this.handleError(error);
    }
  }

  protected handleError(error: any): Error {
    if (error.name === 'ValidationError') {
      return new Error(`${this.modelName} validation error: ${error.message}`);
    }
    if (error.name === 'MongoError' && error.code === 11000) {
      return new Error(`${this.modelName} already exists`);
    }
    return error;
  }
}
