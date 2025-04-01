# remark-embed

[![CI](https://github.com/Hasenpfote/remark-embed/actions/workflows/ci.yml/badge.svg)](https://github.com/Hasenpfote/remark-embed/actions/workflows/ci.yml)

A remark plugin that transforms links in Markdown into figures with captions.

## Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [License](#license)

## Introduction

This package is a unified plugin for remark that processes link nodes with titles (e.g., `[](url "A title")`) and transforms them into semantic `<figure>` elements. The title attribute is used as a caption, enhancing the accessibility and readability of Markdown content.

## Installation

This package is ESM-only.

```shellsession
npm install git+https://github.com/Hasenpfote/remark-embed.git
```

## Usage

```typescript
import rehypeStringify from 'rehype-stringify'
import remarkEmbed from 'remark-embed'
import type { UserOptions } from 'remark-embed'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

const markdown = '[](https://www.youtube.com/watch?v=exampleID, "A title")'
const options = {
  sources: [
    {
      contentUrl: /^https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)$/,
      embedUrl: 'https://www.youtube.com/embed/${1}',
    },
  ],
}

;(async (markdown: string, options: UserOptions = {}): Promise<void> => {
  const file = await unified()
    .use(remarkParse)
    .use(remarkEmbed, options)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(markdown)

  console.log(String(file))
})(markdown, options)
```

Running that yields:

```html
<figure>
  <div>
    <figure>
      <iframe src="https://www.youtube.com/embed/exampleID"></iframe>
      <figcaption>A title</figcaption>
    </figure>
  </div>
</figure>
```

### Single Site

Options:

```typescript
const options = {
  sources: [
    {
      contentUrl: /^https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)$/,
      embedUrl: 'https://www.youtube.com/embed/${1}',
    },
  ],
}
```

#### With Caption

Markdown:

```markdown
[](https://www.youtube.com/watch?v=exampleID "A title")
```

HTML:

```html
<figure>
  <div>
    <figure>
      <iframe src="https://www.youtube.com/embed/exampleID"></iframe>
      <figcaption>A title</figcaption>
    </figure>
  </div>
</figure>
```

#### Without Caption

Markdown:

```markdown
[](https://www.youtube.com/watch?v=exampleID)
```

HTML:

```html
<figure>
  <div>
    <iframe src="https://www.youtube.com/embed/exampleID"></iframe>
  </div>
</figure>
```

### Multiple Sites

When you include only links within a paragraph, they will be grouped together. Hard or soft breaks can also be used.

Options:

```typescript
const options = {
  sources: [
    {
      contentUrl: /^https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)$/,
      embedUrl: 'https://www.youtube.com/embed/${1}',
    },
    {
      contentUrl: /^https:\/\/www.bilibili.com\/video\/([a-zA-Z0-9]+)\/?/,
      embedUrl: '//player.bilibili.com/player.html',
      queryParams: {
        bvid: '${1}',
        p: 1,
      },
    },
  ],
}
```

#### With Captions

Markdown:

```markdown
[](https://www.youtube.com/watch?v=exampleID "Title 1")  
[](https://www.bilibili.com/video/exampleID "Title 2")
```

HTML:

```html
<figure>
  <div>
    <figure>
      <iframe src="https://www.youtube.com/embed/exampleID"></iframe>
      <figcaption>Title 1</figcaption>
    </figure>
    <figure>
      <iframe src="//player.bilibili.com/player.html?bvid=exampleID&p=1"></iframe>
      <figcaption>Title 2</figcaption>
    </figure>
  </div>
</figure>
```

#### Without Captions

Markdown:

```markdown
[](https://www.youtube.com/watch?v=exampleID)  
[](https://www.bilibili.com/video/exampleID)
```

HTML:

```html
<figure>
  <div>
    <iframe src="https://www.youtube.com/embed/exampleID"></iframe>
    <iframe src="//player.bilibili.com/player.html?bvid=exampleID&p=1"></iframe>
  </div>
</figure>
```

### Multiple Sites with Shared Caption

When you include only links within a paragraph, they will be grouped together. Hard or soft breaks can also be used.

Options:

```typescript
const options = {
  sources: [
    {
      contentUrl: /^https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)$/,
      embedUrl: 'https://www.youtube.com/embed/${1}',
    },
    {
      contentUrl: /^https:\/\/www\.desmos\.com\/calculator\/(?:[a-zA-Z0-9]+)$/,
      queryParams: {
        embed: '',
      },
    },
  ],
}
```

Markdown:

```markdown
[](https://www.youtube.com/watch?v=exampleID "This becomes the caption")  
[](https://www.desmos.com/calculator/exampleID1)  
[](https://www.desmos.com/calculator/exampleID2)
```

HTML:

```html
<figure>
  <div>
    <iframe src="https://www.youtube.com/embed/exampleID"></iframe>
    <iframe src="https://www.desmos.com/calculator/exampleID1?embed="></iframe>
    <iframe src="https://www.desmos.com/calculator/exampleID2?embed="></iframe>
  </div>
  <figcaption>This becomes the caption</figcaption>
</figure>
```

## API Reference

The default export is `remarkEmbed`.

### Options

| Name      | Type     | Default | Description                                              |
| --------- | -------- | ------- | -------------------------------------------------------- |
| className | string   | ""      | The class name to apply to the outer `<figure>` element. |
| sources   | Source[] | []      | An array of Source objects for embedding.                |

#### Source

| Name             | Type                | Required | Description                                                                                                                          |
| ---------------- | ------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| contentUrl       | RegExp              | ✅        | A regular expression to match URLs for embedding a website.                                                                          |
| embedUrl         | string              | -        | The URL format used for embedding a website. Supports placeholders like `${N}`, which correspond to captured groups in `contentUrl`. |
| queryParams      | Record<string, any> | -        | Query parameters to append to the embed URL. Supports placeholders like `${N}`, which correspond to captured groups in `contentUrl`. |
| iframeAttributes | Record<string, any> | -        | Additional attributes to set on the iframe element.                                                                                  |

### Site-specific Options

Below are configuration examples for embedding specific websites. For parameter details, please refer to the documentation of each website.

#### YouTube

```javascript
{
  sources: [
    {
      contentUrl: /^https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)$/,
      embedUrl: 'https://www.youtube.com/embed/${1}',
      iframeAttributes: {
        loading: 'lazy',
        title: 'YouTube video player',
        allow:
          'fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
        referrerpolicy: 'strict-origin-when-cross-origin',
      },
    },
  ],
}
```

#### Bilibili

```javascript
{
  sources: [
    {
      contentUrl: /https:\/\/www.bilibili.com\/video\/([a-zA-Z0-9]+)\/?/,
      embedUrl: '//player.bilibili.com/player.html',
      queryParams: {
        poster: 1,
        autoplay: 0,
        bvid: '${1}',
        p: 1,
      },
      iframeAttributes: {
        loading: 'lazy',
        allow: 'fullscreen',
      },
    },
  ],
}
```

#### Desmos

```javascript
{
  sources: [
    {
      contentUrl:
        /^https:\/\/www\.desmos\.com\/calculator\/(?:[a-zA-Z0-9]+)$/,
      queryParams: {
        embed: '',
      },
      iframeAttributes: {
        loading: 'lazy',
      },
    },
  ],
}
```

## License

[MIT](https://github.com/Hasenpfote/remark-embed/blob/main/LICENSE)
