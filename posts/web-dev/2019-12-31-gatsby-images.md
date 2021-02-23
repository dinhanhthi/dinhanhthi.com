---
layout: post
title: "Gatsby Images"
tags: [Web Dev, GatsbyJS, Static Site Generators]
toc: true
icon: gatsby.png
keywords: create a website static web react js inserting images
---

{% assign img-url = '/img/post/js/gatsby' %}

Because the post [Gatsby 101](  /gatsby-js/) is too long, I write a separate post just for images in Gatsby.

::: warning
After trying Gatsby, I found that [11ty](/11ty-nunjucks/) is more flexible (and easier).
:::

## Rule of thumb

- Static images (icon, logo, favicon): just `import` and use `img`.
- `svg` cannot be used with `childImageSharp`, just use `<img>` with its `publicURL`.
- `png`, `jpg` can be used with `<Img>` and `childImageSharp`.
- Data can be used: `json` or `yaml`, cannot use `js` for images.
- List of images are get up to `edges`. After `edges`, there are a loop of `node`s.
- `query` components must placed in `<StaticQuery />`.
- Different screen solution: use `fixed`.
- Different screen size: use `fluid`.
- Use [http://localhost:8000/\_\_\_graphql](http://localhost:8000/___graphql) to check the `query`.
- Use `{condition && condition && output}` instead of using `if..else...`
- The relative path of images is compared with the path of data file where the urls are indicated.

## Type of images to be processed

Read [this post](https://css-tricks.com/ways-to-organize-and-prepare-images-for-a-blur-up-effect-using-gatsby/) from CSS-Tricks to know which images should be processed, which ones should not.

{:.indent}
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

👉 Most of tutorials like [this](https://alligator.io/gatsbyjs/images-in-gatsby/) or [this](https://codebushi.com/using-gatsby-image/) don't talk about [`StaticQuery`](https://www.gatsbyjs.org/docs/static-query/) (Gatsby v2). I followed them but it didn't work, we have to use `StaticQuery` to make things work! 👉 The reason is that the (old) page query can only be added to page components (in my try, I add in `Header.js` component). `StaticQuery` can be used as a replacement of page query, it can be added to any component.{% ref "https://www.gatsbyjs.org/docs/static-query/#how-staticquery-differs-from-page-query" %}

👉 There are 2 types:

{:.indent}
- `fixed`: has a set width and height and is for supporting *different screen resolutions*. It accepts `width` and `height`.
- `fluid`: has a max-width and sometimes a max-height, and will create multiple images for supporting *different screen sizes*.  It accepts `maxWidth` and `maxHeight`.

You need to use them with fragments like `GatsbyImageSharpFixed_tracedSVG` or `GatsbyImageSharpFluid` ([more](https://www.gatsbyjs.org/packages/gatsby-image/?=#fragments)).

### Using absolute path

If you want to query to an image in `/src/images/example.png`, you can use,

~~~ js
export const query = graphql`
  query {
    file(absolutePath: {
      regex: "/\\/src\\/images\\/example\\.png/"
    }) {
      childImageSharp {
        fixed(width: 800) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`
~~~

### SVG files

`gatsby-plugin-sharp` / `gatsby-image` doesn't handle SVGs or GIFs. If you want to use your svg you, e.g. could import / use it like `import yourSVG from './logo_large.svg'`.{% ref "https://github.com/gatsbyjs/gatsby/issues/10297" %}

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

1. Having a json file, in this example, it's `/data/AccountItem.json` (you can name it whatwever you want but its name is really important for using later!!!)
2. Install

    ~~~ bash
    npm install gatsby-transformer-json gatsby-source-filesystem --save
    ~~~
3. Inside `/gatsby-config.js`, add following (direction in `path` is the direction to the folder containing your json file),

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
4. Suppose that we wanna load images in a component `/src/components/ListAccount.js`. Put in it,{% ref "https://github.com/gatsbyjs/gatsby/issues/10297#issuecomment-464834529" %}

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
    //
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

{:.indent}
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

## `query` as an input

In the previous step, `query` is considered inside the component file. What if you wanna query data and then pass it in a JSX components? (check `index.js` for an example)

There is a data file `/data/MostProudOfItems.yaml`.

~~~ jsx
// in /src/pages/index.js

import ShortcutListing from "../components/ShortcutListing"

const indexPage = (props) => (
  <ShortcutListing
    shortcuts={props.data.allMostProudOfItemsYaml.edges}
    nShortcutsPerRow='3' />
)

export default IndexPage

export const pageQuery = graphql`
  query IndexQuery {
    allMostProudOfItemsYaml{
      edges {
        node {
          title
          img {
            childImageSharp {
              fixed(width: 100, height: 100) {
                ...GatsbyImageSharpFixed_tracedSVG
              }
            }
            extension
            publicURL
          }
          url
        }
      }
    },
    anotherYaml{
      ....
    }
  }
`
~~~

~~~ jsx
// in /src/components/ShortcutListing

const ListShortcut = ({shortcuts, nShortcutsPerRow}) => (
  // ...
)

export default ListShortcut
~~~

## Get all images from a specific folder

👉 This is also a way you use the `name` indicate in `gatsby-config.js`.

Suppose that you wanna show all images in `/sketches/`.{% ref "https://stackoverflow.com/questions/57515558/how-should-i-import-all-the-images-under-a-folder-in-gatsby" %}

<div class="col-2-equal">

~~~ js
// In /gatsby-config.js
{
  resolve: "gatsby-source-filesystem",
  options: {
    path: `${__dirname}/sketches/`,
    name: "sketchFolder",
  },
},
~~~

~~~ js
export const pageQuery = graphql`
  query IndexQuery {
    allFile(filter: {
      extension: {regex: "/(jpg)|(jpeg)|(png)/"},
      sourceInstanceName: {eq: "sketchFolder"}})
    {
      edges {
        node {
          childImageSharp {
            fluid {
              originalName
            }
          }
          absolutePath
        }
      }
    }
  }
`
~~~
</div>

💢 Above method is **only works** with `/sketches` (folder locates at the root of site). It doesn't work with `/src/images/sketches`, for example. I don't know why!

👉 If you want to get all images from a folder (without using `sourceInstanceName`) you can use `relativeDirectory` in the `query`. Suppose that we have 2 folders with the same name `sketches`, one is in `/content/sketches`, one is in `/src/images/sketches`. The following code will **load all images in these two folders**!

<div class="col-2-equal">

~~~ js
// In /gatsby-config.js
{
  resolve: "gatsby-source-filesystem",
  options: {
    path: `${__dirname}/content/`,
    name: "content",
  },
},
{
  resolve: "gatsby-source-filesystem",
  options: {
    path: `${__dirname}/src/images`,
    name: "images",
  },
},
~~~

~~~ js
export const pageQuery = graphql`
  query IndexQuery {
    allFile(filter: {
      extension: {regex: "/(jpg)|(jpeg)|(png)/"},
      relativeDirectory: {eq: "sketches"}})
    {
      edges {
        node {
          childImageSharp {
            fluid {
              originalName
            }
          }
          absolutePath
        }
      }
    }
  }
`
~~~
</div>

💢 Make sure the name of your folder is **unique** if you don't want to load images from a wrong location.

## References

- [A comprehensive guide to images in Gatsby](https://www.orangejellyfish.com/blog/a-comprehensive-guide-to-images-in-gatsby/) by James Allardice.
- [Image Processing with `gatsby-transformer-sharp`](https://image-processing.gatsbyjs.org/).
- [Building A Custom, Accessible Image Lightbox In GatsbyJS](https://416serg.me/building-a-custom-accessible-image-lightbox-in-gatsbyjs/)