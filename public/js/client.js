const socket = io(); // It will automatically use the host where the page is loaded



const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");

const audio = new Audio('tune.mp3'); // sound file

const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
    audio.play();
});

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = "";
});

socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
    audio.play();
});

socket.on('left', name => {
    append(`${name} left the chat`, 'left');
    audio.play();
});

function append(message, position) {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message', position);
    messageContainer.append(messageElement);
}
