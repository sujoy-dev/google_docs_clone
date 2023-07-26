const mongoose = require("mongoose")
const Document = require("./Document")

const connect = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(
      "mongodb+srv://sujoybanerjee15:sujoydocs@sujoydocs.wwkdtsb.mongodb.net/"
    );
    console.log("Connected to MongoDB!");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB Disconnected!");
});

const io = require("socket.io")(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const defaultValue = ""

io.on("connection", (socket) => {
  socket.on("get-document", async documentID => {
    const document = await findOrCreateDocument(documentID)
    socket.join(documentID);
    socket.emit("load-document", document.data);

    socket.on("send-changes", delta => {
      socket.broadcast.to(documentID).emit("receive-changes", delta);
    });

    socket.on("save-document", async data => {
        await Document.findByIdAndUpdate(documentID, {data})
    })
  });
  connect();  
});

async function findOrCreateDocument(id) {
    if(id == null) return
    
    const document = await Document.findById(id)
    if(document) return document
    return await Document.create({_id: id, data: defaultValue})
}