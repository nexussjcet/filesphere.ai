import { type AvailableActions } from "@/initiative/chain";
import { type State } from "@/initiative/state";
import type { CTX } from "@/server/api/root";
import z, { type infer as Infer } from "zod";

const fileEnum = z.enum(["markdown", "html"]);

const status = z.object({
  status: z.union([
    z.literal("success"),
    z.literal("failed"),
    z.literal("in-progress"),
    z.literal("permission denied"),
  ]),
});

const text = z.object({
  text: z.string(),
});

export const UserState = {
  // listOfContacts: z.array(z.object({ name: z.string(), email: z.string() }))
} satisfies State;
export type ExtraParams = {
  ctx: CTX;
  extra: object,
};

export const Schema = {
  convertFileFormat: z
    .function()
    .describe(
      "When action requires to convert file format to another, please read curresponding file before convertion, and write to continue in execution order. ",
    )
    .args(
      z.object({
        text: z.string(),
        fileSourceType: fileEnum,
        fileDestinationType: fileEnum,
      }),
    )
    .returns(text),

  readFile: z
    .function()
    .describe(
      "When action requires to read some file from source, to continue in execution order. ",
    )
    .args(z.object({ fileSource: z.string(), fileSourceType: fileEnum }))
    .returns(z.object({ text: z.string() })),

  writeFile: z
    .function()
    .describe(
      "When action requires to write some file to destination, to continue in execution order. ",
    )
    .args(
      z.object({
        fileDestination: z.string(),
        fileDestinationType: fileEnum,
        text: z.string().optional(),
      }),
    )
    .returns(status),

  openFile: z
    .function()
    .describe(
      "When action requires to open some file from source, to continue in execution order. ",
    )
    .args(z.object({ fileSource: z.string() }))
    .returns(status),

  summarizeText: z
    .function()
    .describe(
      "When action requires to summarize text, to continue in execution order. ",
    )
    .args(z.object({ text: z.string() }))
    .returns(z.object({ text: z.string() })),

  sentEmail: z
    .function()
    .describe(
      "When action requires to send email to someone, to continue in execution order. ",
    )
    .args(z.object({ email: z.string(), text: z.string() }))
    .returns(status),

  findOneContact: z
    .function()
    .describe(
      "When user wants to search & find one contact by name, to continue in execution order. ",
    )
    .args(z.object({ name: z.string() }))
    .returns(z.object({ name: z.string(), email: z.string() })),

  searchFile: z
    .function()
    .describe(
      "When user wants to search many files by name, not depending on execution order. ",
    )
    .args(z.object({ fileName: z.string() }))
    .returns(z.array(z.object({ fileSource: z.string() }))),

  searchOneFile: z
    .function()
    .describe(
      "When user wants to search one file by name, to continue in execution order. ",
    )
    .args(z.object({ fileName: z.string() }))
    .returns(z.object({ fileSource: z.string() })),
} satisfies AvailableActions;

