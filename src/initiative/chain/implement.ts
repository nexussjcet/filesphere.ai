import { Example } from "..";
import { prepareExample, prepareChatFromExample } from "../lib/prompt";
import { State, StateToValues } from "../state";
import { AvailableActions, ChainExample, ChainFunctions, getZodChainedCombined } from "./chained";
import { infer as Infer, ZodObject } from "zod";


export const implementChain = <A extends AvailableActions, U extends State, P>(
  schema: A,
  state: U,
  materials: ReturnType<typeof getZodChainedCombined<A, U>>,
  config: {
    functions: ChainFunctions<A, U, P>;
    examples?: ChainExample<A, U>;
    typeName?: string;
  }
) => {
  const { type_description, typeString, type } = materials;

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
