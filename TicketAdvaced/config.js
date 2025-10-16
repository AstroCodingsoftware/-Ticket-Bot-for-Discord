import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'jsonc-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawData = fs.readFileSync(path.join(__dirname, 'settings.jsonc'), 'utf-8');
const settings = parse(rawData);

export default settings;
