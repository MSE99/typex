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

        await handlePattern("*.ts", {
            full: false,
        });

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

        await handlePattern("*.ts", { full: false });

        expect(printed).toContain("Foo");
        expect(printed).toContain("Baz");
        expect(printed).not.toContain("Naz");
    });

    test("handlePattern: should support type filters.", async () => {
        const dir = prepTestDir();

        Fs.writeFileSync(
            Path.join(dir, "1.ts"),
            `
            interface Foo {}
            interface Foo2 {}
            interface Foo3 {}

            type Baz = {}
            var Naz = {}

            function red() {}

            const {} = {}
        `,
        );

        Fs.writeFileSync(Path.join(dir, "2.ts"), `const nummy = 12`);

        let printed = "";

        vi.spyOn(process, "cwd").mockReturnValue(dir);
        vi.spyOn(console, "log").mockImplementation((...args: string[]) => {
            args.forEach((a) => (printed += a));
        });

        await handlePattern("*.ts", { full: true, matches: /Foo.*/ });

        expect(printed).toContain("Foo");
        expect(printed).toContain("Foo2");
        expect(printed).toContain("Foo3");
        expect(printed).not.toContain("Baz");
        expect(printed).not.toContain("Naz");
    });
});
