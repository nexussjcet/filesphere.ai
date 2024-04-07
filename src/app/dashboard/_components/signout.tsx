import { Button } from "@/components/ui/button";
import Link from "next/link";

const SignoutButton = () => {
  return (
    <Link href="/api/auth/signout">
      <Button>Sign out</Button>
    </Link>
  );
};

export default SignoutButton;
