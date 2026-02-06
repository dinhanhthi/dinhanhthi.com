# Documentation

## 🚀 AWS Deployment

**Main Guide:** [Deploy Next.js to AWS Amplify](https://dinhanhthi.com/note/nextjs-aws/)

Complete guide để deploy project này lên AWS Amplify:
- ✅ Setup trong 2-3 giờ
- ✅ Cost-effective deployment solution
- ✅ Tất cả tính năng Next.js 15 hoạt động đầy đủ
- ✅ GitHub Actions cache warming tự động

**Quick Start:**
1. Create AWS Amplify app + connect GitHub
2. Import 60+ environment variables
3. Deploy + test
4. Add custom domain
5. Done! ✅

---

## 📝 Other Docs

- **[testing-checklist.sh](./testing-checklist.sh)** - Automated testing script sau khi deploy
- **[REDIS_CACHE.md](./REDIS_CACHE.md)** - Redis caching strategy documentation

---

## Files Created for AWS Migration

- **[`/amplify.yml`](../amplify.yml)** - AWS Amplify build configuration
- **[`.github/workflows/warm-cache-after-deploy.yml`](../.github/workflows/warm-cache-after-deploy.yml)** - Updated cache warming workflow

**No code changes needed** - Project works as-is!

---

**Last Updated:** 2026-02-04
