import { IsString, IsNumber, IsBoolean, MaxLength, Min, IsOptional } from 'class-validator';
import { Expose } from 'class-transformer';
import { Item } from '../domain/Item';

/**
 * Data Transfer Object for item information
 * @class ItemDTO
 */
export class ItemDTO {
  @Expose()
  id?: string;

  @IsString({ message: 'Name must be a string' })
  @MaxLength(100, { message: 'Item name cannot be more than 100 characters' })
  @Expose()
  name: string;

  @IsString({ message: 'Description must be a string' })
  @Expose()
  description: string;

  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price cannot be negative' })
  @Expose()
  price: number;

  @IsString({ message: 'Category must be a string' })
  @Expose()
  category: string;

  @IsBoolean({ message: 'inStock must be a boolean' })
  @Expose()
  inStock: boolean = true;

  @IsOptional()
  @Expose()
  createdAt?: Date;

  @IsOptional()
  @Expose()
  updatedAt?: Date;

  /**
   * Maps DTO to domain model
   * @returns {Item}
   */
  toDomain(): Item {
    return new Item({
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      category: this.category,
      inStock: this.inStock,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    });
  }

  /**
   * Creates DTO from domain model
   * @param {Item} domain
   * @returns {ItemDTO}
   */
  static fromDomain(domain: Item): ItemDTO {
    const dto = new ItemDTO();
    dto.id = domain.id;
    dto.name = domain.name;
    dto.description = domain.description;
    dto.price = domain.price;
    dto.category = domain.category;
    dto.inStock = domain.inStock;
    dto.createdAt = domain.createdAt;
    dto.updatedAt = domain.updatedAt;
    return dto;
  }
}
