# USED FOR BUILDING AND DEPLOYING SITE WITH NETLIFY!

echo "1️⃣ Updating notes..."
cd notesData
git add .
git commit -m "Updated: `date +'%Y-%m-%d %H:%M:%S'`"
git push
# echo "⏰ Wait 3 seconds..."
# sleep 3
echo "2️⃣ Updating submodules & current changes..."
cd ..
git submodule update --remote
git add .
git commit -m "Updated: `date +'%Y-%m-%d %H:%M:%S'`"
git push
# echo "⏰ Wait 3 seconds..."
# sleep 3
echo "3️⃣ Merging dev to prod..."
git push . head:prod
echo "🚀 Updating prod & trigger build on netlify..."
git push origin prod --force
echo "4️⃣ Merging prod to dev..."
git push . head:dev --force
echo "🔙 Back to dev"
git checkout dev
echo "✅ Done!"
