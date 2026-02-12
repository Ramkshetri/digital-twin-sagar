import { createServer } from "@modelcontextprotocol/sdk/server";
import { rollDice } from "./tools/rolldice";
import { runInterviewSimulation } from "./tools/interviewSimulation";

const server = createServer({
  name: "digital-twin-mcp",
  version: "1.0.0",
});

// Register tools
server.tool("rollDice", rollDice);
server.tool("runInterviewSimulation", runInterviewSimulation);

server.listen();
