// Authentication helper functions

export function isAuthenticated(): boolean {
  // Placeholder logic for checking authentication
  return !!localStorage.getItem('token');
}

export function login(username: string, password: string): boolean {
  // Placeholder logic for logging in a user
  if (username === 'admin' && password === 'password') {
    localStorage.setItem('token', 'dummy-token');
    return true;
  }
  return false;
}
