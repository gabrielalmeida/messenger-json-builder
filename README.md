# messenger-json-builder [![Build Status](https://travis-ci.org/gabrielalmeida/messenger-json-builder.svg?branch=master)](https://travis-ci.org/gabrielalmeida/messenger-json-builder)

> Helper utility to create Facebook Messenger JSON based on Templates.

## Install 

```bash
npm install messenger-json-builder
```

## Usage 

```js
  import M from "messenger-json-builder";

  const coverImage = M.getImage(`${content.cover}`);

  const details = M.createElement([
    M.button({
      type: "web_url",
      url: `${PLAY_URL}/movies/${content.id}`,
      title: "See on Play!"
    }),
    M.button({
      type: "show_block",
      block_names: ["NewSearch"],
      title: "New Search"
    }),
    M.button({
      type: "show_block",
      block_names: ["EndSuccess"],
      title: "Thanks! See you!"
    })
  ]);

  const sinopsysText = M.getText(sinopsys);
  const detailsButtons = M.getButtons([sinopsysText, details]);
  return M.send([coverImage, detailsButtons]);
```

## API

```ts
TODO
```

## License

MIT © [Gabriel Almeida](https://gabrielalmeida.me)
