import { exec } from 'child_process';
/**
 ** Выполнение и обработка выполнения команды  cli`
 * @function execWaitForOutput
 * @param {string} command - команда для выполнения
 * @return {Promise<string>}
 */
export const execCLI = async (command) => {
    let result = '';
    return new Promise((resolve, reject) => {
        const childProcess = exec(command, { encoding: 'utf8' });
        childProcess.stderr.on('data', (data) => {
            reject(data);
        });
        childProcess.stdout.on('data', (data) => {
            result += data;
        });
        childProcess.on('close', (data) => {
            resolve(result);
        });
        childProcess.on('error', (error) => {
            reject();
        });
    });
};
