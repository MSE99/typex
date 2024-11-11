import TsMorph from "ts-morph";
import { readFilenames } from "./fs";

const processTypesInFile = (filepath: string) => {
    const project = new TsMorph.Project({});
    const file = project.addSourceFileAtPath(filepath);

    file.formatText();

    const aliases = file.getTypeAliases();
    const interfaces = file.getInterfaces();

    console.log("//--");
    console.log(`// ${filepath}`);

    for (const node of [...interfaces, ...aliases]) {
        console.log(node.getText());
    }
};

export const handlePattern = async (pattern: string) => {
    const filenames = await readFilenames(process.cwd(), pattern);

    for (const filename of filenames) {
        processTypesInFile(filename);
    }
};
