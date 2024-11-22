// Connect to the server
const socket = io();

// DOM Elements
const chat = document.getElementById('chat');
const form = document.getElementById('form');
const messageInput = document.getElementById('message');
const nameInput = document.getElementById('nameInput');
const saveYourName = document.getElementById('saveYourName');
const before = document.getElementById('before');
const after = document.getElementById('after');
const yourNameDisplay = document.getElementById('yourname');

// Listen for messages from the server
function appendMessage({ message, name, time }) {
    const outerElement = document.createElement('div');
    const msgElement = document.createElement('p');
    const senderElement = document.createElement('p');
    const timeElement = document.createElement('p');

    msgElement.textContent = `Message: ${message}`;
    senderElement.textContent = `Sender: ${name}`;
    timeElement.textContent = `Time: ${time}`;

    outerElement.appendChild(msgElement);
    outerElement.appendChild(senderElement);
    outerElement.appendChild(timeElement);

    outerElement.style.backgroundColor = "#ffffcc";
    outerElement.style.padding = "10px";
    outerElement.style.margin = "5px 0";
    outerElement.style.borderRadius = "5px";
    outerElement.style.width = "fit-content";

    chat.appendChild(outerElement);
    chat.scrollTop = chat.scrollHeight;
}

// socket.on('message', (data) => appendMessage(data));

socket.on('allMessages', (chats) => {
    chats.forEach(chat => {
        if (chat.type == 'image') {
            appendImage(chat);
        } else {
            appendMessage(chat);
        }
    });
});
 


function getTime()
{
    return String(new Date().getHours()) + ":" + String(new Date().getMinutes()) + ":" + String(new Date().getSeconds())
}

// Handle message form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const message = messageInput.value;
    if (message.trim()) {
        // Emit the message to the server
        socket.emit('chatMessage', {"message":message , "name":nameInput.value.trim() , "time": getTime() });
        messageInput.value = '';
    }
});

// Handle saving the user's name
saveYourName.addEventListener('click', (e) => {
    e.preventDefault();

    const yourName = nameInput.value.trim();
    if (yourName) {

        socket.emit('name', { name: yourName });
        yourNameDisplay.innerText = `You: ${yourName}`;

        // Toggle visibility
        before.style.display = 'none';
        after.style.display = 'block';
    }
});

const imageForm = document.getElementById('imageForm');
const imageInput = document.getElementById('imageInput');

// Handle image form submission
imageForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const file = imageInput.files[0];
    if (file) {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        if (data.url) {
            // Notify the server about the new image message
            socket.emit('chatMessage', { message: `${data.url}`, time: getTime() , type:'image' });
            imageInput.value= '';
        }
    }
});

function appendImage({ message, name, time }) {
    const outerElement = document.createElement('div');
    outerElement.innerHTML = `
        <p>Sender: ${name}</p> 
        <img width="300px" src="${message}"/>
        <p>Time: ${time}</p>
    `;
    // outerElement.appendChild(message);

    outerElement.style.backgroundColor = "#ffffcc";
    outerElement.style.padding = "10px";
    outerElement.style.margin = "5px 0";
    outerElement.style.borderRadius = "5px";
    outerElement.style.width = "fit-content";

    chat.appendChild(outerElement);
    chat.scrollTop = chat.scrollHeight;
}


const videoForm = document.getElementById('videoForm');
const videoInput = document.getElementById('videoInput');

// Handle video form submission
videoForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const file = videoInput.files[0]; // Corrected the variable name
    console.log("Video upload: ", file);

    if (file) {
        const formData = new FormData();
        formData.append('video', file);

        try {
            const response = await fetch('/upload-video', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (data.url) {
                // Notify the server about the new video message
                socket.emit('chatMessage', { message: data.url, time: getTime(), type: 'video' });
                videoInput.value = ''; // Clear the input
            }
            console.log("Uploaded Video URL:", data);
        } catch (error) {
            console.error("Error uploading video:", error);
        }
    }
});

// Function to append video to chat
function appendVideo({ message, name, time }) {
    const outerElement = document.createElement('div');
    outerElement.innerHTML = `
        <p>Sender: ${name}</p>
        <video controls width="300px" src="${message}"></video>
        <p>Time: ${time}</p>
    `;

    outerElement.style.backgroundColor = "#ffffcc";
    outerElement.style.padding = "10px";
    outerElement.style.margin = "5px 0";
    outerElement.style.borderRadius = "5px";
    outerElement.style.width = "fit-content";

    chat.appendChild(outerElement);
    chat.scrollTop = chat.scrollHeight;
}


const fileForm = document.getElementById('fileForm');
const fileInput = document.getElementById('fileInput');

fileForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const file = fileInput.files[0];
    console.log("File upload:", file);

    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/upload-file', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (data.url) {
                const fileMessage = {
                    message: data.url,
                    name: data.name,
                    type: 'file',
                    time: getTime(),
                };

                // Emit file message to the server
                socket.emit('chatMessage', fileMessage);

                // Reset file input
                fileInput.value = '';
            }
            console.log("Uploaded File Info:", data);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    }
});

function appendFile({ message, name, time }) {
    const outerElement = document.createElement('div');
    outerElement.innerHTML = `
            <p>Sender: ${name}</p>
            <a href="${message}" target="_blank" download>${name}</a>
            <p>Time: ${time}</p>
        `;

    outerElement.style.backgroundColor = "#ffffcc";
    outerElement.style.padding = "10px";
    outerElement.style.margin = "5px 0";
    outerElement.style.borderRadius = "5px";
    outerElement.style.width = "fit-content";

    chat.appendChild(outerElement);
    chat.scrollTop = chat.scrollHeight;
}


socket.on('message', (data) => {
    console.log("new msg came from server ! ",data)
    if (data.type == 'image') {
        appendImage(data);
    }
    else if( data.type == 'video'){
        appendVideo(data);
    } 
    else if( data.type == 'file'){
        appendFile(data);
    }
    else {
        appendMessage(data);
    }
});