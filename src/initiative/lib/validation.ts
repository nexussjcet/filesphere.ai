import {
  ZodSchema,
  infer as Infer,
  ZodError,
  ZodOptional,
  ZodTransformer,
  ZodObject,
  z,
} from "zod";
import { State, StateToValues } from "../state";

type SafeParse = (
  schema: ZodSchema,
  response: string,
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
export const safeParse = <S extends { [k in string]: ZodSchema }>(
  schema: ZodSchema,
  response: string,
) => {
  let json: object | undefined;

  try {
    if (!(schema && response))
      throw new Error("No schema or response string provided");

    const match = response.match(regex);
    json = match?.[1] ? JSON.parse(match[1]) : JSON.parse(response);
    const data: Infer<typeof schema> = schema.parse(json);

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

export const safeParseState = <S extends State>(
  schema: ZodSchema | undefined,
  response: Partial<StateToValues<S>> | undefined,
) => {
  try {
    if (!(schema && response))
      throw new Error("No schema or response string provided");
    const data: Infer<typeof schema> = schema.parse(response);
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

type RmTrans<T> = T extends ZodOptional<ZodTransformer<infer A>> ? A : never;

type MakeItRaw<T extends State> = {
  [K in keyof T]: RmTrans<T[K]>;
};

export const rawSafeParseState = <S extends State>(
  schema: ZodSchema | undefined,
  response: Partial<StateToValues<S>> | undefined,
) => {
  try {
    if (!(schema && response))
      throw new Error("No schema or response string provided");

    // if (!(schema instanceof ZodObject || schema._input instanceof ZodObject))
    //   throw new Error("Schema is not a ZodObject");

    // const rawTransSchema =
    //   "shape" in schema ? schema.shape : schema._input.shape;
    // const rawSchemaObject: { [key in string]: ZodSchema } = {};

    // for (const entry of Object.entries(rawTransSchema)) {
    //   const [key, value] = entry;
    //   rawSchemaObject[key] =
    //     value instanceof ZodTransformer &&
    //     "strip" in value &&
    //     typeof value.strip === "function"
    //       ? value?.strip()
    //       : value;
    // }
    // const rawSchema = z.object(rawSchemaObject);

    
    const rawSchema = schema;

    const res = rawSchema.safeParse(response);
    if (res.success) {
      return {
        data:res.data,
        success: true,
      };
    }
    return {
      error: response,
      success: true,
    };
  } catch (e) {
    console.log(e);
    return {
      error: e,
      success: false,
    };
  }
};
