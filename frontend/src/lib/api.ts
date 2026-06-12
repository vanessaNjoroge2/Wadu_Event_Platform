export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const BASE_URL = '/api';

async function request<T>(
  method: string,
  path: string,
  body?: any
): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${path}`, config);

  if (response.status === 204) {
    return {} as T;
  }

  let json: any = null;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    try {
      json = await response.json();
    } catch (e) {
      // JSON parsing failed
    }
  }

  if (!response.ok) {
    if (response.status === 504 || response.status === 502) {
      throw new Error('Connection to backend API failed. Please make sure the backend server is running.');
    }
    throw new Error(json?.error || json?.message || `Request failed with status ${response.status}`);
  }

  if (!json) {
    throw new Error('Invalid response from server.');
  }

  return json.data as T;
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: any) => request<T>('POST', path, body),
  patch: <T>(path: string, body?: any) => request<T>('PATCH', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
};
