import { Folder } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

const folders = ["Home", "Applications", " libraries", " libraries"];

const FoldersList = () => {
  return (
    <div>
      <div className="flex flex-1 gap-3">
        {folders.map((folder) => (
          <Card key={folder}>
            <CardHeader></CardHeader>
            <CardContent className="flex justify-center items-center">
              <Folder className="w-20  h-20 text-[#1f6feb]"/>
            </CardContent>
            <CardFooter className="flex items-center justify-center">
              <p>{folder}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FoldersList;
