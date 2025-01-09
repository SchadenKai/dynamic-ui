import { Element } from "@/app/page"

export function parseGenerateUIFuncArgs(args: string): Element {
    const parsedArgs = JSON.parse(args)
    console.log("parsedArgs", parsedArgs)
    // const newArgs = args.split(',').map(arg => arg.trim())
    return parsedArgs
}