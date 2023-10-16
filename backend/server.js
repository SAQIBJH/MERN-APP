const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes"); 
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middlewares/errormiddleware");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();
connectDB();
app.get("/api/chats", (req,res) => {
    res.send(chats);
})
app.get("/", (req, res) => {
    res.send("welcome");
})

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
// message Routes
app.use("/api/message", messageRoutes);

// --------------------------deployment------------------------------

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// --------------------------deployment------------------------------



// error handling if user go to other route which is not defined
app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
// console.log(process.env.PORT);

const server = app.listen(PORT, console.log(`Server started at ${PORT}`));

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
    }
})

io.on("connection", (socket) => {
    // console.log("connected to socket.io")
    socket.on('setup', (userData) => {
        
        socket.join(userData._id);
        socket.emit("connected")

        
    })

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("user joined " + room)
    })

    socket.on('typing', (room) => {
        socket.in(room).emit('typing')
    })
    socket.on('stop typing', (room) => {
        socket.in(room).emit('stop typing')
    })

    socket.on('new message', (newMessageReceived) => {
      
        var chat = newMessageReceived.chat
        
        if (!chat.users)
            return console.log("chat. users not defined")
        

        chat.users.forEach(user => {
            if (user._id == newMessageReceived.sender._id) return;
            socket.in(user._id).emit("message received",newMessageReceived)
            
        });
    })

    socket.off("setup", () => {
        console.log("User Disconnected")
        socket.leave(userData._id);
    })


})