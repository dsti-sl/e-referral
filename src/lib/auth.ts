// auth.ts

export function isAuthenticated(): boolean {
  // Check if we're in the browser
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('token');
  }
  return false; // Return false if we're on the server
}

export function login(username: string, password: string): boolean {
  if (typeof window !== 'undefined') {
    if (username === 'admin' && password === 'password') {
      localStorage.setItem('token', 'dummy-token');
      return true;
    }
  }
  return false;
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
}

// Optionally, if useAuth is needed, you can define it like this
export function useAuth() {
  // Placeholder for useAuth logic
}
