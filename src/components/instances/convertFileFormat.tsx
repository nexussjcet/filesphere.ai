import { type AFC } from "@/lib/schema";

export const convertFileFormat:AFC<"convertFileFormat"> = ({data}) => {
    return ( 
        <div>
            <div>{data.text}</div>
        </div>
     );
}