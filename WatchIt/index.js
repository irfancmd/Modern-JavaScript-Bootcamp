#!/usr/bin/env node

import fs from "fs";
import { spawn } from "child_process";
import chokidar from "chokidar";
import debounce from "lodash.debounce";
import program from "caporal";
import chalk from "chalk";

program
    .version("0.0.1")
    .argument("[filename]", "Name of a file to execute.")
    .action(async args => {
        const name = args.filename || "index.js";

        // Make sure the file is accessible
        try {
            await fs.promises.access(name);
        } catch(err) {
            throw new Error(`Could not access the file: ${name}`);
        }

        // When we start the program, a whole bunch of add event will be trigerred as chorkidar
        // will call it whenever it discoveres a new file in the directory. But we don't want to
        // restart the program for finding existing files. So we're debouncing this function in a
        // way that two consequtive callbacks must have at least 100ms delay between them.
        let childProcess;
        const start = debounce(() => {
            // If a child process is already running, stop it
            if(childProcess) {
                childProcess.kill();
            }

            console.log(chalk.bold(chalk.blue(">>>> Restarting process...")));
            childProcess = spawn("node", [name], {stdio: "inherit"});
        }, 100);

        chokidar.watch(".")
                    .on("add", start)
                    .on("change", start)
                    .on("unlink", start);
    });

program.parse(process.argv);


