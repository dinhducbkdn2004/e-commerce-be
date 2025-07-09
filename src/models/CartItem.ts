import mongoose, { Schema } from "mongoose";

export interface ICartItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export const CartItemSchema = new Schema<ICartItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  selectedSize: { type: String },
  selectedColor: { type: String }
});
