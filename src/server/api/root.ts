import { chainRouter } from "@/server/api/routers/chain";
import { TRPCContext, createCallerFactory, createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  chain: chainRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
export type CTX = Awaited<ReturnType<TRPCContext>>

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
