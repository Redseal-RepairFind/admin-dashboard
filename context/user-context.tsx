"use client";

import { createContext, useEffect, useState } from "react";

interface User {
  userId?: string;
  firstName?: string;
  lastName?: string;
  profilePhoto?: any;
  superAdmin?: boolean;
}

interface UserContextType {
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
}

const UserContext = createContext<UserContextType>({
  currentUser: { firstName: "" },
  setCurrentUser: () => {},
});

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User>({ firstName: "" });

  useEffect(() => {
    const stringifiedUser = sessionStorage.getItem("repairfind_session_user");
    const repairfind_session_user = stringifiedUser
      ? JSON.parse(stringifiedUser)
      : { firstName: "" };
    if (repairfind_session_user) {
      setCurrentUser(repairfind_session_user);
    }
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
