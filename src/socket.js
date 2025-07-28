import { io } from "socket.io-client";
const socket = io("https://collab-code-backend-2-0.onrender.com/");
export default socket;