---
layout: post
title: "Wordpress 101"
categories: [web development]
tags: ['wordpress', fundamental]
icon-photo: "wordpress.svg"
keywords: "localhost template theme theme directory url website name description template author info post info"
---

{% assign img-url = '/img/post/web-dev/wordpress' %}

{% include toc.html %}

In this note, wp theme's components are supposed to be placed in folder `wp-thi`.

## Tools

- **FTP**: [WinSCP](WinSCP) (Windows) or [FileZilla](https://filezilla-project.org/download.php?platform=linux) or [Transmit]([Transmit](https://panic.com/transmit/)) (MacOS).


## General

- Theme is placed at `./wp-content/themes/`
- WP needs at least 2 files to exist: `style.css` and `index.php`.
- Admin page `wpsite.com/wp-admin`.

## WP theme components

Theme's

~~~ php
echo get_bloginfo('template_directory'); // theme directory
~~~

Website's

~~~ php
get_bloginfo( 'wpurl' ) // url
get_bloginfo( 'name' ) // name
get_bloginfo( 'description' ) // description
~~~

Post's

~~~ php
the_content() // content
the_title() // title
the_date() // date
the_author() // author
~~~

Author's

~~~ php
the_author_meta( 'description' ); // description
~~~