import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { chain, init } from "@/lib/model";
import { executeChainActions, implementChain } from "@/initiative/chain";
import { Schema, UserState, permissionZod } from "@/lib/schema";
import { State } from "@/initiative/state";

export const chainRouter = createTRPCRouter({
  initiative: protectedProcedure
    .input(
      z.object({
        permissions: permissionZod,
        prompt: z.string(),
        state: z.object(UserState).optional()
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { permissions, prompt, state } = input;

      console.log(prompt, state);

      const res = await chain.invoke(prompt, {
        state
      });

      console.log(
        res.response.validated?.success ? res.response.validated.data : "",
      );

      const x = await executeChainActions(Schema, UserState, init as ReturnType<typeof implementChain>, res, {
        permissions,
        params: {
          ctx,
          extra: {},
        },
      });

      console.log(x);

      return x
    }),
});
