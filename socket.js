// socket.js
const socketIo = require("socket.io");
const User = require("./model/model");

let io;

module.exports = {
  init: function (server) {
    io = socketIo(server);
    io.on("connection", (socket) => {
      console.log("A user connected");

      socket.on("joinLiveUsers", async (userData) => {
        console.log(userData);

        try {
          const updatedUser = await User.findOneAndUpdate(
            { email: userData.email },
            { socketId: socket.id },
            { new: true }
          );
          console.log(
            `User ${updatedUser.email} joined with socket ID: ${updatedUser.socketId}`
          );

          // Join the Socket.IO room
          socket.join("liveusers");

          // Emit event to update clients with updated user list
          io.to("liveusers").emit("update-live-users", await getLiveUsers());
        } catch (err) {
          console.error("Error updating socket ID:", err);
        }
      });

      // Function to fetch all users with valid socket IDs
      async function getLiveUsers() {
        return await User.find({
          socketId: { $exists: true, $ne: null },
        }).exec();
      }

      // Handle disconnection
      socket.on("disconnect", async () => {
        console.log("A user disconnected");

        // Remove socket ID from user in MongoDB
        try {
          const updatedUser = await User.findOneAndUpdate(
            { socketId: socket.id },
            { socketId: null },
            { new: true }
          );
          console.log(updatedUser);
          console.log(
            `User ${updatedUser.email} disconnected and socket ID removed`
          );
        } catch (err) {
          console.error("Error removing socket ID:", err);
        }

        // Emit event to update clients with updated user list
        io.to("live users").emit("update-live-users", await getLiveUsers());
      });
    });
  },
  getIo: function () {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
  getIo: function () {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
  clearAllData: async function () {
    try {
      // Disconnect all clients
      io.of("/").sockets.forEach((socket) => {
        socket.disconnect(true);
      });

      // Clear all socket IDs in the database
      await User.updateMany({}, { socketId: null });

      console.log("All clients disconnected and socket IDs cleared");
    } catch (err) {
      console.error("Error clearing all data:", err);
    }
  },
};
