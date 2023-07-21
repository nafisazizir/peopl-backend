import Message from "../models/messages";
import User from "../models/users";
import Request from "../models/requests";

class MessageService {
  async create(senderId: string, recipientId: string, content: string) {
    const sender = await User.findOne({ username: senderId });
    const recipient = await User.findOne({ username: recipientId });
    const request = await Request.findOne({
      $or: [
        { sender: sender?.id, recipient: recipient?.id },
        { sender: recipient?.id, recipient: sender?.id },
      ],
    });

    if (!request) {
      throw new Error("Request does not exist");
    }

    if (request.status !== "accepted") {
      throw new Error("Request is not accepted");
    }

    const chatMessage = new Message({
      sender: sender?._id,
      recipient: recipient?._id,
      content: content,
    });

    await chatMessage.save();

    return chatMessage;
  }

  async getMessages(senderId: string, recipientId: string): Promise<Message[]> {
    const sender = await User.findOne({ username: senderId });
    const recipient = await User.findOne({ username: recipientId });
    const request = await Request.findOne({
      $or: [
        { sender: sender?.id, recipient: recipient?.id },
        { sender: recipient?.id, recipient: sender?.id },
      ],
    });

    if (!request) {
      throw new Error("Request does not exist");
    }

    if (request.status !== "accepted") {
      throw new Error("Request is not accepted");
    }

    const messages = await Message.find({
      $or: [
        { sender: sender?.id, recipient: recipient?.id },
        { sender: recipient?.id, recipient: sender?.id },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "username")
      .populate("recipient", "username");

    return messages;
  }
}

export default new MessageService();
