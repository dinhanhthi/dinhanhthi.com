# dinhanhthi.com

Next.js 15+ 🤝 Tailwind CSS v4 🤝 Notion as CMS 🤝 Custom Notion Renderer.

🎉 You can read [this post](https://dinhanhthi.com/note/how-i-create-this-site/) to understand the ideas behind and create your own a site like mine.

🧡 If what I do is helpful to you for some reason, please consider [supporting me](https://dinhanhthi.com/support-me/). Thank you!

## Previous versions

👉 Version 1 (Jekyll): [v1.dinhanhthi.com](https://v1.dinhanhthi.com) -- [source](https://github.com/dinhanhthi/dinhanhthi.com-v1).<br />
👉 Version 2 (Jekyll): [v2.dinhanhthi.com](https://v2.dinhanhthi.com) -- [source](https://github.com/dinhanhthi/dinhanhthi.com-v2).<br />
👉 Version 3 (Jekyll): [v3.dinhanhthi.com](https://v3.dinhanhthi.com) -- [source](https://github.com/dinhanhthi/dinhanhthi.com-v3).<br />
👉 Version 4 (Gatsby, canceled at 60%): [demo of what I did](https://v4.dinhanhthi.com) -- [source](https://github.com/dinhanhthi/dinhanhthi.com-v4-gatsby).<br />
👉 Version 5 (11ty): [v5.dinhanhthi.com](https://v5.dinhanhthi.com) -- [source](https://github.com/dinhanhthi/dinhanhthi.com-v5).<br />
👉 Version 6 (use separated [notion-x](https://github.com/dinhanhthi/notion-x) repo): [source](https://github.com/dinhanhthi/dinhanhthi.com/tree/v6).

## Dev

🚨 You have to install **globally** [Nodejs >=20](https://nodejs.org/en) (recommend using [nvm](https://github.com/nvm-sh/nvm)) first.

```bash
# install
npm install

# dev
npm run dev # port 3004

# build
npm run build

# serve (need to build first)
npm start # port 3004

# reinstall all
npm run reinstall

# clean
npm run clean

# prettier
npm run prettier

# clear npm cache (helpful sometimes)
npm cache clean --force
```

Deploy to vercel,

```bash
vercel dev # like npm run dev

vercel build

vercel build --prod

# preview only
vercel deploy

# production
vercel --prod
```

## Vercel

The project uses npm with `--legacy-peer-deps` flag (configured in `.npmrc`) for React 19 compatibility. No special configuration needed on Vercel - it will use npm by default.

## Troubleshooting

- Problem with search? Check and update `NOTION_TOKEN_V2`. Don't forget to re-deploy on Vercel.
