const apiUrl = process.env.CODESWARM_API_URL ?? "http://localhost:3001";

export async function fetchWithAuth(
  endpoint: string,
  apiKey: string,
  options: any = {},
) {
  return fetch(`${apiUrl}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      "X-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
  }).then(async (response) => {
    if (!response.ok) {
      const error = await response.text();
      throw new Error(
        `API request failed: ${response.status} ${response.statusText} - ${error}`,
      );
    }
    return response.json();
  });
}
