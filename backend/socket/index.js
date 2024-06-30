const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const getUserDetailsWithToken = require("../middlewares/getUserDetailsWithToken");
const UserModel = require("../models/UserModel");
const {
  ConversationModel,
  MessageModel,
} = require("../models/conversationModel");

const app = express();

//! Socket Connection
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

//Online User
const onlineUser = new Set();

io.on("connection", async (socket) => {
  console.log("Connect user", socket.id);

  //Todo=> Getting token data
  const token = socket?.handshake?.auth?.token;

  //Todo=> Current user details
  const user = await getUserDetailsWithToken(token);

  //Todo=> Create a Room
  socket.join(user?._id?.toString());

  //Todo=> Online User
  onlineUser.add(user?._id?.toString());

  //Todo=> Sending online user to frontend
  io.emit("onlineUser", Array.from(onlineUser));

  socket.on("message-page", async (userId) => {
    console.log("userId", userId);
    const userDetails = await UserModel.findById(userId).select(
      "-password -assign_password"
    );
    const payload = {
      _id: userDetails?._id,
      name: userDetails?.name,
      email: userDetails?.email,
      profile_pic: userDetails?.profile_pic,
      online: onlineUser?.has(userId),
    };

    socket.emit("message-user", payload);
  });
  //Todo=> New Message
  socket.on("new message", async (data) => {
    // check conversation is available for both users or not
    let conversation = await ConversationModel.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    });
    // if conversation is not available then creating it
    if (!conversation) {
      const createConversation = await ConversationModel({
        sender: data?.sender,
        receiver: data?.receiver,
      });
      conversation = await createConversation.save();
    }

    const message = await new MessageModel({
      text: data?.text,
      imageUrl: data?.imageUrl,
      videoUrl: data?.videoUrl,
      msgByUserId: data?.msgByUserId,
    }).save();

    await ConversationModel.updateOne(
      {
        _id: conversation?._id,
      },
      {
        $push: { messages: message?._id },
      }
    );
    // let getConversationMessage = await ConversationModel.findOne({
    //   $or: [
    //     { sender: data?.sender, receiver: data?.receiver },
    //     { sender: data?.receiver, receiver: data?.sender },
    //   ],
    // }).populate("messages").sort({updatedAt:-1});
    let getConversationMessage = await ConversationModel.findOne({
      $or: [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });

    io.to(data?.sender).emit("message", getConversationMessage?.messages);
    io.to(data?.receiver).emit("message", getConversationMessage?.messages);
  });

  //disconnect
  socket.on("disconnect", () => {
    onlineUser.delete(user?._id);
    console.log("Disconnect user", socket.id);
  });
});

module.exports = {
  app,
  server,
};
