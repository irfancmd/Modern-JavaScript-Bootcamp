#!/usr/bin/env node

import fs from "fs";
import path from "path";
import chalk from "chalk";

// Get a promisified version of the lstat function
const { lstat } = fs.promises;

// Current working directory will be default if no argument is passed
const targetDir = process.argv[2] || process.cwd();

fs.readdir(targetDir, async (err, fileNames) => {
    if(err) {
        console.log(err);
        return;
    }

    // Callbacks donesn't execute sequentially so order of file names wouldn't
    // match if we used them. That's why we're using a promisified version of
    // lstat function since we can use await for maintaining the sequence
    const statPromises = fileNames.map(fileName => {
        return lstat(path.join(targetDir, fileName));
    });

    // Promise processing will be parallel so it's better than looping over
    // and using await for individual promises.
    const allStats = await Promise.all(statPromises);

    for(let stats of allStats) {
        const index = allStats.indexOf(stats);
        
        if(stats.isFile()) {
            console.log(fileNames[index]);
        } else {
            console.log(chalk.bold(chalk.blue(fileNames[index])));
        }
    }
});