---
layout: post
title: "Gatsby Images"
categories: [JavaScript]
icon-photo: gatsby.png
---

{% assign img-url = '/img/post/js/gatsby' %}

{% include toc.html %}

{% notcomplete %}

{% updfreq %}

Because the post [Gatsby 101](/gatsby-js) is too long, I write a separate post just for images in Gatsby.

## Type of images to be processed

Read [this post](Ways to Organize and Prepare Images for a Blur-Up Effect Using Gatsby) from CSS-Tricks to know which images should be processed, which ones should not.

- **No processing required**: "static images", icons and logos, favicons 👉 We can `import` and use `<img>` to directly import them.
- **Process required**: PNG, JPG files, gallery, ...

## Single photo

Install stuffs following [this doc](https://www.gatsbyjs.org/docs/gatsby-image/),

~~~ bash
npm install --save gatsby-image gatsby-plugin-sharp gatsby-transformer-sharp
~~~

### Insert directly,

~~~ jsx
import avatar from "src/images/site/avatar.jpg"
function Header() {
  return <img src={logo} alt="Logo" />
}
export default Header
~~~

### Using data/query

So that we can have the lazing loading / resizing / blur-up (traced placeholder) effects.

~~~ bash
npm install --save gatsby-image gatsby-transformer-sharp gatsby-plugin-sharp
~~~

Below technique is just for single photos.

~~~ js
// gatsby-config.js
module.exports = {
  plugins: [
    ...
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: path.join(__dirname, `src`, `images`),
      },
    },
  ],
}
~~~

