import { ZodSchema, infer as Infer, ZodError } from "zod";

type SafeParse = (
  schema: ZodSchema,
  response: string
) =>
  | {
      success: true;
      data: Infer<ZodSchema>;
      json: Infer<ZodSchema>;
    }
  | {
      success: "partial";
      json: Infer<ZodSchema>;
      error: ZodError;
    }
  | {
      success: false;
      error: Error | unknown;
    };

const regex = /<json>(.*?)<\/json>/s;
export const safeParse = (schema:ZodSchema, response:string) => {
  let json: undefined | Infer<ZodSchema>;

  try {
    if (!(schema && response)) throw new Error("No schema or response string provided");

    const match = response.match(regex);
    json = match?.[1] ? JSON.parse(match[1]) : JSON.parse(response);
    const data:Infer<ZodSchema> = schema.parse(json);

    return {
      data,
      json,
      success: true,
    };
  } catch (e) {
    if (e instanceof ZodError)
      return {
        error: e,
        json: json,
        success: "partial",
      };

    return {
      error: e,
      json: undefined,
      success: false,
    };
  }
};

export const safeParseState = (schema:ZodSchema | undefined, response:Object | undefined) => {
  try {
    if (!(schema && response)) throw new Error("No schema or response string provided");
    const data:Infer<ZodSchema> = schema.parse(response);
    return {
      data,
      success: true,
    };
  } catch (e) {
    return {
      error: e,
      success: false,
    };
  }
};
