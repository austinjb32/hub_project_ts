import { Document, Schema, Model, model, ObjectId } from "mongoose";

export interface IPostSchemaDocument extends Document {
  title: string;
  content: string;
  imageUrl: string;
  creator: ObjectId;
  shareCount: number;
  createdAt: string;
  updatedAt: string;
}

export type IPostDocument = Document<IPostSchemaDocument>;

export interface IPostSchemaModel extends Model<IPostSchemaDocument> {}

const postSchema = new Schema<IPostSchemaDocument, IPostSchemaModel>(
  {
    title: {
      type: String,
      default: null,
      required: true,
    },
    content: {
      type: String,
      default: null,
      required: true,
    },
    shareCount: {
      type: Number,
      default: 0,
    },
    creator: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    imageUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

const postModel = model<IPostSchemaDocument, IPostSchemaModel>(
  "Post",
  postSchema,
);

export default postModel;
