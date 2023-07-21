import mongoose, { Document, Schema } from "mongoose";

interface Notification extends Document {
  user: Schema.Types.ObjectId;
  type: string;
  sourceUser: Schema.Types.ObjectId;
  post: Schema.Types.ObjectId;
  comment: Schema.Types.ObjectId;
  createdAt: Date;
}

const notificationSchema = new Schema<Notification>({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  type: { type: String },
  sourceUser: { type: Schema.Types.ObjectId, ref: "User" },
  post: { type: Schema.Types.ObjectId, ref: "Post" },
  comment: { type: Schema.Types.ObjectId, ref: "Comment" },
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model<Notification>(
  "Notification",
  notificationSchema
);

export default Notification;
