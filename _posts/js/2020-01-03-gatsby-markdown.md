---
layout: post
title: "Gatsby : Work with markdown"
categories: [JavaScript]
icon-photo: gatsby.png
---

## Create page template and markdown file

Suppose that you wanna create a page `/about` taking content from file `/content/pages/about.md` and it applies template `/src/templates/page.js`. All you need to do is following [this post](https://www.gatsbyjs.org/docs/adding-markdown-pages/).

1. First, add to `/gatsby-config`.
2. Create `/src/templates/page.js`,
2. Create markdown file `/content/pages/about.md`.
3. Modify `/gatsby-node.js` to tell gatsby to create a page `/about` from `about.md` using template `page.js`.
