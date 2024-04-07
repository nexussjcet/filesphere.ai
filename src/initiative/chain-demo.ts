import { TogetherAI } from "@langchain/community/llms/togetherai";
import { z } from "zod";
import { createExtraction } from "./";
import {
  AvailableActions,
  executeChainActions,
  getZodChainedCombined,
  implementChain,
} from "./chain";
import { chainedActionPrompt } from "./lib/prompt";
import { State } from "./state";

const model = new TogetherAI({
  modelName: "mistralai/Mixtral-8x7B-Instruct-v0.1",
  apiKey: process.env.API_KEY,
});

const Schema = {
  searchUserWithName: z
    .function()
    .describe("When action needs imformation of a user to continue in order. ")
    .args(z.object({ name: z.string() }))
    .returns(z.object({ email: z.string() })),
  sentEmailToUser: z
    .function()
    .describe(
      "When action is requisting to sent an email to someone. Pass name of user as param.",
    )
    .args(z.object({ email: z.string(), text: z.string() }))
    .returns(z.string()),
  createSummary: z
    .function()
    .describe(
      "When action is requisting to create a summary of text. Pass text as param.",
    )
    .args(z.object({ text: z.string() }))
    .returns(z.object({ text: z.string() })),
} satisfies AvailableActions;

const userState = {
  userSelected: z
    .enum(["YES", "NO"])
    .transform((x) => `User selected ${x} on text permissions`),
  userDragged: z.string().transform((x) => `User dragged ${x} out of the box`),
} satisfies State;

type FuncParam = {
  ctx: object;
  extra: object;
};

const userStateData = {
  userSelected: "YES",
  userDragged: "Toy",
};

const materials = getZodChainedCombined(Schema, userState);

const init = implementChain(Schema, userState, materials, {
  functions: (x: FuncParam, y) => ({
    searchUserWithName: async ({ name }) => ({ email: `${name}@gmail.com` }),
    sentEmailToUser: async ({ email, text }) =>
      `Senting email to ${email}, with subject: ${text}`,
    createSummary: async ({ text }) => ({ text: `Summary of ${text}` }),
  }),
  examples: [
    {
      Input: "Find user Rajat",
      Output: [{ searchUserWithName: { name: "Rajat" } }],
    },
    {
      Input: "Sent email to guy named Alex",
      Output: [
        { searchUserWithName: { name: "Alex" } },
        { sentEmailToUser: { email: "unknown" } },
      ],
    },
    {
      Input: "Sent email to this guy",
      Output: [{ sentEmailToUser: { email: "unknown" } }],
    },
    {
      Input: "Create summary of BlockChain and Sent email to abcd@example.com",
      Output: [
        { createSummary: { text: "BlockChain" } },
        { sentEmailToUser: { email: "abcd@example.com", text: "unknown" } },
      ],
    },
  ],
});

const chain = await createExtraction(
  Schema,
  userState,
  model,
  init,
  {
    combinedZod: materials.combinedZod,
    stateZod: materials.stateZod,
  },
  chainedActionPrompt,
);

const res = await chain.invoke(
  "find Diane, and sent a summary of 'health care' to her on email",
  {
    state: userStateData,
  },
);

console.log(res.response.validated?.success ? res.response.validated.data : "");

const x = await executeChainActions(
  Schema,
  userState,
  init as ReturnType<typeof implementChain>,
  res,
  {
    permissions: {
      searchUserWithName: true,
      sentEmailToUser: false,
      createSummary: true,
    },
    params: {
      ctx: {},
      extra: {},
    },
  },
);

console.log(x);
