"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
export default function Home() {
  //使用convexAuth提供的登出api
  const { signOut } = useAuthActions();

  return (
    <div>
      logged in!
      <Button onClick={() => signOut()}>sign out</Button>
    </div>
  );
}
