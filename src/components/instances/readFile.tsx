import { type AFC } from "@/lib/schema";

export const readFile:AFC<"readFile"> = ({data}) => {
    return ( 
        <div>
            <div>{data.text}</div>
        </div>
     );
}