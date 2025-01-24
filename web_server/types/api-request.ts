type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface ApiRequest {
    method: HttpMethod,
    endpoint: string,
    query?: string,
    body?: unknown,
    action: "search" | "action" | "insight"
}