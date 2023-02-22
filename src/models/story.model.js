const mongoose = require("mongoose");

const str = {
  type: String,
  required: true,
  trim: true,
};

const storySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    imgUrl: {
      type: String,
      required: true,
      trim: true,
    },
    postedTime: { type: String },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Story = mongoose.model("story", storySchema);
module.exports = Story;
