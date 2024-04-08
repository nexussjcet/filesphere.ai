import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import {
  BaseLanguageModel,
  BaseLanguageModelCallOptions,
} from "langchain/base_language";
import { PromptTemplate } from "langchain/prompts";
import { infer as Infer, ZodObject } from "zod";
import { Schema, getZodCombined, implement } from "../actions";
import { chainedMessages, defaultPrompt, system_message } from "../lib/prompt";
import { stateDescription } from "../lib/utils";
import { rawSafeParseState, safeParse, safeParseState } from "../lib/validation";
import { State, StateToValues } from "../state";
import { AvailableActions, getZodChainedCombined, implementChain } from "./../chain";

export type ResponseType<S extends Schema, U extends State> = {
  input: string;
  state: {
    raw: Partial<Infer<ZodObject<U>>>;
    partial?: ReturnType<typeof rawSafeParseState<U>>
    validated?: ReturnType<typeof safeParseState>;
  };
  response: {
    raw: string;
    validated?: ReturnType<typeof safeParse>;
  };
};

export const createExtraction = async <U extends State, A extends AvailableActions, S extends Schema, P>(
  schema: A | S,
  state: U,
  llm: BaseLanguageModel,
  init: ReturnType<typeof implement<U, S, P> | typeof implementChain<A, S, P>> ,
  zod: Pick<
    ReturnType<typeof getZodCombined<S, U> | typeof getZodChainedCombined>,
    "combinedZod" | "stateZod"
  >,
  prompt: PromptTemplate = defaultPrompt,
  invokeOptions?: BaseLanguageModelCallOptions | undefined
) => {
  const { type_description, format_instructions, exampleChat } = init;

  const { combinedZod, stateZod } = zod;

  type InvokeConfig = {
    state?: Partial<StateToValues<U>>;
    reInvokeLimit?: number;
  };

  const invoke = async (
    Input: string,
    config?: InvokeConfig
  ): Promise<ResponseType<S, U>> => {
    const validatedState = safeParseState<U>(stateZod, config?.state);
    const rawValidated = rawSafeParseState<U>(stateZod, config?.state);

    const promptText = await prompt.invoke({
      type_description,
      state_description: validatedState?.data
        ? stateDescription(validatedState.data as object, "", ", ")
        : "",
      format_instructions,
      input_prompt: Input,
    });

    console.log(promptText.value);

    const response = await llm.invoke(promptText.value)
    // const response = (await chainedMessages.pipe(llm).invoke(
    //   {
    //     system_message: new SystemMessage(system_message),
    //     example_message: exampleChat,
    //     last_message: new HumanMessage(promptText.value),
    //   },
    //   invokeOptions
    // )) as string;

    const validated = safeParse<S>(combinedZod, response);

    return {
      input: Input,
      response: {
        raw: response,
        validated,
      },
      state: {
        raw: config?.state ?? {},
        partial: rawValidated,
        validated: validatedState,
      },
    };
  };

  return { invoke };
};
