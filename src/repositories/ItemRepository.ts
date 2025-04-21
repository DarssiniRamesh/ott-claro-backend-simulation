import { Document, Model } from 'mongoose';
import { BaseRepository, IBaseRepository } from './BaseRepository';

// Item interface
export interface IItem extends Document {
  title: string;
  type: string;
  metadata: {
    description?: string;
    duration?: number;
    releaseDate?: Date;
    genre?: string[];
  };
  assetUrl: string;
  thumbnailUrl?: string;
  isAvailable: boolean;
  region: string[];
}

// Item repository interface
export interface IItemRepository extends IBaseRepository<IItem> {
  findByType(type: string): Promise<IItem[]>;
  findByRegion(region: string): Promise<IItem[]>;
  findAvailableItems(): Promise<IItem[]>;
  findByGenre(genre: string): Promise<IItem[]>;
  updateAvailability(id: string, isAvailable: boolean): Promise<IItem | null>;
}

// Item repository implementation
export class ItemRepository extends BaseRepository<IItem> implements IItemRepository {
  constructor(model: Model<IItem>) {
    super(model, 'Item');
  }

  async findByType(type: string): Promise<IItem[]> {
    return this.find({ type });
  }

  async findByRegion(region: string): Promise<IItem[]> {
    return this.find({ region: region });
  }

  async findAvailableItems(): Promise<IItem[]> {
    return this.find({ isAvailable: true });
  }

  async findByGenre(genre: string): Promise<IItem[]> {
    return this.find({ 'metadata.genre': genre });
  }

  async updateAvailability(id: string, isAvailable: boolean): Promise<IItem | null> {
    return this.update(id, { 
      $set: { 
        isAvailable 
      } 
    });
  }

  // Override create to validate required fields
  async create(item: Partial<IItem>): Promise<IItem> {
    if (!item.title || !item.type || !item.assetUrl) {
      throw new Error('Item validation error: title, type, and assetUrl are required');
    }
    return super.create(item);
  }
}
