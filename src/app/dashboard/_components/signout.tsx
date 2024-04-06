"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

const SignoutButton = () => {
  return (
    <Button
      variant={"default"}
      onClick={() =>
        signOut({
          redirect: true,
          callbackUrl: "/",
        })
      }
    >
      Sign Out
    </Button>
  );
};

export default SignoutButton;
