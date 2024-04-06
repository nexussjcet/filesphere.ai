import { BellIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { signOut } from "next-auth/react";

// const notifications = [
//   {
//     title: "Your call has been confirmed.",
//     description: "1 hour ago",
//   },
//   {
//     title: "You have a new message!",
//     description: "1 hour ago",
//   },
//   {
//     title: "Your subscription is expiring soon!",
//     description: "2 hours ago",
//   },
//   {
//     title: "Your subscription is expiring soon!",
//     description: "2 hours ago",
//   }
// ]

type CardProps = React.ComponentProps<typeof Card>;

export function CardDemo({ className, ...props }: CardProps) {
  return (
    <Card className={cn("w-[380px]", className)} {...props}>
      <CardHeader>
        <CardTitle>Permissions</CardTitle>
        {/* <CardDescription>You have 3 unread messages.</CardDescription> */}
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className=" flex items-center space-x-4 rounded-md border p-4">
          {/* <BellIcon /> */}
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              Read data permission
            </p>
            <p className="text-sm text-muted-foreground">
              Access for all files in your drive to read
            </p>
          </div>
          <Switch />
        </div>
        <div className=" flex items-center space-x-4 rounded-md border p-4">
          {/* <BellIcon /> */}
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              Write data permission
            </p>
            <p className="text-sm text-muted-foreground">
              Access for all files in your drive for edit
            </p>
          </div>
          <Switch />
        </div>
        {/* <DropdownMenuItem
          onClick={() => {
            signOut({
              redirect: true,
              callbackUrl: "/",
            });
          }}
        >
          Log out
        </DropdownMenuItem> */}
      </CardContent>
      {/* <CardFooter>
        <Button className="w-full">
          <CheckIcon className="mr-2 h-4 w-4" /> Mark all as read
        </Button>
      </CardFooter> */}
    </Card>
  );
}
