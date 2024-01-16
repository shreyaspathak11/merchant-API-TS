import mongoose, { Document } from 'mongoose';

interface IMerchant extends Document {      // interface for type checking 
  storeID: string;
  merchantName: string;
  email: string;
  commission: number;
  createdAt: Date;
}

const merchantSchema = new mongoose.Schema<IMerchant>({     // schema for merchant
  storeID: { type: String, required: true },
  merchantName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  commission: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Merchant = mongoose.model<IMerchant>('Merchant', merchantSchema);    // model for merchant

export default Merchant;
