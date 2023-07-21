import mongoose, { Document, Schema } from "mongoose";

interface User extends Document {
  username: string;
  email: string;
  password: string;
  googleId?: string;
  resetToken?: string;
  resetTokenExpiration?: Date;
  createdAt: Date;
  followedCommunities: Schema.Types.ObjectId[];
  pendingChatRequests: Schema.Types.ObjectId[];
}

const userSchema = new Schema<User>({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  googleId: { type: String },
  resetToken: { type: String },
  resetTokenExpiration: { type: Date },
  createdAt: { type: Date, default: Date.now },
  followedCommunities: [{ type: Schema.Types.ObjectId, ref: "Community" }],
  pendingChatRequests: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const User = mongoose.model<User>("User", userSchema);

export default User;
