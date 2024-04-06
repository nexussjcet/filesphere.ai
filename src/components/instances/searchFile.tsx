import { type AFC } from "@/lib/schema";

export const searchFile:AFC<"searchFile"> = ({data}) => {
    return ( 
        <div>
            {data.map( x => <div key={x.fileSource}>{x.fileSource}</div>)}
        </div>
     );
}