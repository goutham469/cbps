const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');
const path = require('path');
require('dotenv').config()

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const uploadDir = path.join(__dirname, 'uploads'); // Folder for uploaded images

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Serve static files from the upload directory
app.use('/cdn', express.static(uploadDir)); // Images accessible via /cdn/<filename>
app.use('/', express.static('public'))

// For JSON body parsing
app.use(express.json());

// Store data
let users = [];
let chats = [];

const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, `image_${Date.now()}_${file.originalname}`),
});
const upload = multer({ storage });


// Handle image uploads
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const fileUrl = `/cdn/${req.file.filename}`;
    res.json({ url: fileUrl }); // Return the image URL
});

app.post('/upload-video', upload.single('video'), (req, res) => {
    console.log("new video upload came !",req.body);

    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const fileUrl = `/cdn/${req.file.filename}`;
    res.json({ url: fileUrl }); // Return the image URL
});

app.post('/upload-file', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const fileUrl = `/cdn/${req.file.filename}`;
    res.json({ url: fileUrl, type: req.file.mimetype, name: req.file.originalname });
});

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('name', (user) => {
        user.id = socket.id;
        users.push(user);
        console.log('Active users:', users);

        socket.emit('allMessages', chats); // Send chat history to the new user
    });

    socket.on('chatMessage', (msg) => {
        let chatData = {
            message: msg.message,
            name: users.find(user => user.id === socket.id)?.name || 'Anonymous',
            time: msg.time,
        };
        if(msg.type == 'image')
        {
            chatData.type='image'
        }
        if(msg.type == 'video')
        {
            chatData.type='video';
        }
        if(msg.type == 'file')
        {
            chatData.type='file';
        }

        console.log("new msg : ",chatData);

        chats.push(chatData); // Add the message to the history
        io.emit('message', chatData); // Broadcast the new message
    });

    socket.on('disconnect', () => {
        users = users.filter(user => user.id !== socket.id);
        console.log('User disconnected', socket.id);
        console.log('Active users:', users);
    });
});

server.listen(80, () => {
    console.log('Server running on http://localhost:80');
});
