# dinhanhthi.com [![Netlify Status](https://api.netlify.com/api/v1/badges/ace14869-1b28-471b-ad0f-5f1f7defa382/deploy-status)](https://app.netlify.com/sites/inspiring-goldstine-cfc130/deploys)

Source code of my personal website. If you would like to use this source code, please indicate me in the credit and let me know first, thanks! My email: dinhanhthi@gmail.com.

## Installation

On Windows, using [WSL2](https://docs.microsoft.com/en-us/windows/wsl/install-win10) and then install jekyll on Linux.

``` bash
# ruby
sudo apt-get install ruby-dev
```

## Using docker?

``` bash
export JEKYLL_VERSION=4.1.0
# Check more versions here: https://hub.docker.com/r/jekyll/jekyll/tags

# first time
docker run --name dat.com --volume="$PWD:/srv/jekyll" -p 4000:4000 -it jekyll/jekyll:$JEKYLL_VERSION jekyll serve -I

# later uses
docker start dat.com

# build all site in container dat.com
docker exec -it dat.com jekyll build

# update changes for principle pages
docker exec dat.com /bin/bash update_dat.sh
```

## Build and deploy

After cloning to a local server, run these:

~~~
# install git

# install ruby
ruby --version

# install bundler
gem install bundler

# cd to the repo directory and install gems
bundle install

# run the server (http://localhost:4000)
bundle exec jekyll serve

# incremental build (only build the changes, faster)
bundle exec jekyll serve -I

# build also the posts in `_drafts`
bundle exec jekyll serve --draft
~~~