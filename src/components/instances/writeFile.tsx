import { type AFC } from "@/lib/schema";

export const writeFile:AFC<"writeFile"> = ({data}) => {
    return ( 
        <div>
            <div>{data.status}</div>
        </div>
     );
}