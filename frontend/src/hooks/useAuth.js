import { useAuth } from '../context/AuthContext';

export const useAuth = () => {
  const { user, login, signup, logout, isAdmin, loading } = useAuth();

  return {
    user,
    isAdmin,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user
  };
};