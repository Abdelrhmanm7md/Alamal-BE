import { chatModel } from "../../../database/models/chat.model.js";
import { sio } from "../../../index.js";
import ApiFeature from "../../utils/apiFeature.js";
import catchAsync from "../../utils/middleWare/catchAsyncError.js";

const createChat = catchAsync(async (req, res, next) => {


  const newchat = new chatModel(req.body);
  const savedchat = await newchat.save();

  // sio.on("connection", (socket) => {
  //   console.log(`User Connected: ${socket.id}`);
  //   socket.on("disconnect", () => {
  //     console.log("User Disconnected", socket.id);
  //   });
  //   socket.on("newchat", (data) => {
  //     console.log(data);
  //     socket.broadcast.emit("replay", data);
  //   });
  // });

  res.status(201).json({
    message: "chat created successfully!",
    savedchat,
  });
});

const getChat = catchAsync(async (req, res, next) => {
  let ApiFeat = new ApiFeature(
    chatModel.find({ _id: req.params.id }),
    req.query
  );
  // .sort({ $natural: -1 })  for latest chat
  // .pagination()

  let results = await ApiFeat.mongooseQuery;
  results = JSON.stringify(results);
  results = JSON.parse(results);
  if (!ApiFeat || !results) {
    return res.status(404).json({
      chat: "No chat was found!",
    });
  }
  res.json({
    message: "Done",
    results,
  });
});
const getAllChatByAdmin = catchAsync(async (req, res, next) => {
  let ApiFeat = new ApiFeature(chatModel.find(), req.query);
  // .sort({ $natural: -1 })  for latest chat
  // .pagination()

  let results = await ApiFeat.mongooseQuery;
  results = JSON.stringify(results);
  results = JSON.parse(results);
  if (!ApiFeat || !results) {
    return res.status(404).json({
      chat: "No chat was found!",
    });
  }
  sio.emit(`chat_${savedchat._id}`, { user1 }, { user2 }, { messages });

  res.json({
    message: "Done",
    results,
  });
});
const pushMessage = catchAsync(async (req, res, next) => {
  let sender = req.body.messages.sender;
  let message = req.body.messages.message;
  let ApiFeat = new ApiFeature(chatModel.findByIdAndUpdate(
    { _id: req.params.id },
    { $push: { messages: req.body.messages } },
    { new: true },
  ), req.query);
  // .sort({ $natural: -1 })  for latest chat
  // .pagination()
  let results = await ApiFeat.mongooseQuery;
  results = JSON.stringify(results);
  results = JSON.parse(results);
  if (!ApiFeat || !results) {
    return res.status(404).json({
      chat: "No chat was found!",
    });
  }
  
  sio.emit(`chat_${req.params.id}`, { sender }, { message });

  res.json({
    message: "Done",
    results,
  });
});

export { createChat, getChat, getAllChatByAdmin,pushMessage };
