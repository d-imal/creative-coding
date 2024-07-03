import fs from 'fs';
import path from 'path';
import concurrently from 'concurrently';

const sketchesDir = path.join(__dirname, '../', 'sketches');
const dirs = fs.readdirSync(sketchesDir);

const commands = dirs
  .map((dir) => {
    const packageJsonPath = path.join(sketchesDir, dir, 'package.json');

    if (fs.existsSync(packageJsonPath)) {
      const packageJson = require(packageJsonPath);

      if (packageJson.scripts && packageJson.scripts.watch) {
        return {
          command: `yarn workspace ${packageJson.name} watch`,
          name: packageJson.name,
        };
      }
    }

    return null;
  })
  .filter(Boolean);

if (commands.length) {
  concurrently(commands)
    .result.then((result) => {
      console.log('All commands completed successfully:', result);
    })
    .catch((error) => {
      console.error('Some commands failed:', error);
    });
} else {
  console.log('No watch scripts found to run.');
}
