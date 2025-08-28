import mongoose, { Schema } from "mongoose";

export interface ILoyaltyTransaction extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: 'earn' | 'redeem' | 'expire' | 'adjustment';
  points: number;
  description: string;
  orderId?: mongoose.Types.ObjectId;
  expiresAt?: Date;
  createdAt: Date;
}

const LoyaltyTransactionSchema = new Schema<ILoyaltyTransaction>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['earn', 'redeem', 'expire', 'adjustment'], 
    required: true 
  },
  points: { type: Number, required: true },
  description: { type: String, required: true },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
  expiresAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

// Indexes for better query performance
LoyaltyTransactionSchema.index({ userId: 1, createdAt: -1 });
LoyaltyTransactionSchema.index({ expiresAt: 1 });

export const LoyaltyTransaction = mongoose.model<ILoyaltyTransaction>('LoyaltyTransaction', LoyaltyTransactionSchema);
