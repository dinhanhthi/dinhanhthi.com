---
layout: post
title: "Domain & DNS"
tags: [Web Dev]
notfull: 1
toc: true
icon: css.svg
keywords: "github pages projects dns domain subdomain baseurl url http netlify cloudflare namecheap godaddy CNAME TXT A alias pointing forward"
---

## DNS & Github Pages

🔅 Point `tool.dinhanhthi.com` to `dinhanhthi.github.io/tools`

- On Github repository's setting (`github.com/dinhanhthi/tools/settings`), in the **Custom domain** section: `tool.dinhanhthi.com`.
- On DNS manager: create a `CNAME` record pointing from `tool` (Name section) to `dinhanhthi.github.io` (Content section).

💡 For other github projects pages (e.g. others than `/tools`), you do the same things.

## DNS & Netlify sites

- On Netlify site, go to **Domain Settings**, in **Custom domains**, click on **Add domain alias**, fill in your custom domain and **Save** (Ignore the warnings).
- In DNS setting:
  - From `sub.domain.com` to `app-name.netlify.com`: create a `CNAME` record with `sub` as **Name** and `app-name.netlify.com` as **Content**.
  - From `domain.com` to `app-name.netlify.com`:
    - Create a `A` record with `domain.com` as **Name** and `104.198.14.52` as **Content**.
    - Create a `CNAME` record with `www` as **Name** and `app-name.netlify.com` as **Content**.

## DNS settings

🔅 Forward all sites in `note.dinhanhthi.com` to `dinhanhthi.com`: create a `CNAME` record with `note` as **Name** and `dinhanhthi.com` as **Content**.

