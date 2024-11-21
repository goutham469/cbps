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

socket.on('message', (data) => appendMessage(data));

socket.on('allMessages', (chats) => {
    chats.forEach(chat => appendMessage(chat));
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
