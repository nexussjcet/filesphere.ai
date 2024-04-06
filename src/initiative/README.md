# Initiative

#### a langchain extension for building simple actions models

Use your zod schema to create a chain of actions and use it with any llm models.

```bash
npm install initiative
```

## Usage

```bash
npm install initiative zod langchain @langchain/community
```

### Import

```ts
import { TogetherAI } from "@langchain/community/llms/togetherai";

const model = new TogetherAI({
  modelName: "mistralai/Mixtral-8x7B-Instruct-v0.1", // Recommended model 7B
  apiKey: process.env.API_KEY,
});
```

### Schema Definition

```ts
import { z } from "zod";
import { Implement, Schema, defaultPrompt } from "initiative";

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
    .describe("When user input wants to know the current time")
    .returns(z.date())
    .optional(),
} satisfies Schema;

type FuncParam = {
  ctx: {};
  extra: {};
};

const { actionZod, combinedZod, dataZod, stateZod } = getZodCombined(
  schema,
  userState
);

const init = implement(combinedZod, {
  state: userState,
  functions: (z: FuncParam, y) => ({
    getUserData: async () => `${y?.userDragged}`,
    setName: () => {},
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
      },
    },
    {
      Input: "Find the person name Keanu",
      Output: {
        getUserData: "Keanu",
      },
    },
  ],
});
```

### Initiate Action Chain with langchain

```ts
const chain = await createExtraction(model, init, {
  combinedZod,
  stateZod,
});

const userStateData = {
  userSelected: "YES",
  userDragged: "Toy",
};

const response = await chain.invoke("Get time", { state: userStateData });

console.log(response);
```

### Output

```json
{
  "input": "Get time",
  "response": {
    "raw": "\n<json>{\"getTime\":\"NOW\"}</json>",
    "validated": {
      "data": { "getTime": "NOW" },
      "json": { "getTime": "NOW" },
      "success": true
    }
  },
  "state": {
    "raw": {
      "userSelected": "YES",
      "userDragged": "Toy"
    },
    "validated": {
      "data": {
        "userSelected": "User selected YES on text permissions",
        "userDragged": "User dragged Toy out of the box"
      },
      "success": true
    }
  }
}
```

### Execute Actions

```ts
const recipt = await executeActions(init, response, actionZod, {
  permissions: { getTime: true, setName: true, getUserData: true },
  params: {
    ctx: {},
    extra: {},
  },
});

console.log(recipt);
```

### Output

```json
{
  getTime: {
    value: 2024-03-30T19:12:45.614Z,
    key: "getTime",
    permission: true,
  }
}
```

### Chained Action Execution
```ts
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
    .returns(z.string()),
  sentEmailToUser: z
    .function()
    .describe("When action is requisting to sent an email to someone. Pass name of user as param.")
    .args(z.object({ name: z.string() }))
    .returns(z.string()),
} satisfies AvailableActions;

const userState = {
  userSelected: z
    .enum(["YES", "NO"])
    .transform((x) => `User selected ${x} on text permissions`),
  userDragged: z.string().transform((x) => `User dragged ${x} out of the box`),
} satisfies State;

type FuncParam = {
  ctx: {};
  extra: {};
};

const userStateData = {
  userSelected: "YES",
  userDragged: "Toy",
};

const materials = getZodChainedCombined(Schema, userState);

const init = implementChain(Schema, materials, {
  functions: (x: FuncParam, y) => ({
    searchUserWithName: async ({ name }) => `Found ${name}`,
    sentEmailToUser: async ({name}) => `Senting email to ${name}`
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
        { sentEmailToUser: { name: "Alex" } }
    ],
    },
  ],
});

const chain = await createExtraction(
  model,
  init,
  {
    combinedZod: materials.combinedZod,
    stateZod: materials.stateZod,
  },
  chainedActionPrompt
);

const res = await chain.invoke("Find user Jovit and sent email to him", {
  state: userStateData,
});

console.log(res.response.validated?.success ? res.response.validated.data : "");

const x = await executeChainActions(init, res, {
  permissions: {
    searchUserWithName: true,
    sentEmailToUser: true,
  },
  params: {
    ctx: {},
    extra: {},
  },
});

console.log(x);
```
#### Output

Before execution
```json
[
  {
    searchUserWithName: {
      name: "Jovit",
    },
  }, {
    sentEmailToUser: {
      name: "Jovit",
    },
  }
]
```

After execution
```json
{
  searchUserWithName: {
    value: "Found Jovit",
    key: "searchUserWithName",
    iteration: 0,
    permission: true,
  },
  sentEmailToUser: {
    value: "Senting email to Jovit",
    key: "sentEmailToUser",
    iteration: 1,
    permission: true,
  },
}
```

### Coming Soooooooooooon

- [x] Add support direct actions initiation
- [x] Add support normal zod schema
- [x] Add support async actions
- [x] Add support common cookies and headers
- [x] Add chained actions support for multiple actions
- [x] Proper validation and error handling for revalidation through LLM
- [x] Permission for actions
- [ ] RSC support with vercel/ai SDK

### Packages used under the hood

- [zod](https://zod.dev/) for schema validation
- [langchain JS](js.langchain.com) for LLM models chains
- [zod-to-ts](https://github.com/sachinraja/zod-to-ts) for converting zod schema to typescript
- [zod-validation-error](https://github.com/causaly/zod-validation-error) for better human readable errors
- [zod_utilz](https://github.com/JacobWeisenburger/zod_utilz) for better zod schema manipulation (superset of zod)
