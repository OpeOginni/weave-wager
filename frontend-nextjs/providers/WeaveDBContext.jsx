import React, { createContext, useContext } from "react";
import useWeaveDB from "./WeaveDB.provider";

const WeaveDBContext = createContext(null);

export const WeaveDBProvider = ({ children }) => {
  const db = useWeaveDB();

  return (
    <WeaveDBContext.Provider value={db}>{children}</WeaveDBContext.Provider>
  );
};

export const useWeaveDBContext = () => useContext(WeaveDBContext);
