messages = {};
let socket;
let token;
let currentUserName;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
let isGroupChat = false; // Default to false, indicating it's not a group chat
let currentChatName = ""; // Stores the current chat (group or user name)
let userList = [];

const loginContainer = document.getElementById("loginContainer");
const chatAppContainer = document.getElementById("chatAppContainer");
const nameInput = document.getElementById("nameInput");
const loginButton = document.getElementById("loginButton");
const chatTitle = document.getElementById("chatTitle");
const chatMessages = document.getElementById("chatMessages");
const messageInput = document.getElementById("messageInput");
const userNameDisplay = document.getElementById("userName");
const createChatModal = document.getElementById("createChatModal");
const privateChatForm = document.getElementById("privateChatForm");
const privateChatUserName = document.getElementById("privateChatUserName");

loginButton.addEventListener("click", async () => {
  const userName = nameInput.value.trim();
  if (userName.length === 0) {
    alert("Name cannot be empty");
    return;
  }

  try {
    console.log("Attempting to login with name:", userName);
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: userName }),
    });

    console.log("Login response status:", response.status);
    const responseText = await response.text();
    console.log("Login response text:", responseText);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = JSON.parse(responseText);
    console.log("Parsed response data:", data);

    token = data.access_token;
    currentUserName = userName;
    userNameDisplay.textContent = userName;
    initializeChat();
  } catch (error) {
    console.error("Login error:", error);
    alert("Login failed: " + error.message);
  }
});

function initializeChat() {
  loginContainer.style.display = "none";
  chatAppContainer.style.display = "flex";

  console.log("Initializing chat connection...");

  socket = io("http://localhost:3000", {
    transports: ["websocket"],
    path: "/socket.io/",
    auth: { token },
    reconnection: true,
    reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
    reconnectionDelay: 1000,
  });

  socket.on("connect", () => {
    console.log("Connected to the server");
    reconnectAttempts = 0;
    addSystemMessage("Connected to chat server");
  });

  socket.on("connect_error", (error) => {
    console.error("Connection error:", error);
    reconnectAttempts++;
    addSystemMessage(`Connection error: ${error.message}`);

    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      addSystemMessage(
        "Maximum reconnection attempts reached. Please refresh the page."
      );
    }
  });

  socket.on("disconnect", (reason) => {
    console.warn("Disconnected from server:", reason);
    addSystemMessage(
      "Disconnected from server. " +
        (reason === "io server disconnect"
          ? "Please refresh the page."
          : "Attempting to reconnect...")
    );
  });

  socket.on("messageError", (error) => {
    console.error("Message error:", error);
    addSystemMessage(`Error sending message: ${error.error}`);
  });

  socket.on("privateMessage", (messageData) => {
    console.log("Received private message:", messageData);
    addChatMessage(messageData);
  });

  socket.on("groupMessage", (messageData) => {
    console.log("Received group message:", messageData);
    addChatMessage(messageData);
  });

  socket.on("userConnected", (data) => {
    console.log("User connected:", data);
    addSystemMessage(`${data.user} has joined the chat`);
  });

  socket.on("userDisconnected", (data) => {
    console.log("User disconnected:", data);
    addSystemMessage(`${data.userId} has left the chat`);
  });
}

function addSystemMessage(text) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("system-message");
  messageElement.innerHTML = `<span class="timestamp">${new Date().toLocaleTimeString()}</span> ${text}`;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addChatMessage({ from, text, timestamp }) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message");

  // Determine if the message was sent by the current user
  // const currentUserName = socket.auth?.name || currentUserName; // Assuming you store the current user's name
  const displayName = from === currentUserName ? "You" : from;

  messageElement.innerHTML = `<span class="timestamp">${new Date(
    timestamp
  ).toLocaleTimeString()}</span> <strong>${displayName}:</strong> ${text}`;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop;
}

///////////////////////////////////////////////////WORKING BUT DOUBLES IN GROUP CHAT////////////////////////////////////////////////////
function sendMessage() {
  if (!currentChatName) {
    alert("Please select a chat to send a message.");
    return;
  }

  const messageText = messageInput.value.trim();
  if (messageText.length === 0) {
    alert("Message cannot be empty.");
    return;
  }

  // Ensure currentUserName is available here
  if (!currentUserName) {
    alert("User name not set. Please log in again.");
    return;
  }

  const messageData = {
    from: currentUserName,
    text: messageText,
    timestamp: Date.now(),
  };

  // Emit the message to the server
  if (isGroupChat) {
    messageData.groupName = currentChatName;
    socket.emit("groupMessage", messageData);
  } else {
    messageData.toUserName = currentChatName;
    socket.emit("privateMessage", messageData);
  }

  // Add the message to the UI immediately for the sender
  addChatMessage({
    from: "You",
    text: messageText,
    timestamp: Date.now(),
  });

  // Clear the message input field
  messageInput.value = "";
}
////////////////////////////////////////////////////////////////////////////////////

