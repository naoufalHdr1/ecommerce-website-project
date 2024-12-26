import React, { createContext, useContext, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

// Create a context for notifications
const NotificationContext = createContext();

// Custom hook to use the notification context
export const useNotifications = () => {
  return useContext(NotificationContext);
};

// Notification provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = "success") => {
    toast[type](message, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <ToastContainer />
    </NotificationContext.Provider>
  );
};
