import { TogetherAI } from "@langchain/community/llms/togetherai";
import { createExtraction, chainedActionPrompt } from "@/initiative";
import { type ExtraParams, Schema, UserState, AllowALL } from "./schema";
import {
  executeChainActions,
  getZodChainedCombined,
  implementChain,
} from "@/initiative/chain";
import { sendEmail } from "@/app/dashboard/_actions";

export const model = new TogetherAI({
  modelName: "mistralai/Mixtral-8x7B-Instruct-v0.1",
  apiKey: process.env.API_KEY,
});

export const materials = getZodChainedCombined(Schema, UserState);
export const init = implementChain(Schema, materials, {
  functions: (_extra, state) => ({
    convertFileFormat: async ({
      fileDestinationType,
      fileSourceType,
      text,
    }) => {
      const res = await model.invoke(
        `Just Convert the ${fileSourceType} text  to ${fileDestinationType}. Dont write code. DOnt explain anything. Just convert like normal. Dont add styles. Text:'${text}'`,
      );
      return { text: res };
    },
    readFile: async () => await Promise.resolve({ text: "success" }),
    findOneContact: async ({ name }) => {
      return { name: "unknown", email: "unknown" };
      // console.log(state?.listOfContacts)
      // return state?.listOfContacts.find((c) => c.name.includes(name)) ?? { name: "unknown", email: "unknown" }
    },
    searchFile: async () => await Promise.resolve([{ fileSource: "success" }]),
    searchOneFile: async () => await Promise.resolve({ fileSource: "success" }),
    openFile: async () => await Promise.resolve({ status: "success" }),
    sentEmail: async ({ email, text }) => {
      await sendEmail(email, "Email from Drive AI", text);
      return { status: "success" };
    },
    summarizeText: async ({ text }) => {
      const res = await model.invoke(
        `Summarize the concept in 40 or 50 words. Concept is ${text}`,
      );
      return { text: res };
    },
    writeFile: async () => await Promise.resolve({ status: "success" }),
  }),
  state: UserState,
  examples: [
    {
      Input: "Convert the markdown text '# Heading \n ## Heading' to html ",
      Output: [
        {
          convertFileFormat: {
            text: "# Heading \n ## Heading",
            fileSourceType: "markdown",
            fileDestinationType: "html",
          },
        },
      ],
    },
    {
      Input: "Read the file 'file.md' ",
      Output: [
        { readFile: { fileSource: "file.md", fileSourceType: "markdown" } },
      ],
    },
    {
      Input: "Create summary of BlockChain and Sent email to abcd@example.com",
      Output: [
        { summarizeText: { text: "BlockChain" } },
        { sentEmail: { email: "abcd@example.com", text: "unknown" } },
      ],
    },
    {
      Input: "Find user Rajat and sent email 'Hi' to him",
      Output: [
        { findContact: { name: "Rajat" } },
        { sentEmail: { email: "unknown", text: "HI" } },
      ],
    },
    {
      Input:
        "Find and read markdown file 'file.md' and summarize it, sent it to user named 'Rajat'",
      Output: [
        { searchFile: { fileName: "file.md" } },
        { readFile: { fileSource: "unknown", fileType: "markdown" } },
        { summarizeText: { text: "unknown" } },
        { findContact: { name: "Rajat" } },
        { sentEmail: { email: "unknown", text: "unknown" } },
      ],
    },
  ],
});

export const chain = await createExtraction(
  model,
  init,
  {
    combinedZod: materials.combinedZod,
    stateZod: materials.stateZod,
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  chainedActionPrompt,
);

// const res = await chain.invoke("Convert markdown to html, text:'# Header \n ## Header'");

// console.log(res.response.validated?.success ? res.response.validated.data : "");

// const x = await executeChainActions(Schema, init, res, {
//   permissions: AllowALL,
//   params: {
//     ctx: null,
//     extra: {},
//   },
// });

// console.log(x);
