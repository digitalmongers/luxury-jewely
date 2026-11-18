import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const nextBin = require.resolve('next/dist/bin/next');

const rawArgs = process.argv.slice(2);
let port = process.env.PORT || '3000';
let hostname = '0.0.0.0';
const passthroughArgs = [];

for (let i = 0; i < rawArgs.length; i += 1) {
  const arg = rawArgs[i];

  if (arg === '--') {
    continue;
  }

  if (arg.startsWith('--port=')) {
    port = arg.slice('--port='.length) || port;
    continue;
  }
  if (arg === '--port' || arg === '-p') {
    const nextVal = rawArgs[i + 1];
    if (nextVal && !nextVal.startsWith('-')) {
      port = nextVal;
      i += 1;
    }
    continue;
  }

  if (arg.startsWith('--host=')) {
    hostname = arg.slice('--host='.length) || hostname;
    continue;
  }
  if (arg.startsWith('--hostname=')) {
    hostname = arg.slice('--hostname='.length) || hostname;
    continue;
  }
  if (arg === '--host' || arg === '--hostname' || arg === '-H') {
    const nextVal = rawArgs[i + 1];
    if (nextVal && !nextVal.startsWith('-')) {
      hostname = nextVal;
      i += 1;
    }
    continue;
  }

  passthroughArgs.push(arg);
}

const child = spawn(
  process.execPath,
  [nextBin, 'dev', '-p', String(port), '-H', String(hostname), ...passthroughArgs],
  {
    stdio: 'inherit',
    env: process.env,
  }
);

const forwardSignal = (signal) => {
  if (!child.killed) {
    child.kill(signal);
  }
};

process.on('SIGINT', () => forwardSignal('SIGINT'));
process.on('SIGTERM', () => forwardSignal('SIGTERM'));

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});
