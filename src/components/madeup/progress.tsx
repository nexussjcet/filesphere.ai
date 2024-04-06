import React from "react";
import { ChainReturn } from "@/initiative/chain";
import { Schema } from "@/lib/schema";
import {
  FolderSync,
  NotebookPen,
  ScanText,
  Search,
  Send,
  Shrink,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";

type TimelineData = {
  value: string;
  key: string;
  iteration: number;
  permission: boolean;
  error?: string;
};

import { summarizeText as SummarizeText } from "../instances/summarizeText";
import { convertFileFormat as ConvertFileFormat } from "../instances/convertFileFormat";
import { findOneContact as FindOneContact } from "../instances/findContact";
import { readFile as ReadFile } from "../instances/readFile";
import { searchFile as SearchFile } from "../instances/searchFile";
import { writeFile as WriteFile } from "../instances/writeFile";
import { sentEmail as SentEmail } from "../instances/sentEmail";

const getComponent = (value: keyof ChainReturn<typeof Schema>) => {
  switch (value) {
    case "summarizeText":
      return SummarizeText;
    case "convertFileFormat":
      return ConvertFileFormat;
    case "findOneContact":
      return FindOneContact;
    case "sentEmail":
      return SentEmail;
    case "readFile":
      return ReadFile;
    case "searchFile":
      return SearchFile;
    case "writeFile":
      return WriteFile;
    default:
      return null;
  }
};
const getLogo = (value: keyof ChainReturn<typeof Schema>) => {
  switch (value) {
    case "summarizeText":
      return <Shrink />;
    case "convertFileFormat":
      return <FolderSync />;
    case "findOneContact":
      return <Search />;
    case "sentEmail":
      return <Send />;
    case "readFile":
      return <ScanText />;
    case "searchFile":
      return <Search />;
    case "writeFile":
      return <NotebookPen />;
    default:
      return null;
  }
};
type TimelineProps = ChainReturn<typeof Schema>;

const Timeline: React.FC<{ data: TimelineProps }> = ({ data }) => {
  return (
    <ol className="timeline max-w-700 mx-auto flex flex-col border-l-2 border-gray-200 py-8 pl-8 text-base">
      {Object.entries(data).map(([key, value], index) => {
        const Component = getComponent(key as keyof ChainReturn<typeof Schema>);

        return (
          <li key={index} className="timeline-item mt-8 flex gap-8">
            <span className="timeline-item-icon -ml-14 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-gray-400">
              {getLogo(key as keyof ChainReturn<typeof Schema>)}
            </span>
            <div
              className={`timeline-item-description flex w-[300px] items-center rounded-xl ${
                value.permission
                  ? "bg-green-200"
                  : !value.permission
                    ? "bg-red-400"
                    : ""
              } p-5`}
            >
              <p className="flex items-center gap-5 rounded-xl">
                {Component && <Component data={value.value} />}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
};

export default Timeline;

// return(<>{JSON.stringify(data)}</>)

// Function to determine the corresponding icon based on the value
// const getIcon = (value: string) => {
//   const status = value.toLowerCase().includes("searching")
//     ? "searching"
//     : value.toLowerCase().includes("sending")
//       ? "sending"
//       : value.toLowerCase().includes("reading")
//         ? "reading"
//         : value.toLowerCase().includes("writing")
//           ? "writing"
//           : value.toLowerCase().includes("summarizing")
//             ? "summarizing"
//             : value.toLowerCase().includes("converting")
//               ? "converting"
//               : "searching";

// // Function to generate random background color
// const getRandomColor = () => {
//   const colors = [
//     "bg-red-200",
//     "bg-blue-200",
//     "bg-green-200",
//     "bg-yellow-200",
//   ];
//   return colors[Math.floor(Math.random() * colors.length)];
// };

// return (
//   <ol className="timeline max-w-700 mx-auto flex h-[500px] w-96 flex-col border-l-2 border-gray-200 py-8 pl-8 text-base ">
//     {timelineData.map((data, index) => (
//       <li key={index} className="timeline-item mt-8 flex gap-8">
//         <span className="timeline-item-icon -ml-14 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-gray-400">
//           {getIcon(data.value)}
//         </span>
//         <div
//           className={`timeline-item-description flex items-center  rounded-xl ${
//             data.permission
//               ? "bg-green-200"
//               : !data.permission
//                 ? "bg-red-400"
//                 : getRandomColor()
//           } p-5`}
//         >
//           <p className="flex items-center gap-5 rounded-xl">
//             {getIcon(data.value)}
//             {data.value}
//           </p>
//         </div>
//       </li>
//     ))}
//   </ol>
// );
// };

// export default Timeline;
