import mongoose, { Schema } from "mongoose";
import { AddressSchema, IAddress } from './Address';
import { CartItemSchema, ICartItem } from './CartItem';

// Refresh Token interface
export interface IRefreshToken {
  token: string;
  createdAt: Date;
  expiresAt: Date;
  deviceFingerprint?: string;
  isActive: boolean;
}

// Main User interface
export interface IUser extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  phoneNumber?: string;
  avatar?: string;
  addresses: IAddress[];
  cart: ICartItem[];
  wishlist: mongoose.Types.ObjectId[];
  orders: mongoose.Types.ObjectId[];
  points: number;
  vouchers: mongoose.Types.ObjectId[];
  refreshTokens: IRefreshToken[];
  failedAttempts: number;
  lockUntil?: Date;
  lastLoginIP?: string;
  lastLoginTime?: Date;
  knownDevices: string[];
  lastKnownCountry?: string;
  securityAlerts: Array<{
    type: string;
    ip: string;
    userAgent?: string;
    timestamp: Date;
    reasons?: any;
  }>;
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  incrementFailedAttempts(): Promise<void>;
  resetFailedAttempts(): Promise<void>;
  isLocked: boolean;
}

// Refresh Token Schema
const RefreshTokenSchema = new Schema<IRefreshToken>({
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  deviceFingerprint: { type: String },
  isActive: { type: Boolean, default: true }
});

// Using imported schemas from the respective model files

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    phoneNumber: { type: String },
    avatar: { type: String },
    addresses: [AddressSchema],
    cart: [CartItemSchema],
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
    points: { type: Number, default: 0 },
    vouchers: [{ type: Schema.Types.ObjectId, ref: 'Voucher' }],
    refreshTokens: [RefreshTokenSchema],
    failedAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    lastLoginIP: { type: String },
    lastLoginTime: { type: Date },
    knownDevices: [{ type: String }],
    lastKnownCountry: { type: String },
    securityAlerts: [{
      type: { type: String, required: true },
      ip: { type: String, required: true },
      userAgent: { type: String },
      timestamp: { type: Date, default: Date.now },
      reasons: { type: Schema.Types.Mixed }
    }]
  }, 
  { timestamps: true }
);

// Virtual for checking if account is locked
UserSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil.getTime() > Date.now());
});

// Method to increment failed attempts
UserSchema.methods.incrementFailedAttempts = function() {
  const MAX_ATTEMPTS = 5;
  const LOCK_TIME = 30 * 60 * 1000; // 30 minutes

  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { failedAttempts: 1 }
    });
  }

  const updates: any = { $inc: { failedAttempts: 1 } };
  // If we have reached max attempts and it's not locked, lock it
  if (this.failedAttempts + 1 >= MAX_ATTEMPTS && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + LOCK_TIME };
  }

  return this.updateOne(updates);
};

// Method to reset failed attempts
UserSchema.methods.resetFailedAttempts = function() {
  return this.updateOne({
    $unset: { failedAttempts: 1, lockUntil: 1 }
  });
};

// Email index is already defined with { unique: true } in the schema

export const User = mongoose.model<IUser>('User', UserSchema);