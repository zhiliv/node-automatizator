import { exec } from 'child_process'
import { ChildProcess } from 'child_process'

/**
 ** Выполнение и обработка выполнения команды  cli`
 * @function execWaitForOutput
 * @param {string} command - команда для выполнения
 * @return {Promise<string>}
 */
export const execCLI = async (command: string): Promise<string> => {
  let result: string = ''
  return new Promise((resolve, reject) => {
    const childProcess: ChildProcess = exec(command, { encoding: 'latin1' })
    
    
    childProcess.stderr.on('data', (data: string) => {
      reject(data)
    })

    childProcess.stdout.on('data', (data: string) => {
      result += data
    })

    childProcess.on('close', (data) => {
      resolve(result)
    })

    childProcess.on('error', (error: any) => {
      reject()
    })
  })
}
