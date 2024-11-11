#!/usr/bin/env bun

import { program } from "commander";
import { handlePattern } from "./typescript";

program
    .description("Typex is a tool for extracting types from TypeScript modules")
    .arguments("<patterns...>")
    .action((patterns) => {
        patterns.forEach(handlePattern);
    });

program.parse();
