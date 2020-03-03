---
layout: post
title: "Jekyll Tips"
categories: [web development]
math: 1
excluded_in_search: 1
icon-photo: jekyll.png
date: 2019-10-24
---

{% assign img-url = '/img/post/web-dev' %}

{% include toc.html %}

## Useful links

- [Jemoji cheat sheet](https://www.webfx.com/tools/emoji-cheat-sheet/).
- Link to [post](https://jekyllrb.com/docs/liquid/tags/#linking-to-posts) / [page](https://jekyllrb.com/docs/liquid/tags/#link).
- [Jekyll cheat sheet](https://learn.cloudcannon.com/jekyll-cheat-sheet/).
- [Rouge CSS file theme](http://jwarby.github.io/jekyll-pygments-themes/languages/javascript.html) (Pygment)
- [Compress HTML in Jekyll](http://jch.penibelst.de/).

## Check version

- Local gems: `gem list jekyll`.
- Current jekyll version of website: check `Gemfile`. Need to run `bundle update` if change any version in this file.

## Link to posts

~~~
{%raw%}[Name of Link]({% post_url 2010-07-21-name-of-post %}){%endraw%}
~~~


## Custom domain & repository with Jekyll sites

There are several choices for you to choose, it depends on your need.

### You don't have a custom domain

By default, you should store your site on Github with a repository whose name is `<username>.github.io` (`<username>` is your Github account, exactly like that!) and set the default branch as `master`. Github Pages will do the rest for you to published your website at `https://<username>.github.io`.

In the case you wanna store your site in a custom repository, let's say `mywebsite` (instead of `<username>.github.io`), just create a branch whose name is `gh-pages` (exactly like that) and remove the content after `url:` in the `_config.yml` file. Finally, set `gh-pages` as the default branch for that repository. From now on, your site is on `https://<username>.github.io/mywebsite/`


### You have a custom domain

At the root of your site, just create a file namely `CNAME` (without extension!) containing `<yourcustomdomain>.com`. Don't forget create either a `A` or `CNAME` record in your DNS provider (check the step 4 [here](https://help.github.com/en/github/working-with-github-pages/managing-a-custom-domain-for-your-github-pages-site)).

Don't forget a very useful service from [netlify](http://netlify.com). You can store your site on Github and run with netlify. You can even use your custom/third-party plugins for your site on netlify (you couldn't do that on Github Pages).

## Using custom plugins?

By default, Github Pages doesn't allow custom plugins. It only support [some specific plugins](https://pages.github.com/versions/). If you wanna use your custom plugins (or third party plugins), you can run your site on [netlify](https://netlify.com), it's free for non-commercial projects. You are able to host your site in a Github repository, the rest of work will be handled by netlify. Wonderful! 

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

## Click to enlarge photo

If some photos on your page are too small and you wanna add a function in that users can click on the photo to enlarge it. This technique requires [Bootstrap 4](https://getbootstrap.com).

Put below scripts **in that order**{:.tbrown} before `</body>` tag.

~~~ html
<!-- jquery 1.10.1 -->
<script src="https://code.jquery.com/jquery-1.10.1.min.js" integrity="sha256-SDf34fFWX/ZnUozXXEH0AeB+Ip3hvRsjLwp6QNTEb3k=" crossorigin="anonymous"></script>

<!-- bootstrap scripts -->

<!-- enlargement script -->
<script type="text/javascript">
  jQuery(document).ready(function($){

    // add more attributes to the img.pop
    $('.pop').attr("data-toggle", "tooltip");
    $('.pop').attr("data-placement", "top");
    $('.pop').attr("title", "Click to see a bigger photo.");

    // current view port size
    var wW = $(window).width()*0.9;
    var wH = $(window).height()*0.9; // max display

    $('[data-toggle="tooltip"]').tooltip();

    $('.pop').on('click', function() {

      // real size of the photo
      var rW = $(this).find('img')[0].naturalWidth;
      var rH = $(this).find('img')[0].naturalHeight;

      var cW, cH; // photo's will be set to this size!
      cW = rW; cH = rH; // initial setting

      if (rH < wH){
        if (rW > wW){
          cW = wW; cH = wW*rH/rW;
        }
      } else{
        if (rW < wW){
          cH = wH; cW = wH*rW/rH;
        } else if(wW*rH/rW < wH){
          cW = wW; cH = wW*rH/rW;
        } else{
          cH = wH; cW = wH*rW/rH;
        }
      }

      // Show max photo's size if it's smaller than the current view port. Otherwise, it scale photo to the size of view port.
      $('.modal-dialog')[0].style.width = cW + "px";
      $('.modal-dialog')[0].style.height = cH + "px";

      $('.imagepreview').attr(
        'src', $(this).find('img').attr('src')
        );
      $('#imagemodal').modal('show');
    });
  });
</script>
~~~

Add below codes at the end of the post content,

~~~ html
<div class="modal fade" id="imagemodal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content">
      <div class="modal-body">
        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
        <img src="" class="imagepreview" style="width: 100%;" >
      </div>
    </div>
  </div>
</div>
~~~

**Usage**: add class `.pop` before the photo you wanna apply this function.

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