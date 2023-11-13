# dinhanhthi.com

Next.js 14+ 🤝 Tailwind CSS 🤝 Notion as CMS 🤝 [notion-x](https://github.com/dinhanhthi/notion-x).

> 🚨 The source code on this page is for reference only. You cannot clone and use it to create an exact replica of my website. It lacks the Notion databases that power my site, and I don't have time to make it publicly available. **Please don't email me for a clone** (Instead, you can [read this post](https://dinhanhthi.com/note/how-i-create-this-site/) to understand the ideas and tips behind the way I created this site so that you can make one for you). I'm working on writing a guide as soon as possible. Thanks for your understanding.

## Previous versions

👉 Version 1 (Jekyll): [v1.dinhanhthi.com](https://v1.dinhanhthi.com) -- [source](https://github.com/dinhanhthi/dinhanhthi.com-v1).<br />
👉 Version 2 (Jekyll): [v2.dinhanhthi.com](https://v2.dinhanhthi.com) -- [source](https://github.com/dinhanhthi/dinhanhthi.com-v2).<br />
👉 Version 3 (Jekyll): [v3.dinhanhthi.com](https://v3.dinhanhthi.com) -- [source](https://github.com/dinhanhthi/dinhanhthi.com-v3).<br />
👉 Version 4 (Gatsby, canceled at 60%): [demo of what I did](https://v4.dinhanhthi.com) -- [source](https://github.com/dinhanhthi/dinhanhthi.com-v4-gatsby).<br />
👉 Version 5 (11ty): [v5.dinhanhthi.com](https://v5.dinhanhthi.com) -- [source](https://github.com/dinhanhthi/dinhanhthi.com-v5).

## Dev

🚨 You have to install **globally** [Nodejs >=18](https://nodejs.org/en) (recommend using [nvm](https://github.com/nvm-sh/nvm)) and [Yarn](https://yarnpkg.com/) first.

```bash
# install
yarn

# clone submodule notion-x (when installing only)
git submodule update --init --recursive

# ud notion-x
git submodule update --recursive --remote
# or yarn getlib

# dev
yarn dev # port 3003

# build
yarn build

# serve (need to build first)
yarn start # port 3003

# reinstall all
yarn reinstall

# clean
yarn clean

# prettier
yarn prettier

# clear yarn cache (helpful sometimes)
yarn cache clean
```

Deploy to vercel,

```bash
vercel dev # like yarn dev

vercel build

# preview only
vercel deploy

# production
vercel --prod
```