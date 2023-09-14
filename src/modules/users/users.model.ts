import { Schema, Document, Model,model } from 'mongoose';
import isEmail from 'validator/lib/isEmail';
// Define the User schema
export interface IUserSchemaDocument extends Document {
  email: string;
  password: string;
  name: string;
  bio?: string;
  imageUrl?: string | null;
  isAdmin?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type IUserDocument = Document<IUserSchemaDocument>;

export interface IUserSchemaModel
  extends Model<IUserSchemaDocument> {}

const userSchema = new Schema<
IUserSchemaDocument,
IUserSchemaModel
>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      validate:isEmail,
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
      maxlength: 30,
    },
    bio: {
      type: String,
      default: 'No Bio',
      minlength: 5,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create the User model
const UserModel = model<
IUserSchemaDocument,
IUserSchemaModel
>('User', userSchema);

export default UserModel;
