import { type AFC } from "@/lib/schema";
import { Check, Cross } from "lucide-react";
import { Badge } from "../ui/badge";

export const sentEmail: AFC<"sentEmail"> = ({ data }) => {
  return (
    <div className="my-4 flex w-full justify-end">
      <Badge variant={data.status === "success" ? "outline" : "destructive"}>
        {data.status ? (
          <div className="flex items-center gap-2">
            <Check className="text-green-500" />
            <span className="text-xs text-gray-500">Email Send</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Cross className="text-red-500" />
            <span className="text-xs text-red-300">Failed to send email.</span>
          </div>
        )}
      </Badge>
    </div>
  );
};
