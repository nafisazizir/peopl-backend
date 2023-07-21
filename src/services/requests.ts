import User from "../models/users";
import Request from "../models/requests";

class RequestService {
  async create(senderId: string, recipientId: string): Promise<Request> {
    const sender = await User.findOne({ username: senderId });
    const recipient = await User.findOne({ username: recipientId });
    if (!sender || !recipient) {
      throw new Error("Sender or recipient not found");
    }

    const existingRequest = await Request.findOne({
      sender: sender._id,
      recipient: recipient._id,
    });
    if (existingRequest) {
      throw new Error("Chat request already sent to this user");
    }

    const chatRequest = new Request({
      sender: sender._id,
      recipient: recipient._id,
      status: "pending",
    });

    await chatRequest.save();

    return chatRequest;
  }

  async getPendingRequests(userId: string): Promise<Request[]> {
    const user = await User.findOne({ username: userId });
    if (!user) {
      throw new Error("User does not exist");
    }

    const pendingRequests = await Request.find({
      recipient: user._id,
      status: "pending",
    })
      .populate("sender", "username")
      .populate("recipient", "username");
    return pendingRequests;
  }

  async acceptChatRequest(username: string, requestId: string): Promise<void> {
    const chatRequest = await Request.findById(requestId);

    if (!chatRequest) {
      throw new Error("Chat request not found");
    }

    const user = await User.findOne({ username: username });
    if (!user) {
      throw new Error("User does not exist");
    }

    if (chatRequest.recipient.toString() !== user._id.toString()) {
      throw new Error("User is not the recipient");
    }

    if (chatRequest.status !== "pending") {
      throw new Error("Chat request has already been processed");
    }

    chatRequest.status = "accepted";
    await chatRequest.save();
  }

  async rejecttChatRequest(username: string, requestId: string): Promise<void> {
    const chatRequest = await Request.findById(requestId);

    if (!chatRequest) {
      throw new Error("Chat request not found");
    }

    const user = await User.findOne({ username: username });
    if (!user) {
      throw new Error("User does not exist");
    }

    if (chatRequest.recipient.toString() !== user._id.toString()) {
      throw new Error("User is not the recipient");
    }

    if (chatRequest.status !== "pending") {
      throw new Error("Chat request has already been processed");
    }

    chatRequest.status = "rejected";
    await chatRequest.save();
  }
}

export default new RequestService();
