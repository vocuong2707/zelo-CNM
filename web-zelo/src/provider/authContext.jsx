// authContext.jsx
import React, { createContext, useCallback, useContext, useEffect } from "react";
import { socket } from "../socket";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = React.useState(localStorage.getItem("token"));
  const [user, setUser] = React.useState(localStorage.getItem("user"));


  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const isAuthenticated = useCallback(() => {
    if (localStorage.getItem("token")) {
      if (token == null) {
        setToken(localStorage.getItem("token"));
      }
      if (user == null) {
        setUser(localStorage.getItem("user"));
      }
      return true;
    } else {
      return !!token;
    }
  }, [token, user]);

  useEffect(() => {
    if (isAuthenticated()) {
      socket.connect();
      socket.emit("register", typeof user === "object" ? user.id : JSON.parse(user).id)
    }

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, user]);


  return (
    <AuthContext.Provider
      value={{ token, setToken, user, setUser, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