~~~ jsx
// src/components/Header.js
import { StaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image';

const Header = ({ data }) => (
  <header>
    <Img fluid={data.myAvatar.childImageSharp.fluid} />  
  </header>
)

// src/images/avatar.png
export default props => (
  <StaticQuery
    query={graphql`
      query {
        myAvatar: file(relativePath: { eq: "avatar.png" }) {
          childImageSharp {
            fluid(maxWidth: 150) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    `}
    render={data => <Header data={data} {...props} />}
  />
)
~~~

👉 Most of tutorials like [this](https://alligator.io/gatsbyjs/images-in-gatsby/) or [this](https://codebushi.com/using-gatsby-image/) don't talk about [`StaticQuery`](https://www.gatsbyjs.org/docs/static-query/) (Gatsby v2). I followed them but it didn't work, we have to use `StaticQuery` to make things work! 👉 The reason is that the (old) page query can only be added to page components (in my try, I add in `Header.js` component). `StaticQuery` can be used as a replacement of page query, it can be added to any component.{% ref https://www.gatsbyjs.org/docs/static-query/#how-staticquery-differs-from-page-query %}

👉 There are 2 types: 

- `fixed`: has a set width and height and is for supporting *different screen resolutions*.
- `fluid`: has a max-width and sometimes a max-height, and will create multiple images for supporting *different screen sizes*. 

You need to use them with fragments like `GatsbyImageSharpFixed_tracedSVG` or `GatsbyImageSharpFluid` ([more](https://www.gatsbyjs.org/packages/gatsby-image/?=#fragments)).

### SVG files

`gatsby-plugin-sharp` / `gatsby-image` doesn't handle SVGs or GIFs. If you want to use your svg you, e.g. could import / use it like `import yourSVG from './logo_large.svg'`.{% ref https://github.com/gatsbyjs/gatsby/issues/10297 %}

## Change favicon

Put `favicon.png` in `src/images` and then change `gatsby-config.js`

~~~ js
{
  resolve: `gatsby-plugin-manifest`,
  options: {
    // other stuffs
    icon: `src/images/favicon.png`,
  },
},
~~~

You need to restart `gastby` to see the result!

## Multiple images from data file/folder

- [https://www.gatsbyjs.org/packages/gatsby-transformer-sharp/](https://www.gatsbyjs.org/packages/gatsby-transformer-sharp/)
- [https://www.gatsbyjs.org/tutorial/part-five/#build-a-page-with-a-graphql-query](https://www.gatsbyjs.org/tutorial/part-five/#build-a-page-with-a-graphql-query)
- [https://itnext.io/reading-data-from-a-json-file-with-gatsby-graphql-572b18ab98a](https://itnext.io/reading-data-from-a-json-file-with-gatsby-graphql-572b18ab98a)
- [https://www.orangejellyfish.com/blog/a-comprehensive-guide-to-images-in-gatsby/](https://www.orangejellyfish.com/blog/a-comprehensive-guide-to-images-in-gatsby/)
- [https://www.sitepoint.com/automatically-optimize-responsive-images-in-gatsby/?utm_source=rss](https://www.sitepoint.com/automatically-optimize-responsive-images-in-gatsby/?utm_source=rss)

### Images' URLs stored in a JSON file

Suppose that we store some images in `/src/images/` and we indicate them in a json file like this,

~~~ json
// File /data/AccountItem.json
[
  {
    "name": "Github",
    "icon": "./github.svg",
  },
  {
    "name": "LinkedIn",
    "icon": "./linkedin.svg",
  },
  {
    "name": "Math2IT",
    "icon": "./math2it.png",
  }
]
~~~

Images (`github.svg`, `linkedin.svg`, `math2it.png`) are stored in the same folder of your json file, that why we put `./` before them!

❓ There are both `png` and `svg` files in the list. We cannot use `childImageSharp` for svg files. How can we "loop" through each item and consider differently svg and png files?

💡 Read [this tutorial](https://itnext.io/reading-data-from-a-json-file-with-gatsby-graphql-572b18ab98a) to read data from a json file.

1/ Having a json file, in this example, it's `/data/AccountItem.json` (you can name it whatwever you want but its name is really important for using later!!!)

2/ Install

~~~ bash
npm install gatsby-transformer-json gatsby-source-filesystem --save
~~~

3/ Inside `/gatsby-config.js`, add following (direction in `path` is the direction to the folder containing your json file),

~~~ js
`gatsby-transformer-json`,
{
  resolve: 'gatsby-source-filesystem',
  options: {
    name: 'data',
    path: `${__dirname}/data/`,
  },
}
~~~

4/ Suppose that we wanna load images in a component `/src/components/ListAccount.js`. Put in it,{% ref https://github.com/gatsbyjs/gatsby/issues/10297#issuecomment-464834529 %}

~~~ jsx 
import { StaticQuery, graphql } from 'gatsby';
import Img from 'gatsby-image'

const ListAccount = ( {accounts} ) => (
  <div>
    {accounts.map(account => (
      <div className="item">
        <div className="img">
          {!account.node.icon.childImageSharp 
            && (account.node.icon.extension === 'svg')
            && <img src={account.node.icon.publicURL} />
            }
          {account.node.icon.extension !== 'svg'
            && <Img fixed={account.node.icon.childImageSharp.fixed} />
            }
        </div>
      </div>
    ))}
  </div>
)

export default props => (
  <StaticQuery
    query={graphql`
      query AccountItemsQuery {
        allAccountItemsJson{
          edges{
            node{
              name
              icon{
                childImageSharp {
                  fixed(width: 150, height: 150) {
                    ...GatsbyImageSharpFixed_tracedSVG
                  }
                }
                extension
                publicURL
              }
            }
          }
        }
      }
    `}
    render={data => <ListAccount accounts={data.allAccountItemsJson.edges} {...props} />}
  />
)
~~~

Explaination:

- We have to put `extension` and `publicURL` inside `icon` because there are `svg` files!
- For more intuition, look at [http://localhost:8000/\_\_\_graphql](http://localhost:8000/___graphql).
- In `edges`, there are many `node`s, each of them is relating to the item inside `AccountItem.json`. That's why the input data for `<ListAccount />` must be `data.allAccountItemsJson.edges`.
- For each `account` in `accounts`, we have to pass `account.node` before each attribute `name`, `icon`.
- `{condition && condition && output}` is a trick for not using `if...else`.

👉 In the case you store images in a different folder, let's say `/src/images/accounts/`, you have to indicate it in `/data/AccountItems.json`:

~~~ json
[
  {
    "icon": "../src/images/accounts/github.svg",
  }
]
~~~
 
### Using YAML data file

Suppose our `yaml` file,

~~~ yaml
// File /data/AccountItem.yaml

- name: Github
  icon: ./github.svg
- name: LinkedIn
  icon: ./linkedin.svg
- name: Math2IT
  icon: ./math2it.png
~~~

The same technique as in the case of `json` file. In this case, we need to install [`gatsby-transformer-yaml`](https://www.gatsbyjs.org/packages/gatsby-transformer-yaml/),

~~~ bash
npm install --save gatsby-transformer-yaml
~~~

In your `gatsby-config.js`,

~~~ js
`gatsby-transformer-yaml`,
{
  resolve: `gatsby-source-filesystem`,
  options: {
    name: 'data',
    path: `${__dirname}/data/`,
  },
},
~~~

