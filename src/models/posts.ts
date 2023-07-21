import mongoose, { Document, Schema } from "mongoose";

interface Post extends Document {
  title: string;
  content: string;
  author: Schema.Types.ObjectId;
  community: Schema.Types.ObjectId;
  createdAt: Date;
}

const postSchema = new Schema<Post>({
  title: { type: String, required: true },
  content: { type: String },
  author: { type: Schema.Types.ObjectId, ref: "User" },
  community: { type: Schema.Types.ObjectId, ref: "Community" },
  createdAt: { type: Date, default: Date.now },
});

const Post = mongoose.model<Post>("Post", postSchema);

export default Post;
