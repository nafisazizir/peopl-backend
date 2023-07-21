import User from "../models/users";
import Comment from "../models/comments";
import Post from "../models/posts";

class CommentService {
  async create(
    email: string,
    parentId: string,
    parentType: number,
    content: string
  ): Promise<Comment> {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("User does not exist");
    }
    if (parentType.toString() == "0") {
      const postParent = await Post.findById(parentId);
      if (!postParent) {
        throw new Error("Post does not exist");
      }
    } else {
      const postComment = await Comment.findById(parentId);
      if (!postComment) {
        throw new Error("Parent comment does not exist");
      }
    }

    const comment = await Comment.create({
      content: content,
      author: user._id,
      parentId: parentId,
      parentType: parentType,
    });
    return comment;
  }
}

export default new CommentService();
