const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      trim: true,
    },

    username: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    mobile: { type: Number, required: false },
    about: { type: String, required: false },
    profilePic: { type: String },
    exprience: [
      {
        title: { type: Object },
        employmentType: { type: Object },
        companyName: { type: Object },
        location: { type: Object },
        description: { type: Object },
        profileHeadline: { type: Object },
        startMonth: { type: Object },
        endMonth: { type: Object },
        startYear: { type: Object },
        endYear: { type: Object },
      },
    ],
    languages: [{ type: Object }],
    education: [
      {
        school: { type: Object },
        degree: { type: Object },
        fieldOfStudy: { type: Object },
        gread: { type: Object },
        description: { type: Object },
        startMonth: { type: Object },
        endMonth: { type: Object },
        startYear: { type: Object },
        endYear: { type: Object },
      },
    ],
    skills: [{ type: Object }],
    projects: [
      {
        projectName: { type: String },
        associatedWith: { type: String },
        projectUrl: { type: String },
        description: { type: String },
        startMonth: { type: String },
        endMonth: { type: String },
        startYear: { type: String },
        endYear: { type: String },
        creator: [{ type: Object }],
      },
    ],

    notifications: [
      {
        notification: {
          type: String,
          required: true,
          trim: true,
        },
        userPic: {
          type: String,
          required: true,
          trim: true,
        },
        postSrc: {
          type: String,
          required: true,
          trim: true,
        },
        timestamps: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    isNewNotifications: { type: Boolean, default: false },
    tagPosts: [
      { type: mongoose.Schema.Types.ObjectId, ref: "post", required: true },
    ],
    storys: [
      { type: mongoose.Schema.Types.ObjectId, ref: "story", required: true },
    ],
    following: [mongoose.Schema.Types.ObjectId],
    followers: [mongoose.Schema.Types.ObjectId],
    savedPost: [
      { type: mongoose.Schema.Types.ObjectId, ref: "post", required: true },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hashSync(this.password, 8);
  this.username = this.username.toLowerCase();
  return next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("user", userSchema);
module.exports = User;
