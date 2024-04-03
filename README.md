# dinhanhthi.com

Next.js 14+ 🤝 Tailwind CSS 🤝 Notion as CMS 🤝 [notion-x](https://github.com/dinhanhthi/notion-x).

🎉 You can read [this post](https://dinhanhthi.com/note/how-i-create-this-site/) to understand the ideas behind and create your own a site like mine.

🧡 If what I do is helpful to you for some reason, please consider [supporting me](https://dinhanhthi.com/support-me/). Thank you!

> 🪖 If you prefer not to spend time on reading, I can duplicate my site for you at a **cost of $40**. We can discuss this over a call if you prefer. Please note that this is **a one-time service** and does not include ongoing maintenance. If you're interested, please [email me](me@dinhanhthi.com).

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

## Update something new (for me only)

- Modify directly notion-x's components inside this repo.
- Overwrite modified files from this repo to notion-x's repo.
- Push changes from notion-x.
- On dat, make a script and run `ud_submodules`

  ```bash
  # Make sure notion-x and this repo are cloned to the same parent folder.
  alias checkout_notion-x="cd notion-x && git checkout * && cd -"
  alias ud_submodules='checkout_notion-x && git submodule update --recursive --remote'
  ```

- If there are changes from notion-x, cannot merge branch from `main` to `dev` or vice verso. We have to force reset one branch to the other!

## Vercel

[Enable corepack](https://vercel.com/docs/deployments/configure-a-build#corepack) to use yarn newest version.
