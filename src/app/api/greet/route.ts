// utils/api.ts
export async function get<T>(url: string, options?: RequestInit): Promise<T> {
  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) {
    throw new Error('BASE_URL is not defined');
  }

  try {
    const response = await fetch(`${baseUrl}${url}`, {
      method: 'GET',
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
