export default [
  {
    name: 'Combination: contentUrl + embedUrl',
    input: '[](https://example.com/watch?v=exampleID)',
    options: {
      sources: [
        {
          contentUrl: /^https:\/\/example\.com\/watch\?v=([a-zA-Z0-9_-]+)$/,
          embedUrl: 'https://example.com/embed/${1}',
        },
      ],
    },
    expected:
      '<figure><div><iframe src="https://example.com/embed/exampleID"></iframe></div></figure>',
  },
  {
    name: 'Combination: contentUrl + queryParams',
    input: '[](https://example.com/calculator/exampleID)',
    options: {
      sources: [
        {
          contentUrl: /^https:\/\/example.com\/calculator\/([a-zA-Z0-9]+)\/?/,
          queryParams: {
            embed: '',
          },
        },
      ],
    },
    expected:
      '<figure><div><iframe src="https://example.com/calculator/exampleID?embed="></iframe></div></figure>',
  },
  {
    name: 'Combination: contentUrl + embedUrl + queryParams',
    input: '[](https://example.com/video/exampleID)',
    options: {
      sources: [
        {
          contentUrl: /^https:\/\/example.com\/video\/([a-zA-Z0-9]+)\/?/,
          embedUrl: '//player.example.com/player.html',
          queryParams: {
            poster: 1,
            autoplay: 0,
            bvid: '${1}',
            p: 1,
          },
        },
      ],
    },
    expected:
      '<figure><div><iframe src="//player.example.com/player.html?poster=1&#x26;autoplay=0&#x26;bvid=exampleID&#x26;p=1"></iframe></div></figure>',
  },
  {
    name: 'Combination: contentUrl + embedUrl + queryParams + iframeAttributes',
    input: '[](https://example.com/view/exampleID)',
    options: {
      sources: [
        {
          contentUrl: /^https:\/\/example\.com\/view\/([a-zA-Z0-9]+)$/,
          embedUrl: 'https://example.com/embed/${1}',
          queryParams: {
            gui: true,
            t: 10,
            paused: true,
            muted: false,
          },
          iframeAttributes: {
            loading: 'lazy',
            allow: 'fullscreen',
          },
        },
      ],
    },
    expected:
      '<figure><div><iframe src="https://example.com/embed/exampleID?gui=true&#x26;t=10&#x26;paused=true&#x26;muted=false" loading="lazy" allow="fullscreen"></iframe></div></figure>',
  },
  {
    name: 'Single Site with Caption',
    input: '[](https://example.com/watch?v=exampleID "A title")',
    options: {
      sources: [
        {
          contentUrl: /^https:\/\/example\.com\/watch\?v=([a-zA-Z0-9_-]+)$/,
          embedUrl: 'https://example.com/embed/${1}',
        },
      ],
    },
    expected:
      '<figure><div><figure><iframe src="https://example.com/embed/exampleID"></iframe><figcaption>A title</figcaption></figure></div></figure>',
  },
  {
    name: 'Single Site without Caption',
    input: '[](https://example.com/watch?v=exampleID)',
    options: {
      sources: [
        {
          contentUrl: /^https:\/\/example\.com\/watch\?v=([a-zA-Z0-9_-]+)$/,
          embedUrl: 'https://example.com/embed/${1}',
        },
      ],
    },
    expected:
      '<figure><div><iframe src="https://example.com/embed/exampleID"></iframe></div></figure>',
  },
  {
    name: 'Multiple Sites with Captions',
    input:
      '[](https://example.com/watch?v=exampleID "Title 1")[](https://example.com/calculator/exampleID "Title 2")',
    options: {
      sources: [
        {
          contentUrl: /^https:\/\/example\.com\/watch\?v=([a-zA-Z0-9_-]+)$/,
          embedUrl: 'https://example.com/embed/${1}',
        },
        {
          contentUrl: /^https:\/\/example.com\/calculator\/([a-zA-Z0-9]+)\/?/,
          queryParams: {
            embed: '',
          },
        },
      ],
    },
    expected:
      '<figure><div><figure><iframe src="https://example.com/embed/exampleID"></iframe><figcaption>Title 1</figcaption></figure><figure><iframe src="https://example.com/calculator/exampleID?embed="></iframe><figcaption>Title 2</figcaption></figure></div></figure>',
  },
  {
    name: 'Multiple Sites without Captions',
    input:
      '[](https://example.com/watch?v=exampleID)[](https://example.com/calculator/exampleID)',
    options: {
      sources: [
        {
          contentUrl: /^https:\/\/example\.com\/watch\?v=([a-zA-Z0-9_-]+)$/,
          embedUrl: 'https://example.com/embed/${1}',
        },
        {
          contentUrl: /^https:\/\/example.com\/calculator\/([a-zA-Z0-9]+)\/?/,
          queryParams: {
            embed: '',
          },
        },
      ],
    },
    expected:
      '<figure><div><iframe src="https://example.com/embed/exampleID"></iframe><iframe src="https://example.com/calculator/exampleID?embed="></iframe></div></figure>',
  },
  {
    name: 'Multiple Sites with Shared Caption',
    input:
      '[](https://example.com/watch?v=exampleID "This becomes the caption")[](https://example.com/calculator/exampleID)',
    options: {
      sources: [
        {
          contentUrl: /^https:\/\/example\.com\/watch\?v=([a-zA-Z0-9_-]+)$/,
          embedUrl: 'https://example.com/embed/${1}',
        },
        {
          contentUrl: /^https:\/\/example.com\/calculator\/([a-zA-Z0-9]+)\/?/,
          queryParams: {
            embed: '',
          },
        },
      ],
    },
    expected:
      '<figure><div><iframe src="https://example.com/embed/exampleID"></iframe><iframe src="https://example.com/calculator/exampleID?embed="></iframe></div><figcaption>This becomes the caption</figcaption></figure>',
  },
  {
    name: 'className',
    input: '[](https://example.com/watch?v=exampleID)',
    options: {
      className: 'embed',
      sources: [
        {
          contentUrl: /^https:\/\/example\.com\/watch\?v=([a-zA-Z0-9_-]+)$/,
          embedUrl: 'https://example.com/embed/${1}',
        },
      ],
    },
    expected:
      '<figure class="embed"><div><iframe src="https://example.com/embed/exampleID"></iframe></div></figure>',
  },
]
