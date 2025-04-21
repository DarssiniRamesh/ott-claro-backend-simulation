import { IsEmail, MinLength, IsEnum, IsOptional, IsUrl, IsPhoneNumber } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { User, UserProfile } from '../domain/User';

/**
 * Data Transfer Object for user profile information
 * @class UserProfileDTO
 */
export class UserProfileDTO {
  @IsOptional()
  @Expose()
  firstName?: string;

  @IsOptional()
  @Expose()
  lastName?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Avatar must be a valid URL' })
  @Expose()
  avatar?: string;

  @IsOptional()
  @IsPhoneNumber(null, { message: 'Please provide a valid phone number' })
  @Expose()
  phone?: string;

  /**
   * Maps DTO to domain model
   * @returns {UserProfile}
   */
  toDomain(): UserProfile {
    return new UserProfile({
      firstName: this.firstName,
      lastName: this.lastName,
      avatar: this.avatar,
      phone: this.phone
    });
  }

  /**
   * Creates DTO from domain model
   * @param {UserProfile} domain
   * @returns {UserProfileDTO}
   */
  static fromDomain(domain: UserProfile): UserProfileDTO {
    const dto = new UserProfileDTO();
    dto.firstName = domain.firstName;
    dto.lastName = domain.lastName;
    dto.avatar = domain.avatar;
    dto.phone = domain.phone;
    return dto;
  }
}

/**
 * Data Transfer Object for user information
 * @class UserDTO
 */
export class UserDTO {
  @Expose()
  id?: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Expose()
  email: string;

  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Exclude({ toPlainOnly: true })
  password?: string;

  @IsEnum(['user', 'admin'], { message: 'Role must be either user or admin' })
  @Expose()
  role: 'user' | 'admin' = 'user';

  @IsOptional()
  @Type(() => UserProfileDTO)
  @Expose()
  profile?: UserProfileDTO;

  @Exclude()
  refreshToken?: string;

  @Expose()
  createdAt?: Date;

  @Expose()
  updatedAt?: Date;

  /**
   * Maps DTO to domain model
   * @returns {User}
   */
  toDomain(): User {
    return new User({
      id: this.id,
      email: this.email,
      password: this.password,
      role: this.role,
      profile: this.profile?.toDomain(),
      refreshToken: this.refreshToken,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    });
  }

  /**
   * Creates DTO from domain model
   * @param {User} domain
   * @returns {UserDTO}
   */
  static fromDomain(domain: User): UserDTO {
    const dto = new UserDTO();
    dto.id = domain.id;
    dto.email = domain.email;
    dto.role = domain.role;
    dto.profile = domain.profile ? UserProfileDTO.fromDomain(domain.profile) : undefined;
    dto.createdAt = domain.createdAt;
    dto.updatedAt = domain.updatedAt;
    return dto;
  }
}
