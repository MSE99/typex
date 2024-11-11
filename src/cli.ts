#!/usr/bin/env bun

import { program } from "commander";
import { handlePattern } from "./typescript";

program
    .description("Typex is a tool for extracting types from TypeScript modules")
    .argument("<patterns...>", "Patterns of filenames to scan for types")
    .action((patterns) => {
        patterns.forEach(handlePattern);
    });

program.parse();
