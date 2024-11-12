#!/usr/bin/env node

import { program } from "commander";
import { handlePattern } from "./typescript";

program
    .description("Typex is a tool for extracting types from TypeScript modules")
    .argument("<patterns...>", "Patterns of filenames to scan for types")
    .option("-f, --full", "Will only print print files with at least one type")
    .option("-m, --matches <regex>", "Regex if included will be used to filter the types")
    .option("-l, --flags <flags>", "Flags for the regex passed in -m, --matches")
    .action(async (patterns, { full, matches, flags }) => {
        const opts = {
            full: !!full,
            matches: matches ? new RegExp(matches, flags) : undefined,
        };

        await Promise.all(patterns.map((p: string) => handlePattern(p, opts)));
    });

program.parse();
