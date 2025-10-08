// import React, { createContext, useState, useContext, useEffect } from 'react';
// import axios from 'axios';

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [token, setToken] = useState(localStorage.getItem('token'));

//   // Set up axios interceptor for token
//   useEffect(() => {
//     if (token) {
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     } else {
//       delete axios.defaults.headers.common['Authorization'];
//     }
//   }, [token]);

//   // Check if user is authenticated on app load
//   useEffect(() => {
//     const checkAuth = async () => {
//       if (token) {
//         try {
//           const response = await axios.get('http://localhost:5000/api/users/me');
//           setUser(response.data);
//         } catch (error) {
//           console.error('Auth check failed:', error);
//           logout();
//         }
//       }
//       setLoading(false);
//     };

//     checkAuth();
//   }, [token]);

//   const login = async (email, password) => {
//     try {
//       const response = await axios.post('http://localhost:5000/api/users/signin', {
//         email,
//         password
//       });
      
//       const { token, role, id, userType } = response.data;
      
//       localStorage.setItem('token', token);
//       setToken(token);
      
//       // Get user details based on userType
//       let userResponse;
//       if (userType === 'recycleCentre') {
//         userResponse = await axios.get(`http://localhost:5000/api/recycleCentre/id?id=${id}`);
//       } else {
//         userResponse = await axios.get(`http://localhost:5000/api/users/user?id=${id}`);
//       }
      
//       setUser({ ...userResponse.data, role, userType });
      
//       return { success: true, role, userType };
//     } catch (error) {
//       return { 
//         success: false, 
//         message: error.response?.data?.message || 'Login failed' 
//       };
//     }
//   };

//   const register = async (userData, userType = 'customer') => {
//     try {
//       let endpoint;
      
//       switch (userType) {
//         case 'customer':
//           endpoint = 'http://localhost:5000/api/customers/signup';
//           break;
//         case 'recycleCentre':
//           endpoint = 'http://localhost:5000/api/recycleCentre/signup';
//           break;
//         case 'admin':
//           endpoint = 'http://localhost:5000/api/admins/signup';
//           break;
//         default:
//           endpoint = 'http://localhost:5000/api/customers/signup';
//       }
        
//       const response = await axios.post(endpoint, userData);
//       return { success: true, message: response.data.message };
//     } catch (error) {
//       return { 
//         success: false, 
//         message: error.response?.data?.message || 'Registration failed' 
//       };
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setToken(null);
//     setUser(null);
//     delete axios.defaults.headers.common['Authorization'];
//   };

//   const updateUser = async (userData) => {
//     try {
//       const formData = new FormData();
//       Object.keys(userData).forEach(key => {
//         if (userData[key] !== null && userData[key] !== undefined) {
//           formData.append(key, userData[key]);
//         }
//       });

//       // Add userType to formData
//       if (user?.userType) {
//         formData.append('userType', user.userType);
//       }

//       const response = await axios.put('http://localhost:5000/api/users/updateuser', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
      
//       setUser({ ...response.data.user, role: user.role, userType: user.userType });
//       return { success: true, message: response.data.message };
//     } catch (error) {
//       return { 
//         success: false, 
//         message: error.response?.data?.message || 'Update failed' 
//       };
//     }
//   };

//   const forgotPassword = async (email) => {
//     try {
//       const response = await axios.post('http://localhost:5000/api/users/forgotpassword', { email });
//       return { success: true, message: response.data.message };
//     } catch (error) {
//       return { 
//         success: false, 
//         message: error.response?.data?.message || 'Failed to send reset email' 
//       };
//     }
//   };

//   const resetPassword = async (token, password) => {
//     try {
//       const response = await axios.post(`http://localhost:5000/api/users/reset-password/${token}`, { password });
//       return { success: true, message: response.data.message };
//     } catch (error) {
//       return { 
//         success: false, 
//         message: error.response?.data?.message || 'Password reset failed' 
//       };
//     }
//   };

//   const value = {
//     user,
//     token,
//     loading,
//     login,
//     register,
//     logout,
//     updateUser,
//     forgotPassword,
//     resetPassword
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  // ✅ Use the new hospital-admin login endpoint
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API}/api/hospital/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        return { success: false, message: data?.message || "Login failed" };
      }

      setUser(data.user);
      setToken(data.token);

      return { success: true, role: data.user.role, user: data.user, token: data.token };
    } catch (e) {
      return { success: false, message: "Network error" };
    }
  };

  const logout = () => {
    setUser(null);
    setToken("");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
