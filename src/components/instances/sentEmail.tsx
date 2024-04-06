import { type AFC } from "@/lib/schema";
import { Button } from "../ui/button";
import { Check, Cross } from "lucide-react";
import { Badge } from "../ui/badge";

export const sentEmail:AFC<"sentEmail"> = ({data}) => {
    return ( 
        <div className="flex w-full justify-end my-4">
            <Badge  variant={
                
                data.status === "success" ? "outline" :
                "destructive"}>{data.status
                ? <div className="flex gap-2 items-center">
                    <Check className="text-green-500"/>
                    <span className="text-xs text-gray-500">Email Send</span>
                </div> : <div className="flex gap-2 items-center">
                    <Cross className="text-red-500"/>
                    <span className="text-xs text-red-300">Failed to send email.</span>
                </div>
                }</Badge>
        </div>
     );
}