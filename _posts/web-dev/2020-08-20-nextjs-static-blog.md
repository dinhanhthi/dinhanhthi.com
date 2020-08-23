---
layout: post
title: "Make a static blog with NextJS"
categories: [web development]
tags: [installation, jabvascript, nextjs, static site]
icon-photo: "nextjs.png"
notfull: 1
keywords: "nodejs node npm plugin strapi headless cms nextjs vercel open source"
---

{% include toc.html %}

👉 [Github repository](https://github.com/dinhanhthi/nextjs-blog).

## Install NodeJS

{:.noindent}
- Install [node & npm](https://www.npmjs.com/get-npm).
- Check version: `node -v`, `npm -v`.

## Folder structure

``` bash
# Folder structure
# ----------------------------------
.
├── api                 # functional
│   └── index.js
├── config.yml
├── _includes           # site's components
│   ├── footer.js
│   └── header.js
├── jsconfig.json
├── _layouts            # site's layouts
│   ├── default.js
│   └── post.js         # general template for posts
├── next.config.js
├── package.json
├── package-lock.json
├── pages
│   ├── index.js
│   └── posts           # posts will be available on the route /posts/
|       └── [slug].js   # dynamic page to build posts
├── _posts              # posts in .md files
│   └── first-post.md
└── public              # static file serving for assets
    └── images          # images
```

## Init + Setting up

``` bash
# Initialization + setting up
# ----------------------------------
mkdir nextjs-blog && cd $_
npm init -y
npm install next react react-dom --save
```

``` bash
# package.json
# ----------------------------------
{
    "name": "nextjs-blog",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "dev": "next",          # npm run dev
        "build": "next build",  # npm run build
        "start": "next start"   # npm run start
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "dependencies": {               # npm install (based packages)
        "next": "^9.5.2",
        "react": "^16.13.1",
        "react-dom": "^16.13.1"
    },
    "devDependencies": {            # installed with `npm install`, unless with --production
        "gray-matter": "^4.0.2",    # parse the front matter defined at the beginning of the post
        "js-yaml": "^3.14.0",       # re-use the Jekyll config for our Next.js blog
        "marked": "^1.1.1",         # markdown parser
        "raw-loader": "^4.0.1"      # convert .md, .yml to raw text
    }
}
```

- Static generation of all pages inside the `/pages/**` directory.
- Static file serving for assets living in the `/public/**` directory.

## API

``` bash
# api/index.js
# ----------------------------------
import matter from 'gray-matter'
import marked from 'marked'
import yaml from 'js-yaml'

# read all the Markdown files in the _posts directory
export async function getAllPosts() {
    const context = require.context('../_posts', false, /\.md$/)
    const posts = []
    for (const key of context.keys()) {
        const post = key.slice(2);
        const content = await import(`../_posts/${post}`);
        const meta = matter(content.default)
        posts.push({
            slug: post.replace('.md', ''),
            title: meta.data.title
        })
    }
    return posts;
}

# locate + parser a post in _posts and return html output
export async function getPostBySlug(slug) {
    const fileContent = await import(`../_posts/${slug}.md`)
    const meta = matter(fileContent.default)
    const content = marked(meta.content)
    return {
        title: meta.data.title,
        content: content
    }
}

export async function getConfig() {
    const config = await import(`../config.yml`)
    return yaml.safeLoad(config.default)
}
```

## index

``` bash
# pages/index.js
# ----------------------------------
import DefaultLayout from '@layouts/default'
import Link from 'next/link'
import { getConfig, getAllPosts } from '@api'

export default function Blog(props) {
    return (
        <DefaultLayout title={props.title} description={props.description}>
            <p>List of posts:</p>
            <ul>
                {props.posts.map(function (post, idx) {
                    return (
                        <li key={idx}>
                            <Link href={'/posts/' + post.slug}>
                                <a>{post.title}</a>
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </DefaultLayout>
    )
}


export async function getStaticProps() {
    const config = await getConfig()
    const allPosts = await getAllPosts()
    return {
        props: {
            posts: allPosts,
            title: config.title,
            description: config.description
        }
    }
}
```

## NextJS config

``` bash
# next.config.js
# tell nextjs to use raw-loader when we import .md and .yml file
# --------------------------------------------------------------
module.exports = {
    target: 'serverless',
    webpack: function (config) {
        config.module.rules.push({ test: /\.md$/, use: 'raw-loader' })
        config.module.rules.push({ test: /\.yml$/, use: 'raw-loader' })
        return config
    }
}
```

``` bash
# jsconfig.json
# make alias
# ----------------------------------
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@includes/*": ["_includes/*"],
      "@layouts/*": ["_layouts/*"],
      "@posts/*": ["_posts/*"],
      "@api": ["api/index"],
    }
  }
}
```

## Jekyll's config yml

``` bash
# re-use jekyll config
# config.yml
# ----------------------------------
title: "Next.js blog"
description: "This blog is powered by Next.js"
```

## Site components

``` bash
# _includes/header.js
# ----------------------------------
export default function Header() {
  return <header><p>Blog | Powered by Next.js</p></header>
}
```

``` bash
# _includes/footer.js
# ----------------------------------
export default function Footer() {
  return <footer><p>©2020 | Footer</p></footer>
}
```

## Layouts

``` bash
# _layouts/default.js
# ----------------------------------
import Head from 'next/head'
import Header from '@includes/header'
import Footer from '@includes/footer'

export default function DefaultLayout(props) {
    return (
        <main>
            <Head>
                <title>{props.title}</title>
                <meta name='description' content={props.description} />
            </Head>
            <Header />
            {props.children}
            <Footer />
        </main>
    )
}
```

``` bash
# _layouts/post.js
# ----------------------------------
import DefaultLayout from '@layouts/default'
import Head from 'next/head'
import Link from 'next/link'

export default function PostLayout(props) {
    return (
        <DefaultLayout>
            <Head>
                <title>{props.title}</title>
            </Head>
            <article>
                <h1>{props.title}</h1>
                <div dangerouslySetInnerHTML={{ __html: props.content }} />
                <div><Link href='/'><a>Home</a></Link></div>
            </article>
        </DefaultLayout>
    )
}
```

## Single post generator

``` bash
# pages/posts/[slug].js
# for a single post
# ----------------------------------
import PostLayout from '@layouts/post'
import { getPostBySlug, getAllPosts } from "@api"

export default function Post(props) {
    return <PostLayout title={props.title} content={props.content} />
}

export async function getStaticProps(context) {
    return {
        props: await getPostBySlug(context.params.slug)
    }
}

export async function getStaticPaths() {
    let paths = await getAllPosts()
    paths = paths.map(post => ({
        params: { slug: post.slug }
    }));
    return {
        paths: paths,
        fallback: false
    }
}
```

## Insert images

``` bash
# images stored in /public/images/404.png
# in .md file
![404](/images/404.png)
```

## References

- (main) css-tricks -- [Building a blog with next js](https://css-tricks.com/building-a-blog-with-next-js).
- dev.to -- [How to make a static blog with nextjs](https://dev.to/joserfelix/how-to-make-a-static-blog-with-next-js-2bd6)

### Plugins

- [next-optimized-images](https://github.com/cyrilwanner/next-optimized-images)