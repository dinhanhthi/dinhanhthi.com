---
layout: page
title: "Open in Colab from Github"
subtitle: Automatically open a jupyter notebook on Github in Colab
icon-photo: colab.png
permalink: /github-colab
---

<form class="text-center" id="previewform" onsubmit="location.href='{{site.url}}{{site.baseurl}}/github-colab?'+this.file.value;return false">
  <div class="form-group">
    <label><strong>Notebook file's full URL</strong></label>
    <input type="url" id="file" value="" class="form-control" placeholder="e.g. https://github.com/user/repo/blob/master/notebook.ipynb" autofocus>
    <small class="form-text text-muted">You have to type a full url to the notebook file.</small>
  </div>
  <button type="submit" class="btn btn-primary">Open in Colab</button>
</form>

<script>
  (function () {

    // get the url
    var query = location.search.substring(1)
                .replace('https://github.com/', ''); // remove 'https://github.com/'
    
    if (query) { // only take action if there is url
      location.replace('https://colab.research.google.com/github/' + query)
    }

  })()
</script>
