import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { chain, init } from "@/lib/model";
import { executeChainActions } from "@/initiative/chain";
import { Schema, UserState, permissionZod } from "@/lib/schema";

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

      const res = await chain.invoke(prompt);

      console.log(
        res.response.validated?.success ? res.response.validated.data : "",
      );

      const x = await executeChainActions(Schema, init, res, {
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
