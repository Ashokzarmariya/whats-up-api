const express = require("express");
const app = express();
const cors = require("cors");


app.use(express.json());

app.use(
  cors()
);

app.get("/", async (req,res) => {
  return res.status(200).send("Linkedin Backend Api Created By Ashok")
})

const { register, login } = require("./controllers/auth");
app.post("/register", register);
app.post("/login", login);

const userController = require("./controllers/user.controller");
const postController = require("./controllers/post.controller");
const storyController = require("./controllers/story.controller");
const notificationController = require("./controllers/notification.controller");

app.use("/users", userController);
app.use("/post", postController);
app.use("/story", storyController);
app.use("/notifications", notificationController);


//chat
const chatController = require("./controllers/chat.controller");
const messageController = require("./controllers/message.controller");

app.use("/chats",chatController)
app.use('/messages',messageController)
module.exports = app;

