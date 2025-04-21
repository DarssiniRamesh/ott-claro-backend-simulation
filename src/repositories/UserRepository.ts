import { Document, Model } from 'mongoose';
import { BaseRepository, IBaseRepository } from './BaseRepository';

// User interface
export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  deviceId?: string;
  region?: string;
  lastLogin?: Date;
  isActive: boolean;
}

// User repository interface
export interface IUserRepository extends IBaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  findByUsername(username: string): Promise<IUser | null>;
  updateLastLogin(id: string): Promise<IUser | null>;
  findActiveUsers(): Promise<IUser[]>;
}

// User repository implementation
export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor(model: Model<IUser>) {
    super(model, 'User');
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.findOne({ email: email.toLowerCase() });
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return this.findOne({ username });
  }

  async updateLastLogin(id: string): Promise<IUser | null> {
    return this.update(id, { 
      $set: { 
        lastLogin: new Date() 
      } 
    });
  }

  async findActiveUsers(): Promise<IUser[]> {
    return this.find({ isActive: true });
  }

  // Override create to ensure email is lowercase
  async create(item: Partial<IUser>): Promise<IUser> {
    if (item.email) {
      item.email = item.email.toLowerCase();
    }
    return super.create(item);
  }
}
