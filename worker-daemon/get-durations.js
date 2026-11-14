const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ffmpeg = "C:\\Users\\Caussel\\AppData\\Local\\Microsoft\\WinGet\\Links\\ffmpeg.exe";
const dir = path.join(__dirname, "audio-temp");

const files = fs.readdirSync(dir).filter(f => f.endsWith('.wav'));
files.forEach(f => {
  try {
    const fullPath = path.join(dir, f);
    const out = execSync(`"${ffmpeg}" -i "${fullPath}"`, { stdio: ['pipe', 'pipe', 'pipe'] }).toString();
  } catch (err) {
    const stderr = err.stderr ? err.stderr.toString() : '';
    const m = stderr.match(/Duration: (\d{2}:\d{2}:\d{2}\.\d+)/);
    console.log(`${f}: ${m ? m[1] : 'unknown'}`);
  }
});
