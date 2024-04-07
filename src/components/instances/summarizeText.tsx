import { type AFC } from "@/lib/schema";

export const summarizeText:AFC<"summarizeText"> = ({data}) => {
    return ( 
        <div className="p-4 bg-gray-100">
            <div className="line-clamp-6">{data.text}</div>
        </div>
     );
}