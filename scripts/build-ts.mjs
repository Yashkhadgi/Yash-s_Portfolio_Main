import { readFileSync, writeFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';

for (const name of ['journey-scroll', 'portfolio-motion']) {
  const source = readFileSync(new URL(`../${name}.ts`, import.meta.url), 'utf8');
  const output = stripTypeScriptTypes(source, { mode: 'strip' });
  writeFileSync(new URL(`../${name}.js`, import.meta.url), output);
}
