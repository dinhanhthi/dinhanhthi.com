echo "#### 1. Creating _live folder"
mkdir _live
echo "#### 2. Cloning notes"
git clone git@github.com:dinhanhthi/notes.git
echo "#### 3. Done cloning notes!"
echo "#### 4. Cloning _site"
cd ..
git clone git@github.com:dinhanhthi/_site.git
echo "#### 5. Done cloning _site"
