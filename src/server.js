const connect = require("./configs/db");
const app = require("./index");

const port = process.env.PORT || 5000;
const server = app.listen(port, async () => {
  await connect();
  console.log("listening on port", port);
});

const io = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:3000", "https://linkdin-react.vercel.app/"],
  },
});

const onlineUsers = [];
const addOnlineUser = (soketId, userId) => {
  !onlineUsers.some((item) => item.userId === userId) &&
    onlineUsers.push({ soketId, userId });
};
const removeUser = (soketId) => {
  onlineUsers = onlineUsers.filter((user) => user.soketId !== soketId);
};
const senderUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};
io.on("connection", (soket) => {
  // console.log("soket io connected successfully", soket.id);

  soket.on("sendOnlineUser", (userId) => {
    addOnlineUser(soket.id, userId);
    io.emit("getOnlineUsers", onlineUsers);
  });

  soket.on("send-message", (content, sender, reciverId, chatId) => {
    const reciver = senderUser(reciverId);

    const user = {
      username: sender.username,
      profilePic: sender.profilePic,
      _id: sender._id,
      email: sender.email,
    };
    console.log("sender", user, content, reciverId, reciver?.soketId, chatId);
    io.to(reciver?.soketId).emit("recive-message", user, content, chatId);
  });

  soket.on("send-notification", (notification, reciver) => {
    const notificationReciver = senderUser(reciver);
    io.to(notificationReciver?.soketId).emit("recive-notification",notification)
  })

  soket.on("dissconect", () => {
    removeUser(soket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});
