const { spawn } = require('child_process');

const ipfsDaemonProcess = spawn('ipfs', ['daemon']);

ipfsDaemonProcess.stdout.on('data', (data) => {
  console.log(`IPFS stdout: ${data}`);
});

ipfsDaemonProcess.stderr.on('data', (data) => {
  console.error(`IPFS stderr: ${data}`);
});

ipfsDaemonProcess.on('close', (code) => {
  console.log(`IPFS process exited with code ${code}`);
});
