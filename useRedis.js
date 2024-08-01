const io = require("socket.io")(8900, {
    cors: {
        origin: "http://localhost:3000",
    },
});
const redis = require("redis");
const client = redis.createClient();

// Add a new user to Redis
const addUser = (userId, socketId) => {
    client.hset("users", userId, socketId);
};

// Remove a user from Redis
const removeUser = (socketId) => {
    client.hgetall("users", (err, users) => {
        if (err) throw err;
        for (let userId in users) {
            if (users[userId] === socketId) {
                client.hdel("users", userId);
            }
        }
    });
};

// Get a user from Redis by their user ID
const getUser = (userId, callback) => {
    client.hget("users", userId, (err, socketId) => {
        if (err) throw err;
        callback(socketId);
    });
};

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        client.hgetall("users", (err, users) => {
            if (err) throw err;
            io.emit("getUsers", users);
        });
    });

    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        getUser(receiverId, (socketId) => {
            if (socketId) {
                io.to(socketId).emit("getMessage", {
                    senderId,
                    text,
                });
            } else {
                console.log(`User with ID ${receiverId} not found`);
            }
        });
    });

    socket.on("disconnect", () => {
        console.log("A user disconnected");
        removeUser(socket.id);
        client.hgetall("users", (err, users) => {
            if (err) throw err;
            io.emit("getUsers", users);
        });
    });
});
