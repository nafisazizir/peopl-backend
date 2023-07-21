import mongoose, { Document, Schema } from "mongoose";

interface Comment extends Document {
  content: string;
  author: Schema.Types.ObjectId;
  parentId: Schema.Types.ObjectId;
  parentType: number;
  createdAt: Date;
}

const commentSchema = new Schema<Comment>({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  parentId: { type: Schema.Types.ObjectId, required: true },
  parentType: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Comment = mongoose.model<Comment>("Comment", commentSchema);

export default Comment;
