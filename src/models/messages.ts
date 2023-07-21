import mongoose, { Document, Schema } from "mongoose";

interface Message extends Document {
  sender: Schema.Types.ObjectId; // Reference to the sender user (User Model)
  recipient: Schema.Types.ObjectId; // Reference to the recipient user (User Model)
  content: string;
  createdAt: Date;
}

const messageSchema = new Schema<Message>({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Message = mongoose.model<Message>("Message", messageSchema);

export default Message;
