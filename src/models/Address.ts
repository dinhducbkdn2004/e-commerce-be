import mongoose, { Schema } from "mongoose";

export interface IAddress {
  _id?: mongoose.Types.ObjectId;
  fullName: string;
  phone: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
}

export const AddressSchema = new Schema<IAddress>({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  ward: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});
