import { type AFC } from "@/lib/schema";

<<<<<<< HEAD
export const summarizeText:AFC<"summarizeText"> = ({data}) => {
    return ( 
        <div className="p-4 bg-gray-100">
            <div className="line-clamp-6">{data.text}</div>
        </div>
     );
}
=======
export const summarizeText: AFC<"summarizeText"> = ({ data }) => {
  return (
    <div>
      <div className="line-clamp-3">{data.text}</div>
    </div>
  );
};
>>>>>>> 2cb3eb667303172803b3c72304b730ecbf6f7be6
