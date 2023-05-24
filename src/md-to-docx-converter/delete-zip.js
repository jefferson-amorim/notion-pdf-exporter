const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

execute();

async function execute() {
    let counter = 0;

    const toUnzip = fs.readdirSync(path.resolve(`${process.cwd()}/centro-cirurgico`))
        .map(pathName => path.resolve(`${process.cwd()}/centro-cirurgico/${pathName}`))
        .filter(p => p.endsWith('.zip') && fs.lstatSync(p).isFile());
    
    console.log('Files to delete', toUnzip.length);
    
    const unziped = await Promise.all(toUnzip.map(p => (new Promise(async (resolve, reject) => {
            if (!1) {
                return resolve();
            }
            if (++counter >= 1000) {
                await sleep();
                counter = 0;
            }
            exec(`rm -rf "${p}"`, {
                cwd: path.dirname(p)
            }, (error, stdout, stderr) => {
                // console.error(`unzip stdout: ${stdout}`);
                // console.error(`unzip error: ${error}`);
                // console.error(`unzip stderr: ${stderr}`);
                if (error || stderr) {
                    console.error(`Error: ${p}`);
                    console.error(`error: ${error}`);
                    console.error(`stderr: ${stderr}`);
                    resolve(error);
                    return;
                }
                console.log(`Deleted: ${p}`);
                resolve(stdout);
            });
        }))));

    console.log('Delete zip files:', unziped.length);
}

function sleep(time = 10000) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}
