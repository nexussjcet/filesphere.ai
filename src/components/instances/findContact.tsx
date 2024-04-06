import { type AFC } from "@/lib/schema";

export const findOneContact:AFC<"findOneContact"> = ({data}) => {
    const x =  data
    return ( 
        <div>
            <div key={x.email}>{x.name} - {x.email}</div>
        </div>
     );
}