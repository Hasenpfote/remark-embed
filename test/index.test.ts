import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import { expect, test } from 'vitest'
import remarkEmbed from '../src/index'
import type { UserOptions } from '../src/index'
import testCases from './fixtures'

const parse = async (
  markdown: string,
  options: UserOptions = {},
): Promise<string> => {
  const file = await unified()
    .use(remarkParse)
    .use(remarkEmbed, options)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown)

  return String(file)
}

test.each(testCases)(
  'Test: $name',
  async ({ name, input, options, expected }) => {
    const result = await parse(input, options)
    expect(result).toBe(expected)
  },
)
