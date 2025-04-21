import { IsEmail, MinLength, IsEnum, IsOptional, IsUrl, IsPhoneNumber } from 'class-validator';

/**
 * Represents a user in the domain model
 * @class User
 */
export class User {
  /**
   * The unique identifier of the user
   * @type {string}
   */
  id?: string;

  /**
   * The email address of the user (unique)
   * @type {string}
   */
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  /**
   * The hashed password of the user
   * @type {string}
   */
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password?: string;

  /**
   * The role of the user
   * @type {'user' | 'admin'}
   */
  @IsEnum(['user', 'admin'], { message: 'Role must be either user or admin' })
  role: 'user' | 'admin' = 'user';

  /**
   * The profile information of the user
   * @type {UserProfile}
   */
  @IsOptional()
  profile: UserProfile;

  /**
   * The refresh token for JWT authentication
   * @type {string}
   */
  refreshToken?: string;

  /**
   * The date the user was created
   * @type {Date}
   */
  createdAt?: Date;

  /**
   * The date the user was last updated
   * @type {Date}
   */
  updatedAt?: Date;

  constructor(data: Partial<User>) {
    Object.assign(this, data);
    this.profile = new UserProfile(data.profile || {});
  }

  /**
   * Returns a public view of the user (without sensitive data)
   * @returns {Partial<User>}
   */
  toPublicProfile(): Partial<User> {
    const { password, refreshToken, ...publicData } = this;
    return publicData;
  }
}

/**
 * Represents a user's profile information
 * @class UserProfile
 */
export class UserProfile {
  /**
   * The first name of the user
   * @type {string}
   */
  @IsOptional()
  firstName?: string;

  /**
   * The last name of the user
   * @type {string}
   */
  @IsOptional()
  lastName?: string;

  /**
   * The avatar URL of the user
   * @type {string}
   */
  @IsOptional()
  @IsUrl({}, { message: 'Avatar must be a valid URL' })
  avatar: string = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

  /**
   * The phone number of the user
   * @type {string}
   */
  @IsOptional()
  @IsPhoneNumber(null, { message: 'Please provide a valid phone number' })
  phone?: string;

  constructor(data: Partial<UserProfile>) {
    Object.assign(this, data);
  }
}
