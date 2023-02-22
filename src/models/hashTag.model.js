const  mongoose  = require("mongoose");

const hashTagSchema = new mongoose.Schema(
    {
        hashTagName: { type: String, required: true },
        postIds: [mongoose.Schema.Types.ObjectId]
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

const HashTag = mongoose.model("tag", hashTagSchema);
module.exports = HashTag;