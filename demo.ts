import { api } from "@/trpc/server";

const x =  await api.chain.initiative({
    prompt: "Find Alex John",
    state: {},
    permissions: {
        convertFileFromTo: true,
        findContact: true,
        readFile: true,
        searchFile: true,
        sentEmail: true,
        summarizeText: true,
        writeFile: true,
    }
})

console.log(x)
