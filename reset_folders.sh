#!/bin/sh
# used for branch notetheme2 only
echo 'Reset some only-this-branch folders after merging.'
git reset _data _drafts img pages _config.yml index.html README.md .gitattributes feed.xml 
git checkout .
git add .
git commit -m "update from master"

