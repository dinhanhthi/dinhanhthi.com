# dinhanhthi.com [![Netlify Status](https://api.netlify.com/api/v1/badges/ace14869-1b28-471b-ad0f-5f1f7defa382/deploy-status)](https://app.netlify.com/sites/inspiring-goldstine-cfc130/deploys)

Source code of my personal website. If you would like to use this source code, please indicate me in the credit and let me know first, thanks! My email: dinhanhthi@gmail.com.

List of jupyter notebooks used in this website: [Google Drive folder](https://drive.google.com/drive/folders/1G5uYgtmAbsr_7wYnkZviwkT3d6B0fSb1?usp=sharing).

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