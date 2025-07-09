import mongoose, { Schema } from "mongoose";
import { AddressSchema, IAddress } from './Address';
import { CartItemSchema, ICartItem } from './CartItem';

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
  createdAt: Date;
  updatedAt: Date;
}

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
    vouchers: [{ type: Schema.Types.ObjectId, ref: 'Voucher' }]
  }, 
  { timestamps: true }
);

// Email index is already defined with { unique: true } in the schema

export const User = mongoose.model<IUser>('User', UserSchema);