import { ResponseType } from "../";
import { State } from "../state";
import { infer as Infer } from "zod";
import {
  ExtractFunctions,
  Functions,
  Schema,
  getZodCombined,
  implement,
} from "./";

export type Permissions<S extends Schema> = {
  [F in keyof ExtractFunctions<S>]: boolean;
};

type ActionResponse<S extends Schema, K extends keyof ExtractFunctions<S>> = ({
  key: K;
  permission: boolean;
} & ({ value: ReturnType<ExtractFunctions<S>[K]> } | { error: Error }))[];

export type ActionReturn<S extends Schema> = {
  [F in keyof ExtractFunctions<S>]: {
    permission: boolean;
  } & ({ value: ReturnType<ExtractFunctions<S>[F]> } | { error: Error });
};

const executeActions = async <U extends State, S extends Schema, P>(
  init: ReturnType<typeof implement<U, S, P>>,
  response: ResponseType<S, U>,
  actionZod: ReturnType<typeof getZodCombined<S, U>>["actionZod"],
  config?: {
    permissions?: Permissions<S>;
    params?: (typeof init)["functions"] extends undefined
      ? never
      : Parameters<Functions<S, U, P>>[0];
  }
): Promise<ActionReturn<S>> => {
  if (!response.response.validated)
    throw new Error("Response is not validated");

  const permissions = config?.permissions ?? undefined;

  if (response.response.validated.success !== true)
    throw new Error("Response is not validated");

  const actions = actionZod.parse(response.response.validated.data);

  if (!init.functions) throw new Error("Functions are not provided");
  if (!config?.params) throw new Error("Function parameters are not provided");

  const setOfFunctions = init.functions(
    config.params,
    // @ts-ignore
    response.state.validated?.data
  );

  const setOfFunctionResult: ActionResponse<S, keyof ExtractFunctions<S>> =
    await Promise.all(
      Object.entries(actions).map(async ([key, value]) => {
        const eachPermission =
          permissions === undefined ? true : permissions[key] ?? false;

        if (!(key in setOfFunctions))
          return {
            key,
            permission: eachPermission,
            error: new Error(`Function "${key}" is not implemented`),
          };

        if (!eachPermission)
          return {
            key,
            permission: eachPermission,
            error: new Error(`Execution of function "${key}" is not permitted`),
          };

        return {
          value: await setOfFunctions[key as keyof typeof setOfFunctions](
            value
          ),
          key,
          permission: eachPermission,
        };
      })
    );

  return Object.assign(
    {},
    ...setOfFunctionResult.map((el) => ({ [el.key]: el }))
  );
};

export { executeActions };
