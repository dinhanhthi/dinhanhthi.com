# USED FOR BUILDING LOCALLY (WITHOUT NETLIFY)!

echo "1️⃣ Start copying dinhanhthi.com/_site to _site/_site/"
rm -rf ../_site/_site
mkdir ../_site/_site
cp -Rf _site/* ../_site/_site
echo "✅ End copying"
echo "2️⃣ Go to _site folder"
cd ../_site/
echo "3️⃣ Start updating _site to Github"
git add .
git commit -m "Updated: `date +'%Y-%m-%d %H:%M:%S'`"
git push
echo "✅ End updating & come back to dinhanhthi.com"
cd ../dinhanhthi.com/