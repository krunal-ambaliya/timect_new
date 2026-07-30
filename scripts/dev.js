const net = require('net');
const path = require('path');
const { spawn } = require('child_process');

function checkPort(port, host) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    if (host) {
      server.listen(port, host);
    } else {
      server.listen(port);
    }
  });
}

async function isPortAvailable(port) {
  const isFreeDefault = await checkPort(port);
  if (!isFreeDefault) return false;

  const isFreeIPv4 = await checkPort(port, '127.0.0.1');
  if (!isFreeIPv4) return false;

  const isFreeAllIPv4 = await checkPort(port, '0.0.0.0');
  if (!isFreeAllIPv4) return false;

  const isFreeIPv6 = await checkPort(port, '::');
  if (!isFreeIPv6) return false;

  const isFreeIPv6Local = await checkPort(port, '::1');
  if (!isFreeIPv6Local) return false;

  return true;
}

async function getAvailablePort(startPort) {
  let port = startPort;
  while (!(await isPortAvailable(port))) {
    port++;
  }
  return port;
}

async function main() {
  const initialPort = parseInt(process.env.PORT || '3000', 10);
  const availablePort = await getAvailablePort(initialPort);

  if (availablePort !== initialPort) {
    console.log(`\x1b[33m[Dev Server] Port ${initialPort} is in use. Auto-switching to dynamic port ${availablePort}...\x1b[0m`);
  } else {
    console.log(`\x1b[32m[Dev Server] Starting Next.js on port ${availablePort}...\x1b[0m`);
  }

  const extraArgs = process.argv.slice(2);
  const nextBin = require.resolve('next/dist/bin/next');
  const nextArgs = [nextBin, 'dev', '-p', availablePort.toString(), ...extraArgs];

  const nextProcess = spawn(process.execPath, nextArgs, {
    stdio: 'inherit',
  });

  nextProcess.on('exit', (code) => {
    process.exit(code || 0);
  });

  process.on('SIGINT', () => {
    nextProcess.kill('SIGINT');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    nextProcess.kill('SIGTERM');
    process.exit(0);
  });
}

main();
