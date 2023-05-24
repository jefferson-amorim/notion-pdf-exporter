const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

execute();

async function execute() {
    let counter = 0;
    let mdFiles = getAllMdFilePathFromDirectory(path.resolve(`${process.cwd()}/centro-cirurgico`), []);
    mdFiles = mdFiles.slice(0, 1000);
    console.log('Files', mdFiles.length)

    const convertedFiles = await Promise.all(mdFiles
        .map(mdFile => {
            return new Promise(async (resolve, reject) => {
                if (++counter >= 150) {
                    await sleep();
                    counter = 0;
                }
                console.log('Converting', mdFile);
                exec(`pandoc -s "${mdFile}" -o "${mdFile.replace('.md', '.docx')}"`, {
                    cwd: path.dirname(mdFile)
                }, (error, stdout, stderr) => {
                    // console.error(`stdout: ${stdout}`);
                    // console.error(`error: ${error}`);
                    // console.error(`stderr: ${stderr}`);
                    if (error || stderr) {
                        console.error(`${mdFile}`);
                        console.error(`stderr: ${error}`);
                        console.error(`stderr: ${stderr}`);
                        resolve();
                        return;
                    }
                    exec(`rm -rf "${mdFile}"`, {
                        cwd: path.dirname(mdFile)
                    }).on('error', console.error);
                    resolve(stdout);
                }).on('error', console.error);
            });
        }));

    console.log('Converted files', convertedFiles.length)
}

function getAllMdFilePathFromDirectory(directoryPath, filePaths = []) {
    const paths = fs.readdirSync(path.resolve(directoryPath))
        .map(pathName => `${directoryPath}/${pathName}`);

    const mdFilesPaths = paths.filter(p => p.endsWith('.md') && fs.lstatSync(path.resolve(p)).isFile());
    filePaths = filePaths.concat(mdFilesPaths);

    const subdirectoriesPaths = paths.filter(p => fs.lstatSync(path.resolve(p)).isDirectory());
    filePaths = filePaths.concat(subdirectoriesPaths.flatMap(subdirectoryPath => getAllMdFilePathFromDirectory(subdirectoryPath)));

    return filePaths;
}

function sleep(time = 30 * 1000) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}
