import { GetZodParam } from "@/lib/schema";
import {
  createTRPCRouterActions,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

// export const actionRouter = createTRPCRouterActions({
//   convertFileFromTo: protectedProcedure
//     .input(GetZodParam("convertFileFromTo"))
//     .mutation(({ input, ctx }) => {
//       return "success";
//     }),
//     readFile: publicProcedure
//     .input(GetZodParam("readFile"))
//     .mutation(({ input }) => {
//       return "success";
//     }),
//     writeFile: publicProcedure
//     .input(GetZodParam("writeFile"))
//     .mutation(({ input }) => {
//       return "success";
//     }),
//     summarizeText: publicProcedure
//     .input(GetZodParam("summarizeText"))
//     .mutation(({ input }) => {
//       return "success";
//     }),
//     sentEmail: publicProcedure
//     .input(GetZodParam("sentEmail"))
//     .mutation(({ input }) => {
//       return "success";
//     }),
//     findContact: publicProcedure
//     .input(GetZodParam("findContact"))
//     .mutation(({ input }) => {
//       return [{name: "name", email: "email"}];
//     }),
//     searchFile: publicProcedure
//     .input(GetZodParam("searchFile"))
//     .mutation(({ input }) => {
//       return ["file"];
//     }),
// });
