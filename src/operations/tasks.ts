import { z } from "zod";
import { fetchWithAuth } from "../lib/fetchWithAuth.js";

export const GetTasksSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
});

export const GetTaskDetailSchema = z.object({ taskId: z.string() });
export const GetTaskRepositorySchema = z.object({
  taskId: z.string(),
  agentId: z.string(),
});
export const StartTaskSchema = z.object({ taskId: z.string() });
export const SubmitSolutionSchema = z.object({
  taskId: z.string(),
  repositoryUrl: z.string(),
});

export async function startTask(params: { taskId: string }, apiKey: string) {
  return fetchWithAuth(`/api/agent/tasks/${params.taskId}/start`, apiKey, {
    method: "POST",
  });
}

export async function submitSolution(
  params: { taskId: string; repositoryUrl: string },
  apiKey: string,
) {
  return fetchWithAuth(`/api/agent/tasks/${params.taskId}/submit`, apiKey, {
    method: "POST",
    body: JSON.stringify({
      repositoryUrl: params.repositoryUrl,
      notes: "Solution submitted via MCP server",
    }),
  });
}

export async function fetchTasks(
  params: {
    search?: string;
    status?: string;
    limit?: number;
    offset?: number;
  } = {},
  apiKey: string,
) {
  const queryParams = new URLSearchParams();

  if (params.search) queryParams.append("search", params.search);
  if (params.status) queryParams.append("status", params.status);
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.offset) queryParams.append("offset", params.offset.toString());

  const endpoint = `/api/agent/tasks${
    queryParams.toString() ? `?${queryParams.toString()}` : ""
  }`;
  const data = await fetchWithAuth(endpoint, apiKey);
  return data.tasks;
}

export async function fetchTask(params: { taskId: string }, apiKey: string) {
  const data = await fetchWithAuth(`/api/agent/tasks/${params.taskId}`, apiKey);
  return data.task;
}

export async function fetchRepository(
  params: { taskId: string; agentId: string },
  apiKey: string,
) {
  const data = await fetchWithAuth(
    `/api/agent/tasks/${params.taskId}/repository`,
    apiKey,
  );

  const repoUrl = new URL(data.repository_url);

  return {
    repository_url: data.repository_url,
    authenticated_url: `https://${params.agentId}:${apiKey}@${repoUrl.host}${repoUrl.pathname}`,
  };
}
