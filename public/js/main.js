const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


//Get username & Rome from the URL
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})


const socket = io();

// Join Chatroom
socket.emit('joinRoom', {username, room });

//Get room and users
socket.on('roomUsers', ({room, users}) => {
    outputRommName(room);
    outputUsers(users);
})

//Message from the Server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);

//Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

//Messsage Submition
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msg = e.target.elements.msg.value;

    // Emit Message to the Server
    socket.emit('chatMessage', msg);

    // clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

})

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>
    `;
    document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRommName(room) {
    roomName.innerText = room;
}

// Add users  to DOM
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
    }