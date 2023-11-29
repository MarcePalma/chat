"use client";
import { createContext, useState } from "react";

export const UserContext = createContext({} as any);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState({
    nombre: "",
    edad: 0,
    email: "",
    password: "",
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}