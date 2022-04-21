echo "📌 Updating notes...."
cd notes
git add .
git commit -m "Updated: `date +'%Y-%m-%d %H:%M:%S'`"
git push
echo "✅ Done!"
