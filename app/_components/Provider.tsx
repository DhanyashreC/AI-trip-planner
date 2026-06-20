"use client";

import React, { useContext, useEffect,useState } from "react";
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
  const CreateUser = useMutation(api.user.CreateNewUser);
  const[userDetail,setUserDetail]=useState<any>();
  
  const { user } = useUser();

  const CreateNewUser = async () => {
    if (user) {
      await CreateUser({
        email: user?.primaryEmailAddress?.emailAddress ?? "",
        imageUrl: user?.imageUrl ,
        name: user?.fullName ?? "",
      });
    }
  };

  useEffect(() => {
    user && CreateNewUser();
  }, [user]);

  return (
    
    <UserDetailContext.Provider value={{userDetail,setUserDetail}}>

    
    <div>
      <Header />
      {children}
    </div>
    </UserDetailContext.Provider>
  );
}

export default Provider;
export const useUserDetail = () => {
  return useContext(UserDetailContext );
}