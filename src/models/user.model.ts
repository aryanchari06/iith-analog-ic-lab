import mongoose, { Schema, Document } from "mongoose";

// User Interface
export interface User extends Document {
  email: string;
  username: string;
  password: string;
  createdAt: Date;
}

// Comment Interface
export interface Comment extends Document {
  text: string;
  owner: mongoose.Types.ObjectId; // Reference to User
  article: mongoose.Types.ObjectId; // Reference to Article
  createdAt: Date;
}

// Article Interface
export interface Article extends Document {
  title: string;
  imgUrl: string;
  description: string;
  owner: mongoose.Types.ObjectId; // Reference to User
  comments: mongoose.Types.ObjectId[]; // References to Comment
  createdAt: Date;
}

// User Schema
const UserSchema: Schema<User> = new Schema({
  email: {
    type: String,
    required: [true, "Institute email is required"],
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@iith\.ac\.in$/,
      "Please use a valid institute email address",
    ],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// Comment Schema
const CommentSchema: Schema<Comment> = new Schema({
  text: {
    type: String,
    required: [true, "Text is required"],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Article",
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// Article Schema
const ArticleSchema: Schema<Article> = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  description: {
    type: String,
    required: [true, "Query description is required"],
  },
  imgUrl: {
    type: String,
    required: [true, "Image URL is required"],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// Models
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

const CommentModel =
  (mongoose.models.Comment as mongoose.Model<Comment>) ||
  mongoose.model<Comment>("Comment", CommentSchema);

const ArticleModel =
  (mongoose.models.Article as mongoose.Model<Article>) ||
  mongoose.model<Article>("Article", ArticleSchema);

export { UserModel, CommentModel, ArticleModel };
