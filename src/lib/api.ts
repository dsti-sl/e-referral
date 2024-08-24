// Utility functions for interacting with your API

export async function greetUser(username: string) {
  const response = await fetch(`/api/user?id=${username}`);
  const data = await response.json();
  return data;
}
