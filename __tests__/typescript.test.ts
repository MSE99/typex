import Crypto from "crypto";
import Fs from "fs";
import OS from "os";
import Path from "path";
import { describe, expect, test, vi } from "vitest";
import { handlePattern } from "../src/typescript";

describe("fs", () => {
    const prepTestDir = () => {
        const testDirPath = Path.join(OS.tmpdir(), `typex-test-dir-${Crypto.randomInt(5_000_000)}`);
        Fs.mkdirSync(testDirPath);
        return testDirPath;
    };

    test("handlePattern: should not print anything inside an empty dir.", async () => {
        const dir = prepTestDir();
        vi.spyOn(process, "cwd").mockReturnValue(dir);
        vi.spyOn(console, "log");

        await handlePattern("*.ts");

        expect(console.log).not.toHaveBeenCalled();
    });

    test("handlePattern: should only print types inside files.", async () => {
        const dir = prepTestDir();

        Fs.writeFileSync(
            Path.join(dir, "1.ts"),
            `
            interface Foo {}
            type Baz = {}
            var Naz = {}

            function red() {}

            const {} = {}
        `,
        );

        let printed = "";

        vi.spyOn(process, "cwd").mockReturnValue(dir);
        vi.spyOn(console, "log").mockImplementation((...args: string[]) => {
            args.forEach((a) => (printed += a));
        });

        await handlePattern("*.ts");

        expect(printed).toContain("Foo");
        expect(printed).toContain("Baz");
        expect(printed).not.toContain("Naz");
    });
});
