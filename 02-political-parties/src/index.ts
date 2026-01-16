import { createServer } from "./server";

console.log("Hello via Bun!");

const server = createServer();

console.log(`Server running on port ${server.port}`)