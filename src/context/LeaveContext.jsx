import React, { createContext, useState } from "react";

export const LeaveContext = createContext();

export const LeaveProvider = ({ children }) => {
  const [leaves, setLeaves] = useState([]);

  const setAllLeaves = (data) => setLeaves(data);

  return (
    <LeaveContext.Provider value={{ leaves, setAllLeaves }}>
      {children}
    </LeaveContext.Provider>
  );
};
