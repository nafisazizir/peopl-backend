import mongoose, { Document, Schema } from "mongoose";

interface Community extends Document {
  name: string;
  description: string;
  createdAt: Date;
  members: Schema.Types.ObjectId[];
}

const communitySchema = new Schema<Community>({
  name: { type: String, unique: true, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Community = mongoose.model<Community>("Community", communitySchema);

export default Community;