function openCreateChatModal() {
  createChatModal.style.display = "block";
  loadUserList(); // Load user list dynamically when the modal is opened
}

function closeCreateChatModal() {
  createChatModal.style.display = "none";
  privateChatForm.style.display = "none";
}

function selectChatType(type) {
  if (type === "private") {
    privateChatForm.style.display = "block";
    groupChatForm.style.display = "none";
    isGroupChat = false;
  } else if (type === "group") {
    privateChatForm.style.display = "none";
    groupChatForm.style.display = "block";
    isGroupChat = true;
  }
}

async function loadUserList() {
  try {
    // Fetch all users from the backend
    const response = await fetch("http://localhost:3000/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching user list: ${response.statusText}`);
    }

    userList = await response.json();

    const userListDiv = document.getElementById("userList");
    userListDiv.innerHTML = ""; // Clear existing user list

    // Create checkboxes for each user
    userList.forEach((user) => {
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = user.id;
      checkbox.id = `user-${user.id}`;

      const label = document.createElement("label");
      label.htmlFor = `user-${user.id}`;
      label.textContent = user.name;

      const div = document.createElement("div");
      div.appendChild(checkbox);
      div.appendChild(label);
      userListDiv.appendChild(div);
    });
  } catch (error) {
    console.error("Error loading user list:", error);
  }
}

function addGroupChat(groupName) {
  const chatListItem = document.createElement("div");
  chatListItem.classList.add("chat-list-item");
  chatListItem.textContent = `Group Chat: ${groupName}`;
  chatListItem.onclick = () => selectChat(groupName, true);
  document.querySelector(".chat-list-container").appendChild(chatListItem);
}

// After the group is successfully created or joined, emit an event to join the group room
function joinGroupRoom(groupName) {
  socket.emit("joinGroup", { groupName });
}

async function createGroupChat() {
  const groupName = document.getElementById("groupNameInput").value.trim();
  if (groupName.length === 0) {
    alert("Group name cannot be empty");
    return;
  }

  const participantInputs = document.querySelectorAll(".participant-input");
  const participantNames = Array.from(participantInputs)
    .map((input) => input.value.trim())
    .filter((name) => name.length > 0);

  if (participantNames.length === 0) {
    alert("You must enter at least one participant's name to create a group");
    return;
  }

  try {
    const userIds = [];

    for (const name of participantNames) {
      const response = await fetch(
        `http://localhost:3000/users/search?name=${name}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Assuming you need to add an authorization token
          },
        }
      );

      if (!response.ok) {
        throw new Error(`User not found: ${name}`);
      }

      const user = await response.json();
      userIds.push(user.id);
    }

    // Use joinOrCreate endpoint to either create a new group or join an existing one
    const joinOrCreateResponse = await fetch(
      "http://localhost:3000/groups/join-or-create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Assuming you need to add an authorization token
        },
        body: JSON.stringify({ name: groupName, userIds }),
      }
    );

    if (!joinOrCreateResponse.ok) {
      const errorMessage = await joinOrCreateResponse.text();
      throw new Error(
        `Error joining or creating group: ${joinOrCreateResponse.status} - ${errorMessage}`
      );
    }

    const group = await joinOrCreateResponse.json();
    console.log("Group created or joined successfully:", group);

    // Add the new or existing group chat to the chat list
    addGroupChat(group.name);
    closeCreateChatModal();

    // Emit an event to join the group room
    joinGroupRoom(group.name);
  } catch (error) {
    console.error("Error creating or joining group chat:", error);
    alert("Failed to create or join group chat: " + error.message);
  }
}

function selectChat(chatName, isGroup) {
  isGroupChat = isGroup;
  currentChatName = chatName;
  chatTitle.textContent = chatName;
  chatMessages.innerHTML = "";

  if (messages[chatName]) {
    messages[chatName].forEach(addChatMessage);
  }
}

function addPrivateChat(userName) {
  const chatListItem = document.createElement("div");
  chatListItem.classList.add("chat-list-item");
  chatListItem.textContent = `Private Chat with ${userName}`;
  chatListItem.onclick = () => selectChat(userName, false);
  document.querySelector(".chat-list-container").appendChild(chatListItem);
}

function addParticipantInput() {
  const participantsListDiv = document.getElementById("participantsList");

  const newInput = document.createElement("input");
  newInput.type = "text";
  newInput.className = "participant-input";
  newInput.placeholder = "Enter participant name...";

  participantsListDiv.appendChild(newInput);
}

async function createPrivateChat() {
  const userName = privateChatUserName.value.trim();
  if (userName.length === 0) {
    alert("User name cannot be empty");
    return;
  }
  addPrivateChat(userName);
  closeCreateChatModal();

  try {
    const response = await fetch(
      `http://localhost:3000/users/search?name=${userName}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`User not found: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("User found:", data);
    selectChat(userName);
    closeCreateChatModal();
  } catch (error) {
    console.error("Error searching user:", error);
    alert("User not found: " + error.message);
  }
}
