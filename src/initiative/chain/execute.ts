import { infer as Infer } from "zod";
import { AvailableActions, ChainFunctions, implementChain } from ".";
import { State } from "../state";
import { ResponseType } from "../";

export type ChainPermissions<S extends AvailableActions> = {
  [F in keyof S]: boolean;
};

type ChainResponse<S extends AvailableActions, K extends keyof S = keyof S> = ({
  key: K;
  iteration: number;
  permission?: boolean;
} & ({ value: ReturnType<Infer<S[K]>> } | { error: Error }))[];

export type ChainReturn<S extends AvailableActions> = {
  [K in keyof S]: ChainResponse<S>[0];
};

export const executeChainActions = async <
  U extends State,
  A extends AvailableActions,
  P,
>(
  schema: A,
  state: U,
  init: ReturnType<typeof implementChain<A, U, P>>,
  response: ResponseType<A, U>,
  // actionZod: ReturnType<typeof getZodChainedCombined<A, U>>["combinedZod"],
  config: {
    permissions: ChainPermissions<A>;
    params: (typeof init)["functions"] extends undefined
      ? never
      : Parameters<ChainFunctions<A, U, P>>[0];
  },
): Promise<ChainReturn<A>> => {
  if (!response.response.validated) {
    console.log(JSON.stringify(response, null, 2))
    throw new Error("Response is not validated");
  }

  const permissions = config?.permissions ?? undefined;

  if (response.response.validated.success !== true)
    throw new Error("Response is not validated");

  const chainActions = response.response.validated.data as {
    [k in keyof A]: A[k];
  }[];

  if (!init.functions) throw new Error("Functions are not provided");
  if (!config?.params) throw new Error("Function parameters are not provided");

  const setOfFunctions = init.functions(
    config.params,
    response.state.validated?.data,
    response.state.raw
  );

  const storage = new Map();
  const setOfFunctionResult = [] as ChainResponse<A>;
  let iteration = 0;
  for (const action of chainActions) {
    const func = Object.entries(action)[0];
    if (!func) {
      setOfFunctionResult.push({
        key: "0",
        error: new Error("Entries error in funcs"),
        iteration,
        permission: false,
      });
      iteration++;
      break;
    }

    const [key, value] = func as [string, Parameters<Infer<A[keyof A]>>];

    if (typeof value === "object") {
      // biome-ignore lint/complexity/noForEach: <explanation>
      Object.entries(value).forEach(([k, v]) => {
        if (typeof v === "string") {
          if (v.includes("unknown")) {
            const newV = storage.get(k);
            value[k as keyof typeof value] = newV;
          } else storage.set(k, v);
        }
      });
    }

    const eachPermission = permissions[key];

    if (!(key in setOfFunctions)) {
      setOfFunctionResult.push({
        key,
        iteration,
        permission: eachPermission,
        error: new Error(`Function "${key}" is not implemented`),
      });
      iteration++;
      break;
    }

    if (!eachPermission) {
      setOfFunctionResult.push({
        key,
        iteration,
        permission: eachPermission,
        error: new Error(`Execution of function "${key}" is not permitted`),
      });
      iteration++;
      break;
    }

    const valueFunc =
      await setOfFunctions[key as keyof typeof setOfFunctions](value);

    if (typeof valueFunc === "object") {
      Object.entries(valueFunc as object).forEach(([k, v]) => {
        storage.set(k, v);
      });
    }

    setOfFunctionResult.push({
      value: valueFunc,
      key,
      iteration,
      permission: eachPermission,
    });

    iteration++;
  }

  console.log(storage);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return Object.assign(
    {},
    ...setOfFunctionResult.map((el) => ({ [el.key]: el })),
  );
};
