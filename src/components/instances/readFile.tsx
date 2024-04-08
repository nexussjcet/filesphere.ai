import { type AFC } from "@/lib/schema";
import { Badge } from "../ui/badge";

export const ReadFile: AFC<"readFile"> = ({ data }) => {
  return <Badge>{data.text}</Badge>;
};

export const ConvertFileFormat: AFC<"convertFileFormat"> = ({ data }) => {
  return <Badge variant={"secondary"}>{data.text}</Badge>;
};

export const CreateDirectory: AFC<"createDirectory"> = ({ data }) => {
  return (
    <Badge variant={"outline"}>{(data as { status: string }).status}</Badge>
  );
};

export const DeleteFile: AFC<"deleteFile"> = ({ data }) => {
  return (
    <Badge variant={"outline"}>{(data as { status: string }).status}</Badge>
  );
};

export const RemoveDirectory: AFC<"removeDirectory"> = ({ data }) => {
  return (
    <Badge variant={"outline"}>{(data as { status: string }).status}</Badge>
  );
};

export const OpenFile: AFC<"openFile"> = ({ data }) => {
  return <Badge variant={"outline"}>{data.fileSource}</Badge>;
};

export const SummarizeText: AFC<"summarizeText"> = ({ data }) => {
  return <Badge>{data.text}</Badge>;
};

export const SendEmail: AFC<"sentEmail"> = ({ data }) => {
  return (
    <Badge variant={"outline"}>{(data as { status: string }).status}</Badge>
  );
};

export const FindOneContact: AFC<"findOneContact"> = ({ data }) => {
  return (
    <div>
      <p>{data.name}</p>
      <p>{data.email}</p>
    </div>
  );
};

export const UnavailableAction: AFC<"unavailableAction"> = ({ data }) => {
  return <Badge variant={"outline"}>{data.message}</Badge>;
};
