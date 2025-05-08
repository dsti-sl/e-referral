// Custom hook for using the authentication context

import { useContext } from 'react';

import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  return useContext(AuthContext);
}
