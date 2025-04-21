import { IsString, IsNumber, IsBoolean, MaxLength, Min, IsOptional } from 'class-validator';

/**
 * Represents an item in the domain model
 * @class Item
 */
export class Item {
  /**
   * The unique identifier of the item
   * @type {string}
   */
  id?: string;

  /**
   * The name of the item
   * @type {string}
   */
  @IsString({ message: 'Name must be a string' })
  @MaxLength(100, { message: 'Item name cannot be more than 100 characters' })
  name: string;

  /**
   * The description of the item
   * @type {string}
   */
  @IsString({ message: 'Description must be a string' })
  description: string;

  /**
   * The price of the item
   * @type {number}
   */
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price cannot be negative' })
  price: number;

  /**
   * The category of the item
   * @type {string}
   */
  @IsString({ message: 'Category must be a string' })
  category: string;

  /**
   * Whether the item is in stock
   * @type {boolean}
   */
  @IsBoolean({ message: 'inStock must be a boolean' })
  inStock: boolean = true;

  /**
   * The date the item was created
   * @type {Date}
   */
  @IsOptional()
  createdAt?: Date;

  /**
   * The date the item was last updated
   * @type {Date}
   */
  @IsOptional()
  updatedAt?: Date;

  constructor(data: Partial<Item>) {
    Object.assign(this, data);
  }
}
