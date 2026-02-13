import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
    ErrorCode,
    McpError
} from "@modelcontextprotocol/sdk/types.js";

import { rollDice } from "./tools/rolldice.js";
import { runInterviewSimulation } from "./tools/interviewSimulation.js";

/**
 * Digital Twin III - MCP Server
 * Secure, standardized tool-calling interface for AI governance.
 */
const server = new Server(
  { 
    name: "digital-twin-mcp", 
    version: "1.0.0" 
  },
  { 
    capabilities: { 
      tools: {} 
    } 
  }
);

/**
 * 1. Tool Definitions
 * Provides the AI with the metadata it needs to understand available actions.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "rollDice",
        description: "Rolls a standard 6-sided dice and returns the numerical result.",
        inputSchema: { 
          type: "object", 
          properties: {}, 
          required: [] 
        },
      },
      {
        name: "runInterviewSimulation",
        description: "Generates a structured interview simulation question set for a specific professional role.",
        inputSchema: {
          type: "object",
          properties: { 
            role: { 
                type: "string",
                description: "The job title or role to simulate (e.g., 'Cybersecurity Analyst')"
            } 
          },
          required: ["role"],
        },
      },
    ],
  };
});

/**
 * 2. Tool Execution Handler
 * Wrapped in standardized MCP content blocks to ensure client compatibility.
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    // Tool: rollDice
    if (name === "rollDice") {
      const result = await rollDice();
      return {
        content: [
          { 
            type: "text", 
            text: `The dice roll resulted in a: ${result}` 
          }
        ]
      };
    }

    // Tool: runInterviewSimulation
    if (name === "runInterviewSimulation") {
      if (typeof args?.role !== "string") {
        throw new McpError(ErrorCode.InvalidParams, "The 'role' argument must be a string.");
      }
      
      const simulation = await runInterviewSimulation({ role: args.role });
      // Ensure result is converted to string for the text block
      const simulationText = typeof simulation === 'string' ? simulation : JSON.stringify(simulation, null, 2);
      
      return {
        content: [
          { 
            type: "text", 
            text: simulationText 
          }
        ]
      };
    }

    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);

  } catch (error: any) {
    // Return errors gracefully to the AI rather than crashing the transport
    return {
      isError: true,
      content: [
        { 
          type: "text", 
          text: `Error executing ${name}: ${error.message || "Internal error"}` 
        }
      ]
    };
  }
});

/**
 * 3. Server Initialization
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Using stderr for logging ensures we don't pollute stdout (which breaks the protocol)
  console.error("Digital Twin MCP Server running on stdio");
}

main().catch((err) => {
  console.error("CRITICAL: MCP server failed to start:", err);
  process.exit(1);
});