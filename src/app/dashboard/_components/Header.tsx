import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth, signOut } from "@/auth";

import Image from "next/image";
import Link from "next/link";
import {
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  Search,
  ShoppingCart,
  Users2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { handleLogout } from "@/app/_actions";

const Header = async () => {
  const session = await auth();
  return (
    <header className=" flex items-center justify-between gap-5 border-b pb-5">
      <div className="flex items-center gap-3">
        <Link href={"/"}>
          <h1>
            Filesphere.<span className="font-semibold text-blue-400">AI</span>
          </h1>
        </Link>{" "}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
          >
            <Avatar>
              <AvatarImage src={session?.user?.image ?? ""} />
              <AvatarFallback>
                {session?.user?.name?.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="pt-5">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href="/api/auth/signout">
              <Button type="submit" variant={"destructive"}>Logout</Button>
            </Link>
          </DropdownMenuItem>

        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default Header;
