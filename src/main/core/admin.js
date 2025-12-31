import { exec } from 'child_process'

export function isUserAdmin() {
  return new Promise((resolve) => {
    exec('net session', (err) => {
      // If "net session" runs without error (exit code 0), we are admin.
      // If it fails (Access Denied), we are not.
      resolve(!err)
    })
  })
}
