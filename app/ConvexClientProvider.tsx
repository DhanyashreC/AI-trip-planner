"use client"
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import React, { ReactNode } from 'react'
import Provider from './_components/Provider';
const convex = new ConvexReactClient (process.env.NEXT_PUBLIC_CONVEX_URL!);
export function ConvexClientProvider({ children }: { children: ReactNode}) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
  <Provider>
    {children}
  </Provider>
}



