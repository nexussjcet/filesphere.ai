import {
  infer as Infer,
  ZodEffects,
  ZodFunction,
  ZodOptional,
  ZodSchema,
  ZodTransformer,
  ZodTypeAny,
  input as Input,
  z,
  ZodObject,
} from "zod";
import { printNode, zodToTs } from "zod-to-ts";
import { wrapType } from "../lib/utils";
import { State, StateToValues } from "../state";
import { AsyncFunction, ToAsyncFunction } from "../type";

export type AvailableActions = Record<
  string,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ZodFunction<any, any>
>;

export const getZodChainedCombined = <
  S extends AvailableActions,
  U extends State,
>(
  schema: S,
  state?: U,
) => {
  const actions: Record<string, ZodSchema> = {};
  const AvailableActions: string[] = [];
  const RecordOfActions: Record<string, string> = {};
  const RecordOfActionsType: string[] = [];
  type ActionZodValue = [ZodTypeAny, ZodTypeAny, ...ZodTypeAny[]];
  const actionZodValue = [] as unknown as ActionZodValue;

  for (const [key, value] of Object.entries(schema)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const zodValue = (value._def.args ?? z.any())._def?.items[0] as ZodSchema;
    actions[key] = zodValue;

    actionZodValue.push(
      z.object({
        [key]: zodValue,
      }),
    );

    const { node: type } = zodToTs(zodValue, key);
    const typeString = printNode(type);
    RecordOfActions[key] = typeString;
    const description = value._def.description;
    RecordOfActionsType.push(
      `${description ? `\n// ${description}\n` : ""}type ${key} = ${typeString}`,
    );
    AvailableActions.push(key);
  }

  const stateZod = state ? z.object(state).partial().optional() : undefined;
  const AvailableActionsType = `type AvailableActions = ${AvailableActions.map(
    (x) => `{${x}: ${x}}`,
  ).join(" | ")}`;
  const ChainedActionsType = "type OutputActions = Array<AvailableActions>";

  const final_type = `${RecordOfActionsType.join("\n")}

${AvailableActionsType}

${ChainedActionsType}`;

  const type_description = wrapType(final_type);
  const combinedZod = z.array(z.union(actionZodValue));
  const { node: type } = zodToTs(combinedZod);

  return {
    combinedZod,
    type_description,
    typeString: printNode(type),
    RecordOfActionsType,
    AvailableActionsType,
    ChainedActionsType,
    stateZod,
    type,
  };
};

export type ChainFunctions<A extends AvailableActions, U extends State, P> = (
  param: P,
  state?: Partial<StateToValues<U>>,
  rawState?: Partial<Input<ZodObject<U>>>,
) => { [K in keyof A]: ToAsyncFunction<Infer<A[K]>> };

export type ChainExample<A extends AvailableActions, U extends State> = {
  Input: string;
  State?: Partial<Input<ZodObject<U>>>;
  Output: Array<Partial<GetFirstParamFunction<A>>>;
}[];

export type GetFirstParamFunction<A extends AvailableActions> = {
  [k in keyof A]: Infer<A[k]["_def"]["args"][0]>;
};
