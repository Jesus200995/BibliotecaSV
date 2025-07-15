// Test simple del servidor
const { spawn } = require('child_process');
const path = require('path');

console.log('Iniciando servidor desde:', __dirname);

const serverProcess = spawn('node', ['index.js'], {
  cwd: __dirname,
  stdio: 'inherit'
});

serverProcess.on('error', (err) => {
  console.error('Error al iniciar servidor:', err);
});

serverProcess.on('close', (code) => {
  console.log(`Servidor terminado con código ${code}`);
});
