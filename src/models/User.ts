import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// User Schema
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
  generateToken: () => string;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Please enter your name'],
    trim: true,
    maxLength: [30, 'Your name cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please enter your password'],
    trim: true,
    minLength: [6, 'Your password must be at least 6 characters long'],
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Function to hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    // Hash password using bcrypt
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

// Function to match password
userSchema.methods.matchPassword = async function (enteredPassword: string) {
  try {
    // Compare password using bcrypt
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Function to generate token
userSchema.methods.generateToken = function () {
  // Generate token using jsonwebtoken
  return jwt.sign({ _id: this._id }, process.env.JWT_SECRET || "");
};

export default mongoose.model<IUser>('User', userSchema);
