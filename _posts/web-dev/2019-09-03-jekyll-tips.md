---
layout: post
title: "Jekyll"
categories: [web development]
tags: ['static site', extra, jekyll]
math: 1
icon-photo: "jekyll.png"
date: 2019-10-24
sitemap: false
keywords: "lunrjs search js javascript content keywords jekyll markdown span markdown=\"1\" enlarge photo click to zoom in bigger photo bootstrap 4 run build jekyll site with draft posts --draft -I render the changes kramdown create plugin ruby hide show box nested block crossed using variables _plugins .rb badge liquid customizable liquid tags include proud of custom plugins custom domain rouge css syntax highlight pygment compress html jemoji emoji kramdown quick reference parse block html faster build jekyll-feed feed javascript benchmark liquid-c --profile profile jekyll-include-cache include cache jekyll clean cache clear list of posts alpha beta order ABC order sort posts category by name localhost list of tags list of categories github pages gems"
---

{% assign img-url = '/img/post/web-dev' %}

{% include toc.html %}

This note is used for you who have already had the basic idea about jekyll and how to create a jekyll site. This note is only for quickly reference.

## Useful links

<div class="two-columns-list" markdown="1">
- [Jemoji cheat sheet](https://www.webfx.com/tools/emoji-cheat-sheet/).
- Link to [post](https://jekyllrb.com/docs/liquid/tags/#linking-to-posts) / [page](https://jekyllrb.com/docs/liquid/tags/#link).
- [Jekyll cheat sheet](https://learn.cloudcannon.com/jekyll-cheat-sheet/).
- [Rouge CSS file theme](http://jwarby.github.io/jekyll-pygments-themes/languages/javascript.html) (Pygment)
- [Compress HTML in Jekyll](http://jch.penibelst.de/).
- [Kramdown quickref](https://kramdown.gettalong.org/quickref.html).
- [Official dependencies / gems](https://pages.github.com/versions/) supported by Github Pages.
</div>

## Using docker to run/deploy jekyll

Read this [readme](https://github.com/dinhanhthi/my-dockerfiles/tree/master/quick-jekyll). An example is [repo of this site](https://github.com/dinhanhthi/dinhanhthi.com).

## Install and run Jekyll on fresh machine

### Ubuntu

``` bash
# install ruby-dev
sudo apt install ruby-dev

# install bundler
sudo gem install bundler

# clone a jekyll theme
# cd to that theme

# install gems in the theme
bundle install --path vendor/bundle

# serve
bundle exec jekyll serve

# If error "ExecJS and could not find a JavaScript runtime"
sudo apt-get install nodejs
```

### Windows

Follow [this guide](/docker-wsl2-windows#jekyll-on-wsl2) using WSL2 on Windows.

## Make jekyll build faster

<div class="flex-50" markdown="1">
~~~ bash
# BENCHMARKING your site
bundle exec jekyll build --profile
~~~

~~~ bash
# clean cache
bundle exec jekyll clean
~~~
</div>

1. Disable `jekyll-feed`
2. Run `bundle exec jekyll serve -I` (wuth `-I`) to generate the changed file only. If you create a new file, open a new terminal tab and run `bundle exec jekyll build`.
3. Upgrade to Jekyll 4.0.
4. Add `gem "liquid-c"` to `Gemfile` and make `bundle update`
5. Use `jekyll-include-cache` (both in `Gemfile` and `_config.yml`)

Read more in [this article](https://forestry.io/blog/how-i-reduced-my-jekyll-build-time-by-61/).

### Disable jekyll-feed

1. Comment line `jekyll-feed` in `Gemfile`
2. Comment line `jekyll-feed` in `_config.yml`
3. Rebuild.

## Sitemap

If in [sitemap](https://github.com/jekyll/jekyll-sitemap), there is error like `<loc>/reading</loc>`, check your `_config.yml` + make sure there is an url inside `url` field.

## Loop through posts

~~~ liquid
{%raw%}{% for post in site.posts %}
  {{ post.title }}
{% endfor %}
{%endraw%}~~~

List all posts in each category,

~~~ liquid
{%raw%}{% for category in site.data.categories %}
  {% if site.categories[category.name].size > 0 %}
    {% for post in site.categories[category.name] %}
      {{ post.title }}
    {% endfor %}
  {% endif %}
{% endfor %}
{%endraw%}~~~

List all posts in ABC order{% ref https://stackoverflow.com/questions/39922776/how-to-sort-site-posts-alphabetically-by-post-title-in-jekyll %},

~~~ liquid
{%raw%}{% assign sortedPosts = site.posts | sort: 'title' %}
{% for post in sortedPosts %}
  {{ post.title }}
{% endfor %}
{%endraw%}~~~

List of categories and tags in a single line with commas,

~~~ liquid
{%raw%}{% for category in site.categories reversed %}{% capture category_name %}{{ category | first }}{% endcapture %}<a href="{{site.url}}{{site.baseurl}}/#{{category_name | replace: " ","_"}}">{{ category_name }}</a>{% if forloop.length > 1 and forloop.last != true %}, {% else %}.{% endif %}{% endfor %}
{%endraw%}~~~

~~~ liquid
{%raw%}{% for tag in site.tags %}{% capture test %}{{tag[0] | slice: 0}}{% endcapture %}{% capture testup %}{{tag[0] | slice: 0 | upcase}}{% endcapture %}<a href="#{{tag[0] | slugify}}{% if test == testup %}_cap{% endif %}">{{tag[0]}}</a>{% if forloop.length > 1 and forloop.last != true %}, {% else %}.{% endif %}{% endfor %}
{%endraw%}~~~

### Edit tags for all posts

Read [this source code](https://github.com/dinhanhthi/dinhanhthi.com/blob/master/pages/tags.html).

## Using markdown syntax inside html tags

You can use directly by

~~~ html
{%raw%}<span markdown="span"></span>
<div markdown="1"></div>
{%endraw%}~~~

of only once,

~~~ html
{%raw%}{::options parse_block_html="true" /}
<!-- other html + markdown inside -->
{%endraw%}~~~

Or even shorter,

~~~
{%raw%}Testing {::nomarkdown}**see**{:/} and test.
{%endraw%}~~~

## Check version

- Local gems: `gem list jekyll`.
- Current jekyll version of website: check `Gemfile`. Need to run `bundle update` if change any version in this file.

## Link to posts

~~~
{%raw%}[Name of Link]({% post_url 2010-07-21-name-of-post %}){%endraw%}
~~~

Edit this post on github (put below link in your post layout),

~~~
{%raw%}https://github.com/dinhanhthi/dinhanhthi.com/edit/master/{{path.path}}{%endraw%}
~~~


## Custom domain & repository with Jekyll sites

There are several choices for you to choose, it depends on your need.

### You don't have a custom domain

1. Suppose your github account is `<username>`.
2. Create a repo `<username>.github.io`.
3. Put your site in branch `master` (default).
4. Your site is published at `https://<username>.github.io`

If you wanna store your site in a custom repo, e.g. `mysite`:

1. Create a branch `gh-pages` + set it as default + store your site here.
2. Remove content at `url:` in `_config.yml`.
3. Your site is live at `https://<username>.github.io/mysite/`

### You have a custom domain

1. Create file `CNAME` at root and put `<customdomain>.com` in it.
2. Create `A` or `CNAME` record in DNS provider. Check [more](https://help.github.com/en/github/working-with-github-pages/managing-a-custom-domain-for-your-github-pages-site).
3. You can also use [netlify](http://netlify.com) to set all things up automatically.

## Using custom plugins?

1. Build your site locally and get a folder `_site`.
2. Put it to github and see the results.

You can also use [`netlify`](https://netlify.com), it accepts custom plugin as well.

## Using `_data` with `include`

You can use,

~~~
{%raw%}{% include proud-of.html data=site.data.proudof-notes %}{%endraw%}
~~~

where there is a data file located in `_data/proudof-notes.yml`.

## Create a custom tags/blocks

### Refs

- [Official Jekyll guid](https://jekyllrb.com/docs/plugins/tags/).
- [How to create customizable Liquid tags](https://blog.sverrirs.com/2016/04/custom-jekyll-tags.html) in Jekyll by Sverrir Sigmundarson.
- [Creating an Accordion Plugin for Jekyll](http://mikelui.io/2018/07/22/jekyll-nested-blocks.html) by Mike Lui.

### Tag with single parameter

<div class="d-md-flex" markdown="1">
{:.flex-even.overflow-auto.pr-md-1}
~~~
{% raw %}{% render_time page rendered at: %}{% endraw %}
~~~

{:.flex-even.pl-md-1.overflow-auto}
~~~ html
page rendered at: Tue June 22 23:38:47 –0500 2010
~~~
</div>

Inside folder `_plugins`, create a file `thi_single_tag.rb` whose content is,

~~~ ruby
module Jekyll
  class RenderTimeTag < Liquid::Tag

    def initialize(tag_name, text, tokens)
      super
      @text = text
    end

    def render(context)
      "#{@text} #{Time.now}"
    end
  end
end

Liquid::Template.register_tag('render_time', Jekyll::RenderTimeTag)
~~~

### Tag with two parameters

<div class="d-md-flex" markdown="1">
{:.flex-even.overflow-auto.pr-md-1}
~~~
{% raw %}{% badge update | green %}{% endraw %}
~~~

{:.flex-even.pl-md-1.overflow-auto}
~~~ html
<span class="tbadge badge-green">update</span>
~~~
</div>

Inside folder `_plugins`, create a file `thi_badge.rb` whose content is,

~~~ ruby
class Badge < Liquid::Tag
  def initialize(tag_name, input, tokens)
    super
    @input = input
  end

  def render(context)
    # Split the input variable (omitting error checking)
    input_split = split_params(@input)
    text = input_split[0].strip
    color = input_split[1].strip

    # Write the output HTML string
    output = <<~EOS
      <span class="tbadge badge-#{color}">#{text}</span>
    EOS

    # Render it on the page by returning it
    return output;
  end

  def split_params(params)
    params.split("|")
  end
end
Liquid::Template.register_tag('badge', Badge)
~~~

### Block with single parameter

For example, we wanna create a custom block `alertbox` using [class from Bootstrap](https://getbootstrap.com/docs/4.1/components/alerts/).

<div class="d-md-flex" markdown="1">
{:.flex-even.overflow-auto.pr-md-1}
~~~
{% raw %}{% alertbox warning %}
Content
{% endalertbox %}{% endraw %}
~~~

{:.flex-even.pl-md-1.overflow-auto}
~~~ html
<div class="alert alert-warning" role="alert" markdown="1">
Content
</div>
~~~
</div>

Inside folder `_plugins`, create a file `thi_alert.rb` whose content is,

~~~ ruby
module Jekyll
  class Alertbox < Liquid::Block
    def initialize(tag_name, input, liquid_options)
      super
      @input = input.strip
    end

    def render(context)
      content = super

      case @input
      when "warning"
        box_type = 'warning'
      when "success"
        box_type = 'success'
      when "primary"
        box_type = 'primary'
      when "secondary"
        box_type = 'secondary'
      when "danger"
        box_type = 'danger'
      when "info"
        box_type = 'info'
      when "light"
        box_type = 'light'
      when "dark"
        box_type = 'dark'
      end

      output = <<~EOS
        <div class="alert alert-#{box_type}" markdown="1">
          #{content}
        </div>
      EOS
    end
  end
end

Liquid::Template.register_tag('alertbox', Jekyll::AlertBox)
~~~

### Nested blocks with crossed-using variables

A more complicated example, suppose that you wanna create a **hide/show box**{:.tbrown} using [Bootstrap's Collapse](https://getbootstrap.com/docs/4.1/components/collapse/), you can use below shortcode. Its advantage is that you don't have to put manually the `id` for each box! Wonderful!

<div class="d-md-flex" markdown="1">
{:.flex-even.overflow-auto.pr-md-1}
~~~
{% raw %}{% hsbox %}

{% hstitle %}
Box's title
{% endhstitle %}

{% hscontent %}
Box's content.
{% endhscontent %}

{% endhsbox %}{% endraw %}
~~~

{:.flex-even.overflow-auto.pl-md-1}
~~~ html
<div class="hide-show-box">
<button type="button" markdown="1" class="btn collapsed box-button" data-toggle="collapse" data-target="#box1ct">
Box's title
</button>
<div id="box1ct" markdown="1" class="collapse multi-collapse box-content">
Box's content.
</div>
</div>
~~~
</div>

Inside folder `_plugins`, create a file `thi_hideshowbox.rb` whose content is,

~~~ ruby
module Jekyll
  class HideShowBox < Liquid::Block

    def initialize(tag_name, contain, tokens)
      super
    end

    def generate_box_id(number)
      charset = Array('A'..'Z') + Array('a'..'z')
      Array.new(number) { charset.sample }.join
    end

    def render(context)
      context.stack do
        context["boxID"] = generate_box_id(20) # create the box's ID
        @content = super
      end
      "<div class=\"hide-show-box\">#{@content}</div>"
    end
  end

  class HSBtitle < Liquid::Tag
    def initialize(tag_name, contain, tokens)
      super
      @title = contain
    end

    def render(context)
      boxID = context["boxID"] # get the box's ID

      output = <<~EOS
        <button type="button" markdown="1" class="btn collapsed box-button" data-toggle="collapse" data-target="##{boxID}">#{@title}</button>
      EOS
    end
  end

  class HSBcontent < Liquid::Block
    def initialize(tag_name, contain, tokens)
      super
      @showBox = contain.strip
    end

    def render(context)
      boxID = context["boxID"] # get the box's ID
      if @showBox == 'show'
        classShow = 'show'
      else
        classShow = ''
      end
      output = <<~EOS
        <div id="#{boxID}" markdown="1" class="collapse multi-collapse box-content #{classShow}">
          #{super}
        </div>
      EOS

      output
    end
  end
end

Liquid::Template.register_tag('hsbox', Jekyll::HideShowBox)
Liquid::Template.register_tag('hstitle', Jekyll::HSBtitle)
Liquid::Template.register_tag('hscontent', Jekyll::HSBcontent)
~~~

:bulb: Actually, there is a **simpler solution**{:.tbrown} for this task. We can get

<div class="d-md-flex" markdown="1">
{:.flex-even.overflow-auto.pr-md-1}
~~~
{% raw %}{% hsbox **Box's title** | show %}
Box's content.
{% endhsbox %}{% endraw %}
~~~

{:.flex-even.overflow-auto.pl-md-1}
~~~ html
<div class="hide-show-box">
<button type="button" markdown="1" class="btn collapsed box-button" data-toggle="collapse" data-target="#something">
<strong>Box's title</strong>
</button>
<div id="something" markdown="1" class="collapse multi-collapse box-content">
Box's content.
</div>
</div>
~~~
</div>

by using

~~~ ruby
module Jekyll
  class HideShowBox < Liquid::Block

    def initialize(tag_name, contain, tokens)
      super
      @input = contain
    end

    def generate_box_id(number)
      charset = Array('A'..'Z') + Array('a'..'z')
      Array.new(number) { charset.sample }.join
    end

    def render(context)
      # Split the input variable (omitting error checking)
      input_split = split_params(@input)
      title = input_split[0]
      boxid = generate_box_id(20)
      if input_split[1] != nil
        if input_split[1].strip == 'show'
          showbox = "show"
        else
          showbox = ""
        end
      else
        showbox = ""
      end
      content = super

      output = <<~EOS
        <div class="hide-show-box">
          <button type="button" markdown="1" class="btn collapsed box-button" data-toggle="collapse" data-target="##{boxid}">
            #{title}
          </button>
          <div id="#{boxid}" markdown="1" class="collapse multi-collapse box-content #{showbox}">
            #{content}
          </div>
        </div>
      EOS
    end

    def split_params(params)
      params.split("|")
    end
  end
end

Liquid::Template.register_tag('hsbox', Jekyll::HideShowBox)
~~~

### Problem with kramdown

Somtimes, we cannot use `markdown="1"` directly in ruby file. For example, below block of code produces a block of codes (`<pre>`) instead of a single text,

~~~ ruby
def initialize(tag_name, input, liquid_options)
  super
  @title = input
end

def render(context)
  content = super
  output = <<~EOS
    <div class="def-box" id="dn1">
      <div class="box-title" markdown="1">
        #{@title}
      </div>
      <div class="box-content" markdown="1">
        #{content}
      </div>
    </div>
  EOS
end
~~~

Instead, we change a little bit like this,

~~~ html
<div class="box-title">
  <span markdown="span">#{@title}</span>
</div>
~~~

## Run with draft

Inside the root folder, create a folder named `_drafts`. You can put your draft posts inside this folder and whenever you wanna show it in your site, use this command,

~~~ bash
bundle exec jekyll serve --draft
~~~

In the case you have already build your site (all new posts are rendered to `_site`), you only changes some small things in some post and you don't want jekyll to render again all things on your site (just look at your current post), use this,

~~~ bash
bundle exec jekyll serve -I
~~~

## Serve in background

<div class="flex-50" markdown="1">
``` bash
# start
bundle exec jekyll serve 2>&1 &
bundle exec jekyll serve -I 2>&1 &
```

``` bash
# stop
# find jekyll server process
ps -ef | grep jekyll
# substitute pid# with process id
kill -9 pid#
```
</div>

## Using markdown syntax inside a HTML tag/block

For a block, we use `markdown="1"`,

~~~ html
<div markdown="1">paragraph</div>
~~~

For a tag, we use `markdown="span"`,

~~~ html
<mark markdown="span">text</span>
~~~

## Add search with lunrjs

Download [lunr.min.js]({{ site.baseurl }}/js/lunr.min.js) and [search.js]({{ site.baseurl }}/js/search.js) and put them in `root/js/`. The newest version of lunrjs given here but I'm not sur if it works with this technique or not.

Create a file `search.html` in the root folder with content:

~~~ html
{% raw %}---
layout: page
title: Search on this page
---

<p class="p-intro">
  <span id="search-process">{{re_loading}}</span> {{re_result}} <span id="search-query-container" style="display: none;">{{re_forkey}} "<strong id="search-query"></strong>"</span>
</p>
<ul id="search-results"></ul>

<script type="text/javascript">
  window.data = {
    {% for post in site.posts %}
      {% if post.title %}
        {% unless post.excluded_in_search %}
          {% if added %},{% endif %}
          {% assign added = false %}
          "{{ post.url | slugify }}": {
            "id": "{{ post.url | slugify }}",
            "title": "{{ post.title | xml_escape }}",
            "categories": "{{ post.categories | join: ", " | xml_escape }}",
            "tags": "{{ post.tags | join: ", " | xml_escape }}",
            "url": " {{ post.url | xml_escape }}",
            "content": {{ post.content | strip_html | replace_regex: "[\s/\n]+"," " | strip | jsonify }}
          }
          {% assign added = true %}
        {% endunless %}
      {% endif %}
    {% endfor %}
  };
</script>
<script src="{{ site.baseurl }}/js/lunr.min.js"></script>
<script src="{{ site.baseurl }}/js/search.js"></script>
{% endraw %}~~~

Note that, you can change some personal settings in the files `search.js` and `search.html` if you like.

**Remark**: if your site has so many posts, you can remove the last line (`"content"....`) to ignore the content from the search. You can even add "keywords" (resplace for "content") and put that "keywords" in the frontmatter, change also the term "content" in `search.js` by "keywords". That's what I did on this site.