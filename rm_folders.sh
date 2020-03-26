#!/bin/sh
echo 'Reset some private folders after merging.'
git reset _posts _data _drafts img pages _config.yml index.html README.md .gitattributes feed.xml 
git checkout .
rm -rf tools files
rm dat.com.code-workspace
git add .
git commit -m "update from master"

