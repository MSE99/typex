import Crypto from "crypto";
import Fs from "fs";
import OS from "os";
import Path from "path";
import { describe, expect, test } from "vitest";
import { readFilenames } from "../src/fs";

describe("fs", () => {
    const prepTestDir = () => {
        const testDirPath = Path.join(OS.tmpdir(), `typex-test-dir-${Crypto.randomInt(5_000_000)}`);
        Fs.mkdirSync(testDirPath);
        return testDirPath;
    };

    test("readFilenames: [] for empty dir.", async () => {
        const files = await readFilenames(prepTestDir(), "*");
        expect(files).toEqual([]);
    });

    test("readFilenames: should match ts files.", async () => {
        const path = prepTestDir();

        Fs.writeFileSync(Path.join(path, "1.ts"), "");
        Fs.writeFileSync(Path.join(path, "2.ts"), "");
        Fs.writeFileSync(Path.join(path, "3.ts"), "");
        Fs.writeFileSync(Path.join(path, "4.js"), "");
        Fs.writeFileSync(Path.join(path, "5.css"), "");
        Fs.writeFileSync(Path.join(path, "6.html"), "");

        const files = await readFilenames(path, "*.ts");
        files.sort();

        expect(files).toEqual(["1.ts", "2.ts", "3.ts"]);
    });
});
