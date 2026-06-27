"use client";

import React, { useContext, useEffect, useState } from "react";
import Header from "./Header";
import { useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";
import { UserDetailContext } from "@/context/UserDetailContex";

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Double-check if your file is named 'user.ts' or 'users.ts' inside your convex folder!
  // If your file is named user.ts, keep api.user.CreateNewUser. If users.ts, use api.users.CreateNewUser
  const CreateUser = useMutation(api.user.CreateNewUser);
  const [userDetail, setUserDetail] = useState<any>(null);
  
  const { user } = useUser();

  const CreateNewUser = async () => {
    if (user) {
      try {
        const dbUser = await CreateUser({
          email: user?.primaryEmailAddress?.emailAddress ?? "",
          imageUrl: user?.imageUrl ?? "", // Added fallback string to avoid undefined schema errors
          name: user?.fullName ?? "",
        });
        
        console.log("Convex User Details Captured:", dbUser);
        setUserDetail(dbUser); // Save the returned database user to context!
      } catch (error) {
        console.error("Convex insertion failed:", error);
      }
    }
  };

  useEffect(() => {
    if (user) {
      CreateNewUser();
    }
  }, [user]);

  return (
    <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
      <div>
        <Header />
        {children}
      </div>
    </UserDetailContext.Provider>
  );
}

export default Provider;

export const useUserDetail = () => {
  return useContext(UserDetailContext);
};