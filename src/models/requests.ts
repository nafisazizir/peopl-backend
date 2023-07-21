import mongoose, { Document, Schema } from "mongoose";

interface Request extends Document {
  sender: Schema.Types.ObjectId; // Reference to the sender user (User Model)
  recipient: Schema.Types.ObjectId; // Reference to the recipient user (User Model)
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
}

const requestSchema = new Schema<Request>({
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
  recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const Request = mongoose.model<Request>("Request", requestSchema);

export default Request;
