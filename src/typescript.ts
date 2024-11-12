import TsMorph from "ts-morph";
import { readFilenames } from "./fs";

export type HandleOpts = {
    full: boolean;
    matches?: RegExp;
};

const processTypesInFile = (filepath: string, opts: HandleOpts) => {
    const project = new TsMorph.Project({});
    const file = project.addSourceFileAtPath(filepath);

    file.formatText();

    const aliases = file.getTypeAliases();
    const interfaces = file.getInterfaces();
    const collectedTypes = [...aliases, ...interfaces].filter((t) => {
        if (!opts.matches) {
            return true;
        }

        return !!t.getName().match(opts.matches);
    });

    if (opts.full && !collectedTypes.length) {
        return;
    }

    console.log("//--");
    console.log(`// ${filepath}`);

    for (const t of collectedTypes) {
        console.log(t.getText());
    }
};

export const handlePattern = async (pattern: string, opts: HandleOpts) => {
    const filenames = await readFilenames(process.cwd(), pattern);

    for (const filename of filenames) {
        processTypesInFile(filename, opts);
    }
};
