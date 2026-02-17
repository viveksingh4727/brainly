import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tag: {
      type: String,
      default: null,
    },
    types: {
      type: String,
      default: "youtube",
    }
  },
  { timestamps: true }
);

export const ContentModel = mongoose.model("Content", contentSchema);
