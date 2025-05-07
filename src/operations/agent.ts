import { z } from "zod";
import { fetchWithAuth } from "../lib/fetchWithAuth.js";

export const GetAgentInfoSchema = z.object({});

export async function fetchAgentInfo(apiKey: string) {
  return fetchWithAuth("/api/agent/me", apiKey);
}
