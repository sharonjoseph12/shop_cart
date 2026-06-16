import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage on load
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (role, email = '') => {
    setLoading(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockUser = {
      id: `usr_${Math.random().toString(36).substr(2, 9)}`,
      name: `Demo ${role}`,
      email: email || `demo@${role.toLowerCase()}.com`,
      role: role, // 'Customer', 'Seller', 'Delivery'
      avatar: `https://ui-avatars.com/api/?name=${role}&background=random`
    };

    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    setLoading(false);
  };

  const register = login; // alias for demo

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
