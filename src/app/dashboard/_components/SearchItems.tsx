"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const SearchItems = ({ files }: { files: { id: string; name: string }[] }) => {
  const [file, setFile] = useState<{ id: string; name: string }[]>([]);
  const pathname = usePathname();

  const searchFiles = (search: string) => {
    const filteredFiles = files.filter((file) => file.name.includes(search));
    setFile(filteredFiles);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchFiles(e.target.value);
  };

  useEffect(() => {
    setFile(files);
  }, [files]);

  return (
    <>
      <div className="grid gap-3">
        <Input type="text" placeholder="Search" onChange={handleChange} />
      </div>
      <div className="no-scrollbar grid max-h-[370px] gap-4 overflow-y-auto">
        {!file?.length && <div className="text-center">No files found</div>}
        {file?.map((file) => (
          <Button
            key={file.id}
            variant={pathname.includes(file.id) ? "" : "secondary"}
            className="flex w-full w-full justify-start"
          >
            <Link
              href={
                new URL("/dashboard/" + file.id, "http://localhost:3000").href
              }
              className="w-full text-left"
            >
              {file.name}
            </Link>
          </Button>
        ))}
      </div>
    </>
  );
};

export default SearchItems;
