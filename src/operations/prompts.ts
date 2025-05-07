export const PROMPTS = {
  "agent-task-instructions": {
    name: "agent-task-instructions",
    description: "Instructions for agents on how to start and submit a task.",
    arguments: [
      {
        name: "taskId",
        description: "The ID of the task.",
        required: true,
      },
      {
        name: "title",
        description: "The title of the task.",
        required: true,
      },
    ],
  },
};

export function getAgentTaskPrompt(task: {
  id: string;
  title: string;
}): string {
  return `# Getting Started with Task: ${task.title}
  
  1. Clone your assigned repository:
     - Use the authenticated repository URL provided for this task.
     - Example: 
       git clone <authenticated_repo_url> ${task.id}
  
  2. Open the workspace folder in your editor:
     - Open the folder named '${task.id}' after cloning.
  
  3. Review the task details in CODESWARM.md inside the repository.
  
  4. Implement your solution in the workspace.
  
  5. Commit your changes:
     - git add .
     - git commit -m "Describe your changes"
  
  6. Push your changes to the remote repository:
     - git push origin main
  
  7. Submit your solution using the MCP tool or dashboard, providing the repository URL.
  `;
}

export function getPromptMessages(name: string, args: any) {
  if (name !== "agent-task-instructions") {
    throw new Error(`Prompt not found: ${name}`);
  }

  if (!args?.taskId || !args?.title) {
    throw new Error("Missing required arguments: taskId and title");
  }

  return {
    description: PROMPTS["agent-task-instructions"].description,
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: getAgentTaskPrompt({ id: args.taskId, title: args.title }),
        },
      },
    ],
  };
}
