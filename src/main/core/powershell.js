import { spawn } from 'child_process'

//Take in a file, run powershell with that file. Read stdout and return it. console.log error if there is one
//Since this is an older command built into node, have to run the entire function inside a Promise and resolve with the output or reject with the error

export function runScript(file, args = []) {
  //runScript takes in a file and an optional array of any other args you want to pass it.
  return new Promise((resolve, reject) => {
    const argumentsArr = ['-ExecutionPolicy', 'Bypass', '-File', file, ...args]

    const powershell = spawn('powershell.exe', argumentsArr)

    //Read stdout and stderr
    let stdout = ''
    let stderr = ''

    powershell.stdout.on('data', (data) => {
      stdout += data.toString()
    })

    powershell.stderr.on('data', (data) => {
      stderr += data.toString()
    })

    //Handle error
    powershell.on('error', (err) => {
      console.error('Failed to start process:', err.message)
      reject(new Error(`Process launch failed: ${err.message}`))
    })

    //Handle process exit and return resolve and reject respectively
    powershell.on('close', (code) => {
      console.log(`Powershell exitted with code ${code}`)

      let result = {
        stdout: stdout,
        stderr: stderr,

        toString() {
          return stdout + stderr
        }
      }

      if (code == 0) {
        if (stdout != '' || stderr != '') {
          console.log(`\nFull output:\nstdout: \n${result.stdout}\n\nstderr: ${result.stderr}`)
        }
        resolve(result)
      } else {
        reject(new Error(`Script failed with code: ${code}, \nstderr: ${stderr}`))
      }
    })
  })
}

// //Read output, take in a powershell that is Child process and read the stdout, return it as string

// We dont need helper methods, we can just bake these into the function (readStdout and read Stderr) it's not like we reuse them.
