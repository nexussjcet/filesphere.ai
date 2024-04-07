import { TogetherAI } from "@langchain/community/llms/togetherai";
import { z } from "zod";
import { createExtraction } from "./";
import { State } from "./state";
import { getZodCombined, implement, Schema } from "./actions";
import { executeActions } from "./actions/execute";

const model = new TogetherAI({
  modelName: "mistralai/Mixtral-8x7B-Instruct-v0.1",
  apiKey: process.env.API_KEY,
});

const userState = {
  userSelected: z
    .enum(["YES", "NO"])
    .transform((x) => `User selected ${x} on text permissions`),
  userDragged: z.string().transform((x) => `User dragged ${x} out of the box`),
} satisfies State;

const schema = {
  getUserData: z
    .function()
    .describe("When user want to get the data of any other users")
    .args(z.string())
    .returns(z.string())
    .optional(),
  setName: z
    .function()
    .describe("When user input wants to update his/her name of the user")
    .args(z.string())
    .returns(z.void())
    .optional(),
  getTime: z
    .function()
    .args(z.enum(["NOW"]))
    .describe("Non optional function to get the current time. Always use it.")
    .returns(z.date()),
    // .optional(),
} satisfies Schema;

type FuncParam = {
  ctx: unknown;
  extra: unknown;
};

const { actionZod, combinedZod, dataZod, stateZod } = getZodCombined(
  schema,
  userState
);

const init = implement(schema, combinedZod, {
  state: userState,
  functions: (z, y) => ({
    getUserData: (name) => `${name} ${y?.userDragged}`,
    setName: () => {
      console.log("Name changed");
    },
    getTime: () => new Date(),
  }),
  examples: [
    {
      Input: "What the time?",
      Output: {
        getTime: "NOW",
      },
    },
    {
      Input: "Set my name to Rajat",
      Output: {
        setName: "Rajat",
        getTime: "NOW",
      },
    },
    {
      Input: "Find the person name Keanu",
      Output: {
        getUserData: "Keanu",
        getTime: "NOW",
      },
    },
  ],
});

const chain = await createExtraction(schema, userState, model, init, {
  combinedZod,
  stateZod,
});

const userStateData = {
  userSelected: "YES",
  userDragged: "Toy",
};

console.log(init.typeString)

const response = await chain.invoke("Find Alen", { state: userStateData });
console.log(response);

const recipt = await executeActions(init, response, actionZod, {
  permissions: { getTime: false, setName: true, getUserData: true },
  params: {
    ctx: {},
    extra: {},
  },
});

console.log(recipt);
