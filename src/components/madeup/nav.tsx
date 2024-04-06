import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { CircleUser } from "lucide-react";
import { CardDemo } from "@/components/madeup/permission_false";

type Props = {};

const Nav = (props: Props) => {
  const user = false;
  return (
    <>
      {user && (
        <div className=" m-1 flex h-14 flex-col items-center justify-center rounded-md">
          <div className="self-end p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="absolute right-0 top-12"
              >
                <CardDemo />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
    </>
  );
};

export default Nav;
