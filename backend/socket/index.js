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

  //Todo=> Sending online user and previous chat to frontend
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

    //Todo=> Get Previous Message
    let getConversationMessage = await ConversationModel.findOne({
      $or: [
        { sender: user?._id, receiver: userId },
        { sender: userId, receiver: user?._id },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });

    socket.emit("message", getConversationMessage?.messages);
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

  //!sidebar
  socket.on("sidebar", async (userId) => {
    console.log("sidebar userId", userId);
    const currentUserConversation = await ConversationModel.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .sort({ updatedAt: -1 })
      .populate("messages")
      .populate("sender")
      .populate("receiver");

    const conversation = currentUserConversation.map((conv) => {
      // const unSeenMsg=conv.messages.reduce((prev,current)=>prev+(current.seen?0:1),0)
      const unSeenMsg = conv.messages.reduce(
        (prev, current) => prev + (current.seen ? 0 : 1),
        0
      );

      return {
        _id: conv?._id,
        sender: conv?.sender,
        receiver: conv?.receiver,
        unSeenMsg: unSeenMsg,
        lastMsg: conv?.messages[conv.messages.length - 1],
      };
    });
    console.log("conversation", conversation);

    socket.emit("conversation", conversation);
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
