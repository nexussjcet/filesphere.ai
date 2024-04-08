import { PromptTemplate } from "@langchain/core/prompts";
import { Example } from "../actions";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
  BaseMessage,
} from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { stateDescription } from "./utils";

export const system_message = `Your goal is to extract structured information from the user's input that matches type. When extracting information please make sure it matches the type information exactly. Do not add any attributes that do not appear in the schema.`;
export const defaultPromptTemplate = `Your goal is to extract structured information from the user's input that matches the form described below. When extracting information please make sure it matches the type information exactly. Do not add any attributes that do not appear in the schema shown below.

{type_description}


Please output the extracted information in JSON format. Do not output anything except for the extracted information. Always follow the type strict. undefined and optional types (key ?: value) are not need to write. But non-optional keys of object (key : value) should be always there, even though input is not specifing anything about it. Do not add any clarifying information. Do not add any fields that are not in the schema. If the text contains attributes that do not appear in the schema, please ignore them. All output must be in JSON format and follow the schema specified above. Wrap the JSON in <json> tags.

Examples
{format_instructions}

Below is the actual input from the user. Please extract the information that matches the schema and output it in JSON format.
Only write Output in single <json> tag. Do not write any more examples. Don't forget add non-optional keys in the output.

Input: {input_prompt}
State: {state_description}
Output: `;

export const ChainedPromptTemplate = `Your goal is to extract structured information from the user's input that matches the form described below. When extracting information please make sure it matches the type information exactly. Do not add any attributes that do not appear in the schema shown below.

{type_description}

These actions are chained, which means, each available actions (functions) are dependent on the previous actions. So, you need to consider the flow of array. If Input text instructs you to flow an order of execution (or asked you to do something), then follow that order same as in flow of array.
If function params are unknown, just put "unknown" in the place of params, like in {{key: "unknown"}}, wher key is the param in schema. If half of the keys are unknown, its fine, just put "unknown". 

Please output the extracted information in JSON format. Do not output anything except for the extracted information. Do not add any clarifying information. Do not add any fields that are not in the schema. If the text contains attributes that do not appear in the schema, please ignore them. All output must be in JSON format and follow the schema specified above. Wrap the JSON in <json> tags.

Examples
{format_instructions}

Below is the actual input from the user. Please extract the information that matches the schema and output it in JSON format.
Only write Output in single <json> tag. Do not write any more examples. Don't forget to follow the order function in the flow of array. If values of keys are unknown, just put "unknown" as value.

Input: {input_prompt}
State: {state_description}
Output: `;

export const defaultPrompt = new PromptTemplate({
  inputVariables: [
    "type_description",
    "format_instructions",
    "input_prompt",
    "state_description",
  ],
  template: defaultPromptTemplate,
});

export const chainedActionPrompt = new PromptTemplate({
  inputVariables: [
    "type_description",
    "format_instructions",
    "input_prompt",
    "state_description",
  ],
  template: ChainedPromptTemplate,
});

export const outputToJson = (output: unknown) => {
  return `<json>${JSON.stringify(output)}</json>`;
};

export const prepareExample = (examples: Example, stateTitle = "State") => {
  const format_instructions = `${examples
    .map((example) => {
      const line = `Input: ${example.Input}\n${stateDescription(example.State, stateTitle, ", ")}Output: ${outputToJson(
        example.Output,
      )}`;
      return line;
    })
    .join("\n")}\n`;

  return format_instructions;
};

export const chainedMessages = ChatPromptTemplate.fromMessages([
  // new MessagesPlaceholder("system_message"),
  // new MessagesPlaceholder("example_message"),
  new MessagesPlaceholder("last_message"),
]);

export const prepareChatFromExample = (examples: Example) =>
  examples.flatMap((example) => [
    new HumanMessage(example.Input),
    new AIMessage(outputToJson(example.Output)),
  ]);
