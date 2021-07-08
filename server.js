if (process.env.NODE_ENV !== "production") require("dotenv").config();
const express = require("express");
// const bodyParser= require('body-parser');
// var nodemailer = require('nodemailer');
const app = express();
const server = require("http").Server(app);
// const bodyParser= require('body-parser');
var multer  = require('multer')
const io = require("socket.io")(server);
const { ExpressPeerServer } = require("peer");
const cookie = require("cookie-session");
const passport = require("passport");
const flash = require("express-flash");
const mongoose = require("mongoose");
const passportAuthenticator = require("./functions/passportStrategy");
const user = require("./schema/user");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
const peerUser = require("./schema/peerUser");
const Chat = require("./schema/Chat");
const room = require("./schema/rooms");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  
  filename: function (req, file, cb) {
    console.log(req.body.username_for_profile);
    // cb(null, file.originalname)

    cb(null, req.body.username_for_profile+".jpg")
  }
})
var upload = multer({ storage: storage })
const videoRoom = require("./routes/video");
const signup = require("./routes/auth/signup");
const login = require("./routes/auth/login");
const logout = require("./routes/auth/logout");
const index = require("./routes/index");
const newMeeting = require("./routes/newMeeting");
const { authorize } = require("passport");
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("database connected");
  });
passportAuthenticator(passport, user);
app.use(express.json());

app.use("/peerjs", peerServer);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
// var uploadRouter = require('./routes/upload');
// app.use('/upload', uploadRouter);
app.use(cookie({ maxAge: 30 * 24 * 60 * 60 * 1000, keys: ["soumenkhara"] }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static("public"));
app.use(flash());
app.use(require("express-ejs-layouts"));
// app.use(bodyParser.urlencoded({extended: true}))
app.set("layout", "layouts/layout");

app.post("/join-room", (req, res) => {
  res.redirect(`/${req.body.room_id}`);
});

var p;
app.use('/upload/*', (req,res)=>{
  res.sendFile(__dirname+"/views/index.html");
  // res.sendFile(__dirname+"/index.html");
});

app.use('/usermanual', (req,res)=>{
  res.sendFile(__dirname+"/views/usermanual.html");
  // res.sendFile(__dirname+"/index.html");
});

app.post('/profile-upload-single', upload.single('profile-file'), function (req, res, next) {
  // req.file is the `profile-file` file
  // req.body will hold the text fields, if there were any
  console.log(JSON.stringify(req.file))
  // var response = '<a href="/">Home</a><br>'
  // response += "Files uploaded successfully.<br>"
  // response += `<img src="uploads/${req.file.filename}" /><br>`
  // console.log(req.file.filename);
  // console.log(document.getElementById('username_for').value)
  res.redirect("/");

  return res.send(response)
})
// index route
app.use("/", index);
app.use('/redirect',(req,res)=>
{
  res.sendFile(__dirname+"/views/redirect.html");
});

app.use('/recorder', (req,res)=>{
  res.sendFile(__dirname+"/views/jsScreenRecorder-main/index.html");
  // res.sendFile(__dirname+"/index.html");
});

// user id get
app.get("/user", async (req, res) => {
  const roomData = await room.findOne({ roomId: req.query.room }).exec();
  res.json({
    user: await peerUser.findOne({ peerId: req.query.peer }).exec(),
    admin: roomData.admin,
  });
});

// new meeting
app.use("/new-meeting", newMeeting);

// login
app.use("/login", login);
app.use("/login/*", login);

// signup
app.use("/signup", signup);

// logout
app.use("/logout", logout);

// video room
app.use("/", videoRoom);

io.on("connection", (socket) => {
  
  //chat without joining
  socket.on("trying",async(roomsId,name,usersId)=>{
    // console.log(roomsId)
    // console.log(name)
    // console.log(usersId)
    // console.log("imhhere")
 
  Chat.find({RoomId:roomsId}).sort({createdAt:1}).then(result => {
    // console.log(result)
    socket.emit('output-messages', result,name,usersId)
})
  // chat
  socket.on("client-send", async(data) => {
    socket.join(roomsId)
    // console.log(data);
    // console.log(roomsId);
    await Chat({
      RoomId:roomsId,
      message:data,
      sender:name,
      UserID:usersId
      
    }).save().then(()=>{
      socket.broadcast.emit("client-podcast", data, name,roomsId);
    });
  });
});

  socket.on("join-room", async (roomId, peerId, userId, name, audio, video) => {
  //  console.log(roomId); 
  //  console.log(peerId);
  //  console.log(userId);
    // add peer details
    await peerUser({
      peerId: peerId,
      name: name,
      audio: audio,
      video: video,
    }).save();
    // add room details
    var roomData = await room.findOne({ roomId: roomId }).exec();
    if (roomData == null) {
      await room({
        roomId: roomId,
        userId: userId,
        admin: peerId,
        count: 1,
      }).save();
      socket.join(roomId);
      roomData = { count: 1 };
    } else if (roomData.userId == userId) {
      if (roomData.admin != peerId)
        await room.updateOne(
          { roomId: roomId },
          { admin: peerId, count: roomData.count + 1 }
        );
        socket.join(roomId);
    } else
      await room.updateOne({ roomId: roomId }, { count: roomData.count + 1 });
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected",
        peerId,
        name,
        audio,
        video,
        roomData.count + 1
      );
    socket.on("audio-toggle", async (type) => {
      await peerUser.updateOne({ peerId: peerId }, { audio: type });
      socket.to(roomId).broadcast.emit("user-audio-toggle", peerId, type);
    });
    socket.on("video-toggle", async (type) => {
      await peerUser.updateOne({ peerId: peerId }, { video: type });
      socket.to(roomId).broadcast.emit("user-video-toggle", peerId, type);
    });

    // Chat.find().then(result => {
  //     Chat.find({RoomId:roomId}).sort({createdAt:1}).then(result => {
  //     console.log(result)
  //     socket.emit('output-messages', result,name)
  // })
    // chat
    socket.on("client-send", async(data) => {
      
      console.log(data);
      console.log(roomId);
      await Chat({
        RoomId:roomId,
        message:data,
        sender:name
        
      }).save().then(()=>{
        socket.to(roomId).broadcast.emit("client-podcast", data, name);
      });
    });
    socket.on("disconnect", async () => {
      roomData = await room.findOne({ roomId: roomId }).exec();
      await room.updateOne({ roomId: roomId }, { count: roomData.count - 1 });
      // remove peer details
      await peerUser.deleteOne({ peerId: peerId });
      socket
        .to(roomId)
        .broadcast.emit("user-disconnected", peerId, roomData.count - 1);
    });
  });
});
server.listen(process.env.PORT || 3000);
