"use client"

import { api } from "@/trpc/react";


const InputPrompt = () => {
    const {mutateAsync, data} =  api.chain.initiative.useMutation()
    return ( <>
        <div>
            {JSON.stringify(data)}
        </div>
        <button type="submit" onClick={() => mutateAsync({
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
        })}>
            Submit
        </button>
    </>
     );
}