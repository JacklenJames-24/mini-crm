import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = (credentials) => {
    const { email, password } = credentials;
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = storedUsers.find(u => u.email === email && u.password === password);

    if (foundUser) {
      setUser({ ...foundUser, name: email.split('@')[0] }); // Add name if needed
      localStorage.setItem('user', JSON.stringify({ ...foundUser, name: email.split('@')[0] }));
      return true; // Success
    } else {
      return false; // Failure
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}