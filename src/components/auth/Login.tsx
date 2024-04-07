import { handleLogin } from "@/app/_actions";
import { auth } from "@/auth";
import { Button } from "../ui/button";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

const Login = async () => {
  const session = await auth();
  return (
    <>
      {session?.user ? (
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 z-50 flex items-center justify-center">
            <Link href="/dashboard">
              <Avatar>
                <AvatarImage src={session?.user?.image ?? ""} />
                <AvatarFallback>
                  {session.user?.name?.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
          <div className="h-20 w-20 animate-pulse rounded-full bg-gradient-to-b from-primary to-black transition-all ease-in-out" />
        </div>
      ) : (
        <form action={handleLogin}>
          <Button className=" flex-1 items-center gap-3 border border-primary bg-white text-sm font-semibold text-black hover:bg-black hover:text-foreground">
            <span>Sign in with Google</span>
            <Image
              src={"google.svg"}
              width={20}
              height={20}
              className=" object-contain"
              alt="Google"
            />
          </Button>
        </form>
      )}
    </>
  );
};

export default Login;
