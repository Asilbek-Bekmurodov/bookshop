import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// swagger.js ni dinamik import qilib spec ni olamiz
const { default: swaggerSpec } = await import('../src/config/swagger.js');

const outPath = resolve(__dirname, '../api.json');
writeFileSync(outPath, JSON.stringify(swaggerSpec, null, 2), 'utf8');
console.log(`api.json yaratildi: ${outPath}`);
