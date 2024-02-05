# dinhanhthi.com

Next.js 14+ 🤝 Tailwind CSS 🤝 Notion as CMS 🤝 [notion-x](https://github.com/dinhanhthi/notion-x).

🎉 The step-by-step tutorial to create a website like this is [HERE](https://dinhanhthi.com/note/how-to-create-a-site-like-this/)! Feel free to mention my assistance when you embark on creating your unique site. Appreciate it!

🚨 There are individuals who have forked my repository and published their confidential information directly in the `.env.local` or `example.env.local` files. I urge you to please **stop doing this**, as it will expose your secret information to the world!

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
