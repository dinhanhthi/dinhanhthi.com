import { execFileSync } from 'node:child_process'

const port = 3004

function listenPids() {
  try {
    const output = execFileSync('lsof', ['-nP', `-iTCP:${port}`, '-sTCP:LISTEN', '-t'], {
      encoding: 'utf8'
    })
    return [...new Set(output.split(/\s+/).filter(Boolean))]
  } catch {
    return []
  }
}

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms)
}

function signal(pid, name) {
  try {
    process.kill(Number(pid), name)
    return true
  } catch {
    return false
  }
}

const initial = listenPids()
if (initial.length === 0) process.exit(0)

for (const pid of initial) {
  if (signal(pid, 'SIGTERM')) console.log(`Stopping process ${pid} on port ${port}`)
}

const deadline = Date.now() + 3000
while (Date.now() < deadline && listenPids().length > 0) sleep(100)

for (const pid of listenPids()) {
  if (signal(pid, 'SIGKILL')) console.log(`Killing process ${pid} on port ${port}`)
}

const hardDeadline = Date.now() + 1000
while (Date.now() < hardDeadline && listenPids().length > 0) sleep(100)

if (listenPids().length > 0) {
  console.error(`Port ${port} is still in use.`)
  process.exit(1)
}
