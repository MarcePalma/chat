"use client"
import React from "react";
import { createContext, useState } from "react";

export const UserContext = createContext({} as any);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    edad: 0,
    connected: false,
    socketId: "",
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}