import { existsSync } from 'node:fs';
import { cp, rm, rename } from 'node:fs/promises';
import { spawn } from 'node:child_process';

const apiDir = 'app/api';
const apiTmpDir = '.piebox/tmp/app-api-build-ios';

function run(command, args, env = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: false,
      env: { ...process.env, ...env },
    });

    child.on('exit', code => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(' ')} failed with code ${code}`));
    });
    child.on('error', reject);
  });
}

async function main() {
  await rm(apiTmpDir, { recursive: true, force: true });

  let movedApi = false;
  try {
    if (existsSync(apiDir)) {
      await rename(apiDir, apiTmpDir);
      movedApi = true;
    }

    await run('npm', ['run', 'build'], { CAPACITOR_EXPORT: '1' });
  } finally {
    if (movedApi) {
      await rename(apiTmpDir, apiDir);
    }
  }

  await rm('ios/App/App/public', { recursive: true, force: true });
  await cp('out', 'ios/App/App/public', { recursive: true });
  await cp('public/favicon.ico', 'ios/App/App/public/favicon.ico');
  await cp('public/icon.png', 'ios/App/App/public/icon.png');
  await run('npx', ['cap', 'copy', 'ios']);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
