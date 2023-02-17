import type { APIContext } from 'astro';
import { writeFile } from 'fs/promises';

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(__filename);
console.log(__dirname);

// File routes export a get() function, which gets called to generate the file.
// Return an object with `body` to save the file contents in your final build.
export async function post({ params, request }: APIContext) {
  const formData = await request.formData();
  await Promise.all(
    formData
      .getAll('files')
      .map(async (file: File) =>
        writeFile(
          resolve(__dirname, 'tmp', file.webkitRelativePath ?? file.name),
          new Uint8Array(await file.arrayBuffer())
        )
      )
  );

  return {
    body: JSON.stringify({
      fileNames: await Promise.all(
        formData.getAll('files').map(async (file: File) => {
          return {
            webkitRelativePath: file.webkitRelativePath,
            lastModified: file.lastModified,
            name: file.name,
            size: file.size,
            type: file.type,
            buffer: {
              type: 'Buffer',
              value: Array.from(
                new Int8Array(await file.arrayBuffer()).values()
              ),
            },
          };
        })
      ),
    }),
  };
}
