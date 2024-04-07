import { ZodFunction, z, ZodOptional, ZodSchema, infer as Infer } from "zod";
import { zodToTs, printNode } from "zod-to-ts";
import { wrapType } from "../lib/utils";
import { prepareChatFromExample, prepareExample } from "../lib/prompt";
import { State, StateToValues } from "../state";
import { ToAsyncFunction, ToFunctionFirstParam } from "../type";

export type Schema = Record<
  string,
  
  
// eslint-disable-next-line @typescript-eslint/no-explicit-any
ZodSchema  | ZodFunction<any, any> | ZodOptional<ZodFunction<any, any>>
>;

export type ExtractFunctions<A extends Schema> = {
  [k in keyof A]: ToAsyncFunction<Infer<A[k]>>;
};

export type Functions<S extends Schema, U extends State, P> = (
  param: P,
  state?: StateToValues<U>
) => ExtractFunctions<S>;

export type Example<A extends Schema = Schema, U extends State = State> = {
  Input: string;
  State?: Partial<StateToValues<U>>;
  Output: Partial<{
    [k in keyof A]: ToFunctionFirstParam<Infer<A[k]>, Infer<A[k]>>;
  }>;
}[];

export const getZodCombined = <S extends Schema, U extends State,>(schema: S, state?: U) => {
  const actions: Record<string, ZodSchema> = {};
  const objects: Record<string, ZodSchema> = {};

  for (const [key, value] of Object.entries(schema)) {
    const isFunc = "args" in value._def;
    const isOptionalFunc = "unwrap" in value && "args" in value._def.innerType;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const newValue: ZodSchema = isFunc
      ? value._def.args._def.items[0]
      : isOptionalFunc
      ? (value.unwrap()._def.args._def.items[0] ?? z.null()).optional()
      : value;

    (isFunc || isOptionalFunc ? actions : objects)[key] = newValue.describe(
      value._def.description ?? ""
    );
  }

  const actionZod = z.object(actions);

  const dataZod = z.object(objects);

  const combinedZod = actionZod.merge(dataZod);

  const stateZod = state ? z.object(state) : undefined

  return {
    actionZod,
    dataZod,
    combinedZod,
    stateZod
  }
}


export const implement = <U extends State, A extends Schema, P>(
  schema: A,
  combinedZod: ZodSchema,
  config: {
    state?: U;
    functions?: Functions<A, U, P>;
    examples?: Example<A, U>;
    typeName?: string;
  }
) => {

  const { node: type } = zodToTs(combinedZod, config.typeName ?? "data");
  const typeString = printNode(type);
  const type_description = wrapType(typeString, config.typeName ?? "data");
  const format_instructions = prepareExample(
    (config.examples ?? []) as Example,
    "State: "
  );

  const exampleChat = prepareChatFromExample(
    (config.examples ?? []) as Example
  );

  

  return {
    type_description,
    typeString,
    type,
    format_instructions,
    exampleChat,
    functions: config.functions,
  };
};
