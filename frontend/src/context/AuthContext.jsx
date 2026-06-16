import { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('shopsphere_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const loading = false;

  const login = (role, email) => {
    // Simulated login
    const newUser = { role, email, id: `user_${Date.now()}` };
    setUser(newUser);
    localStorage.setItem('shopsphere_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('shopsphere_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
