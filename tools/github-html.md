---
layout: page
title: "Github HTML file reader"
subtitle: Render the html files in public Github repositories
icon: "fab fa-github"
icon-color: "#e6b3ff"
permalink: /github-html
---

<form class="text-center" id="previewform" onsubmit="location.href='{{site.url}}{{site.baseurl}}/github-html?'+this.file.value;return false">
  <div class="form-group">
    <label for="exampleInputEmail1"><strong>HTML file's full URL</strong></label>
    <input type="url" id="file" value="" class="form-control" placeholder="e.g. https://github.com/user/repo/blob/master/index.html" autofocus>
    <small class="form-text text-muted">You have to type a full url to the html file.</small>
  </div>
  <button type="submit" class="btn btn-primary">See the rendered file</button>
</form>

<script src="{{site.url}}{{site.baseurl}}/tools/github-html.js"></script>

{:.ref}
*This page uses the [source code of htmlpreview](https://github.com/htmlpreview/htmlpreview.github.com). You can display even any website using this tool.*
