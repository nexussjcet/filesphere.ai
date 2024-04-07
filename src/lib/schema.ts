import { type AvailableActions } from "@/initiative/chain";
import { type State } from "@/initiative/state";
import type { CTX } from "@/server/api/root";
import z, { input as Input, type infer as Infer } from "zod";

const fileEnum = z.enum(["markdown", "html"]);

const status = z.object({
  status: z.union([
    z.literal("success"),
    z.literal("failed"),
    z.literal("in-progress"),
    z.literal("permission denied"),
  ]),
  message: z.string().optional(),
});

const text = z.object({
  text: z.string(),
});

export const UserState = {
  listOfContactsAvailable: z
    .array(z.object({ name: z.string(), email: z.string() }))
    .describe("List of contacts available to user")
    .optional(),
  recentFilesAccessed: z
    .array(z.string())
    .describe("List of files recently accessed by user")
    .optional(),
  selected_A_Contacts: z
    .array(z.string())
    .transform((x) => `User selected his contacts with names ${x.join(", ")} in UI`)
    .optional(),
  selected_A_Files: z
    .array(z.string())
    .transform((x) => `User selected a file with  name ${x.join(", ")} in UI`)
    .optional(),
  selected_A_Directory: z
    .object({ directory: z.string(), files: z.array(z.string()) })
    .transform(
      (x) =>
        `User selected a directory named '${x.directory}' in UI with available files\n\t > ${x.files.join("\n\t> ")}`,
    )
    .optional(),
} satisfies State;

export type UserStateType = Infer<z.ZodObject<typeof UserState>>;
export type UserStateTypeRaw = Input<z.ZodObject<typeof UserState>>;

export type ExtraParams = {
  ctx: CTX;
  extra: object;
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
      "When action requires to read a file from source, to continue in execution order. ",
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

  deleteFile: z
    .function()
    .describe(
      "When action requires to delete some old file from source, to continue in execution order.",
    )
    .args(z.object({ fileSource: z.string() }))
    .returns(status),

  removeDirectory: z
    .function()
    .describe(
      "When action requires to remove some directory from source, to continue in execution order.",
    )
    .args(z.object({ directory: z.string() }))
    .returns(status),

  createDirectory: z
    .function()
    .describe(
      "When action requires to create some directory to destination, to continue in execution order.",
    )
    .args(z.object({ directory: z.string() }))
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

  unavailableAction: z
    .function()
    .describe(
      "When user wants do some action that is not available above, just ignore everything else and return that action description.",
    )
    .args(z.object({ actionDescription: z.string() }))
    .returns(status),
} satisfies AvailableActions;

export const AvailableActionsZod = z.object(Schema);

export const GetZodParam = <K extends keyof RawAvailableActions>(key: K) => {
  return Schema[key]?._def.args.items[0];
};

export const GetZodReturn = <K extends keyof RawAvailableActions>(key: K) => {
  return Schema[key]._def.returns;
};
// : Parameters<Infer<RawAvailableActions[K]>>
export type RawAvailableActions = typeof Schema;
export type RawAvailableActionsKeys = keyof typeof Schema;

export type GetActionParam<K extends keyof RawAvailableActions> = Parameters<
  Infer<RawAvailableActions[K]>
>[0];
export type GetActionReturn<K extends keyof RawAvailableActions> = ReturnType<
  Infer<RawAvailableActions[K]>
>;

export type AFC<K extends keyof RawAvailableActions> = React.FunctionComponent<{
  data: GetActionReturn<K>;
}>;

export type PermissionZod<S extends AvailableActions = typeof Schema> =
  z.ZodObject<{ [k in keyof S]: z.ZodBoolean }>;

export const permissionZod = z.object(
  Object.keys(Schema).reduce(
    (acc, key) => ({ ...acc, [key]: z.boolean() }),
    {},
  ),
) as PermissionZod;

export const AllowALL: { [k in keyof RawAvailableActions]: true } = {
  convertFileFormat: true,
  readFile: true,
  writeFile: true,
  openFile: true,
  summarizeText: true,
  sentEmail: true,
  findOneContact: true,
  searchFile: true,
  searchOneFile: true,
  deleteFile: true,
  removeDirectory: true,
  createDirectory: true,
  unavailableAction: true,
};
