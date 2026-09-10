// ponytail: teaching artifact — this repo has no real internal API/CRM to wrap, so this
// server just re-exposes what Read/Glob already give Claude directly, via the MCP protocol,
// as a homework exercise in writing one. Not meant to carry real value for this repo.
import { McpServer } from '@modelcontextprotocol/server';
import { StdioServerTransport } from '@modelcontextprotocol/server/stdio';
import * as z from 'zod/v4';
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
// dist/index.js -> mcp-servers/components-lister/dist -> repo root is three levels up
const UI_DIR = join(__dirname, '..', '..', '..', 'src', 'components', 'ui');

/** Returns the substring from `start` (a '{') through its matching closing '}'. */
function bracedBlock(src: string, start: number): string {
  let depth = 0;
  for (let i = start; i < src.length; i++) {
    if (src[i] === '{') depth++;
    else if (src[i] === '}' && --depth === 0) return src.slice(start, i + 1);
  }
  return '';
}

/** For a component file that uses cva(), pulls each variant group's option keys, e.g.
 *  { variant: ['default', 'secondary', ...], size: ['default', 'sm', 'lg', 'xl', 'icon'] } */
function extractVariants(src: string): Record<string, string[]> | undefined {
  const variantsIdx = src.indexOf('variants:', src.indexOf('cva('));
  if (variantsIdx === -1) return undefined;
  const inner = bracedBlock(src, src.indexOf('{', variantsIdx)).slice(1, -1);

  const result: Record<string, string[]> = {};
  const groupRe = /(\w+):\s*\{/g;
  let group: RegExpExecArray | null;
  while ((group = groupRe.exec(inner))) {
    const groupInner = bracedBlock(inner, group.index + group[0].length - 1).slice(1, -1);
    const options = [...groupInner.matchAll(/(\w+):\s*['"`]/g)].map((m) => m[1]);
    if (options.length) result[group[1]] = options;
  }
  return Object.keys(result).length ? result : undefined;
}

function listComponents() {
  return readdirSync(UI_DIR)
    .filter((f) => f.endsWith('.tsx') && !f.endsWith('.stories.tsx'))
    .map((file) => {
      const src = readFileSync(join(UI_DIR, file), 'utf-8');
      const exported = src.match(/export \{([^}]+)\};?/);
      return {
        file,
        components: exported ? exported[1].split(',').map((s) => s.trim()) : [],
        variants: extractVariants(src),
      };
    });
}

const server = new McpServer({ name: 'components-lister', version: '1.0.0' });

server.registerTool(
  'list_components',
  {
    description:
      "Lists the shadcn/ui components in this repo's src/components/ui: each file's exported " +
      'names, and — where the component uses cva() — its variant groups and their option keys.',
    inputSchema: z.object({}),
  },
  async () => ({
    content: [{ type: 'text' as const, text: JSON.stringify(listComponents(), null, 2) }],
  })
);

const transport = new StdioServerTransport();
await server.connect(transport);
