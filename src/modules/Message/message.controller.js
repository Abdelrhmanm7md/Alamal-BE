import { messageModel } from "../../../database/models/message.model.js";
import { sio } from "../../../index.js";
import ApiFeature from "../../utils/apiFeature.js";
import catchAsync from "../../utils/middleWare/catchAsyncError.js";
import { userModel } from "../../../database/models/user.model.js";

const createmessage = catchAsync(async (req, res, next) => {
  function formatAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }
  let currentTime = new Date();
  let createdAt = formatAMPM(currentTime);
  req.body.date = createdAt;
  let content = req.body.content;
  let sender = req.body.sender;
  let receiver = req.body.receiver;

  const newmessage = new messageModel(req.body);
  const savedmessage = await newmessage.save();

  // sio.on("connection", (socket) => {
  //   console.log(`User Connected: ${socket.id}`);
  //   socket.on("disconnect", () => {
  //     console.log("User Disconnected", socket.id);
  //   });
  //   socket.on("newMessage", (data) => {
  //     console.log(data);
  //     socket.broadcast.emit("replay", data);
  //   });
  // });

  // sio.emit(`message_${req.body._id}`, { createdAt }, { content }, { sender },{reciver});
  senderName = await userModel.findOne({_id: req.body.sender })
  senderName = senderName.name
  sio.emit(`message_${req.body.sender}_${req.body.receiver}`, { createdAt }, { content }, { sender }, { receiver }, {senderName});
  res.status(201).json({
    message: "message created successfully!",
    savedmessage,
  });
});

const getAllmessageBySenderOrReciever = catchAsync(async (req, res, next) => {
  let ApiFeat = new ApiFeature(
    messageModel.find({$or:[ {$and: [{'sender':req.query.sender},{'receiver': req.query.receiver}]}, {$and: [{'sender':req.query.receiver},{'receiver': req.query.sender}]}]}),
    req.query
  );
  // .sort({ $natural: -1 })  for latest message
  // .pagination()

  let results = await ApiFeat.mongooseQuery;
  results = JSON.stringify(results);
  results = JSON.parse(results);
  if (!ApiFeat || !results) {
    return res.status(404).json({
      message: "No message was found!",
    });
  }
  res.json({
    message: "Done",
    results,
  });
});

export { createmessage, getAllmessageBySenderOrReciever };
