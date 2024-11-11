import { glob } from "glob";

export const readFilenames = async (path: string, pattern: string) =>
    glob(pattern, { cwd: path, ignore: "node_modules/**" });
