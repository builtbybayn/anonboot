import { writeFile, readFile } from 'fs/promises'

//Read stdout for a JSON thats emitted on a successful detect
export function parseJson(stdout) {
  const START_MARKER = '[[AB_JSON:START]]'
  const END_MARKER = '[[AB_JSON:END]]'

  const start = stdout.indexOf(START_MARKER) + START_MARKER.length
  const end = stdout.indexOf(END_MARKER, start)

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Could not find JSON markers in stdout.')
  }

  const jsonStr = stdout.slice(start, end)

  //Return a JSON object not a string
  return JSON.parse(jsonStr)
}

//Write to the snapshot file a JSON
//writeFile function will create a file if it doesnt exist to write to, and if it does exist, truncate before writing, so its perfect for this use.
//BUT since we are storing multiple processes in one file, that makes it a bit more complicated.

// This writesnapshot will read the entire snapshot file, rewrite the whole thing and only change what it needs. (Gets passed in a process
// name as an argument that tells it what to encapsulate that data in. It can also use this to check if that already exists or if it needs to
// make it new.

//TODO: 12/5/2025 - Refactor this capturing.js file to take in a file to write to so that it can write once to a snapshot.json where it stores the original state of the OS
// It will then not touch that file. BUT the app still needs to know the current state of things, either enabled or disabled. We will do this with a state.json, that will
// be able to be written to using detect and passing in the state.json file (via the new changes to this file I make) through the call with detect.

export async function writeCapture(json, processName, filePath) {
  // json = JSON.stringify(json);

  const allCaptures = await readFullCaptureFile(filePath)

  //DEBUG: Check for string type when it should have returned JSON object
  if (typeof allCaptures != 'object' || allCaptures == null) {
    console.error(
      `Fatal error, readFullCaptureFile() is returning a string not a JSON object. \nType of allCaptures variable: ${typeof allCaptures}`
    )
    throw new Error(`Error, cannot process strings for snapshots`)
  }

  //This line will either update or create the necessary section in the json for the process
  allCaptures[processName] = json //This is failing because it cant add a 'DiagTrack' property to the allCaptures string. So allCaptures must somehow be turned to JSON obj

  //Add a time stamp if you want
  //allCaptures[processName].timestamp = new Date().toISOString();

  const resultJson = JSON.stringify(allCaptures)

  console.log(`Attempting to write data to : ${filePath}`)
  try {
    await writeFile(filePath, resultJson, { flag: 'w', encoding: 'utf8' })

    console.log(`Succesfully wrote to ${filePath}`)
  } catch (error) {
    console.error(`Error: Failed to write capture file: ${error.message}`)
    throw error
  }
}

// NEW: Bulk write to avoid race conditions, massive performance boost
export async function writeBulkCapture(newDataObject, filePath) {
  const allCaptures = await readFullCaptureFile(filePath)

  if (typeof allCaptures != 'object' || allCaptures == null) {
    throw new Error(`Error, readFullCaptureFile returned invalid object`)
  }

  // Merge new data into existing
  Object.assign(allCaptures, newDataObject)

  const resultJson = JSON.stringify(allCaptures)

  try {
    await writeFile(filePath, resultJson, { flag: 'w', encoding: 'utf8' })
    console.log(`Succesfully wrote bulk data to ${filePath}`)
  } catch (error) {
    console.error(`Error: Failed to write bulk capture file: ${error.message}`)
    throw error
  }
}

export async function getProcessCapture(processName, filePath) {
  try {
    const allSnapshots = await readFullCaptureFile(filePath)
    const processSnap = allSnapshots[processName]

    if (processSnap) {
      console.log(`Capture Reader found capture for ${processName}`)
      return processSnap
    } else {
      console.warn(`Capture Reader process'${processName}' not found in ${filePath} (Fuck)`)
      return null
    }
  } catch (error) {
    console.error(`Error retrieving capture for ${processName}.\nError: ${error.message}`)
    throw new Error(`Failed to process capture (Fuck) ${error.message}`)
  }
}

async function readFullCaptureFile(filePath) {
  try {
    const jsonStr = await readFile(filePath, { encoding: 'utf8' })

    if (jsonStr.trim() == '') {
      return {}
    }

    return JSON.parse(jsonStr)
  } catch (error) {
    // Handle common file not found error specifically
    if (error.code === 'ENOENT') {
      console.error(`Error: capture file not found at ${filePath}.`)
      return {}
    }
    throw new Error(`Failed to read capture file (Fuck) ${error.message}`)
  }
}
