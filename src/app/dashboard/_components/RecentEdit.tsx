import React from "react";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const files = [
  {
    id: "1",
    name: "File 1",
  },
  {
    id: "2",
    name: "File 2",
  },
  {
    id: "3",
    name: "File 3",
  },
];

const RecentEdit = () => {
  return (
    <div className=" flex flex-1 gap-3">
      {files.length > 0 ? (
        files?.slice(0, 3).map((file) => (
          <Card key={file.id} className="shrink-0 grow">
            <CardHeader>
              <CardTitle>{file.name}</CardTitle>
            </CardHeader>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
        ))
      ) : (
        <div>Not Found</div>
      )}
    </div>
  );
};

export default RecentEdit;
