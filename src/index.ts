import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { zodToJsonSchema } from "zod-to-json-schema";
import * as operations from "./operations/index.js";
import { PROMPTS, getPromptMessages } from "./operations/prompts.js";

const server = new Server(
  {
    name: "codeswarm-mcp-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
    },
  },
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "start-task",
        description: "Start a task by ID.",
        inputSchema: zodToJsonSchema(operations.StartTaskSchema),
      },
      {
        name: "submit-solution",
        description: "Submit a solution for a task.",
        inputSchema: zodToJsonSchema(operations.SubmitSolutionSchema),
      },
      {
        name: "get-tasks",
        description: "Get all tasks with optional search and filtering.",
        inputSchema: zodToJsonSchema(operations.GetTasksSchema),
      },
      {
        name: "get-agent-info",
        description: "Get agent info.",
        inputSchema: zodToJsonSchema(operations.GetAgentInfoSchema),
      },
      {
        name: "get-task-detail",
        description: "Get details for a task.",
        inputSchema: zodToJsonSchema(operations.GetTaskDetailSchema),
      },
      {
        name: "get-task-repository",
        description: "Get repository for a task.",
        inputSchema: zodToJsonSchema(operations.GetTaskRepositorySchema),
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
  if (!request.params.arguments) {
    throw new Error("Arguments are required");
  }

  const apiKey: string = process.env.CODESWARM_API_KEY || "";

  if (!apiKey) {
    throw new Error("CODESWARM_API_KEY is not set");
  }

  switch (request.params.name) {
    case "start-task": {
      const args = operations.StartTaskSchema.parse(request.params.arguments);
      const result = await operations.startTask(args, apiKey);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
    case "submit-solution": {
      const args = operations.SubmitSolutionSchema.parse(
        request.params.arguments,
      );
      const result = await operations.submitSolution(args, apiKey);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
    case "get-tasks": {
      const args = operations.GetTasksSchema.parse(request.params.arguments);
      const result = await operations.fetchTasks(args, apiKey);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
    case "get-agent-info": {
      const result = await operations.fetchAgentInfo(apiKey);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
    case "get-task-detail": {
      const args = operations.GetTaskDetailSchema.parse(
        request.params.arguments,
      );
      const result = await operations.fetchTask(args, apiKey);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
    case "get-task-repository": {
      const args = operations.GetTaskRepositorySchema.parse(
        request.params.arguments,
      );
      const result = await operations.fetchRepository(args, apiKey);
      return { content: [{ type: "text", text: JSON.stringify(result) }] };
    }
    default:
      throw new Error(`Unknown tool: ${request.params.name}`);
  }
});

server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: Object.values(PROMPTS),
  };
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  return getPromptMessages(name, args);
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("CodeSwarm MCP Server running on stdio");
}

runServer().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
