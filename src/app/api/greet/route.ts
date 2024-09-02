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

    console.log('baseUrl: ', response);

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Fetched data:', data);
    return data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
}
