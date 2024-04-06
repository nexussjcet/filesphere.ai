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
import { safeParse, safeParseState } from "../lib/validation";
import { State, StateToValues } from "../state";
import { AvailableActions, getZodChainedCombined, implementChain } from "./../chain";

export type ResponseType<S extends Schema, U extends State> = {
  input: string;
  state: {
    raw: Partial<Infer<ZodObject<U>>>;
    validated?: ReturnType<typeof safeParseState>;
  };
  response: {
    raw: string;
    validated?: ReturnType<typeof safeParse>;
  };
};

export const createExtraction = async <U extends State,A extends AvailableActions, S extends Schema, P>(
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
    state?: StateToValues<U>;
    reInvokeLimit?: number;
  };

  const invoke = async (
    Input: string,
    config?: InvokeConfig
  ): Promise<ResponseType<S, U>> => {
    const validatedState = safeParseState(stateZod, config?.state);

    const promptText = await prompt.invoke({
      type_description,
      state_description: validatedState?.data
        ? stateDescription(validatedState.data, "", ", ")
        : "",
      format_instructions,
      input_prompt: Input,
    });

    const response = (await chainedMessages.pipe(llm).invoke(
      {
        system_message: new SystemMessage(system_message),
        example_message: exampleChat,
        last_message: new HumanMessage(promptText.value),
      },
      invokeOptions
    )) as string;

    const validated = safeParse(combinedZod, response);

    return {
      input: Input,
      response: {
        raw: response,
        validated,
      },
      state: {
        raw: config?.state ?? {},
        validated: validatedState,
      },
    };
  };

  return { invoke };
};
