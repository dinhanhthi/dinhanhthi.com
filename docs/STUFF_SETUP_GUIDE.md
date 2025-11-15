# Cool Stuff Feature - Setup Guide

Hướng dẫn chi tiết để thiết lập tính năng Stuff (bookmark) với Supabase và Cloudinary.

## Tổng quan

Tính năng Stuff cho phép bạn:
- Lưu trữ bookmarks với title, URL, image, description, notes, và tags
- Tự động fetch metadata từ URL (Open Graph tags)
- Upload ảnh lên Cloudinary
- Quản lý (CRUD) thông qua admin panel
- Hiển thị public với pagination
- Section trên trang chủ

## Bước 1: Setup Supabase

### 1.1 Tạo Database Table

1. Truy cập [Supabase Dashboard](https://supabase.com/dashboard)
2. Chọn project của bạn
3. Vào **SQL Editor**
4. Chạy query sau:

```sql
-- Create stuffs table
create table public.stuffs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  url text unique not null,
  image_url text,
  description text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  tags text[] default '{}'::text[]
);

-- Enable Row Level Security
alter table public.stuffs enable row level security;

-- Create policy: Everyone can read stuffs
create policy "Anyone can read stuffs"
  on public.stuffs
  for select
  using (true);

-- Create policy: Only authenticated users can insert/update/delete
create policy "Authenticated users can insert stuffs"
  on public.stuffs
  for insert
  with check (auth.role() = 'authenticated');

create policy "Authenticated users can update stuffs"
  on public.stuffs
  for update
  using (auth.role() = 'authenticated');

create policy "Authenticated users can delete stuffs"
  on public.stuffs
  for delete
  using (auth.role() = 'authenticated');

-- Create index for faster queries
create index stuffs_created_at_idx on public.stuffs(created_at desc);
create index stuffs_tags_idx on public.stuffs using gin(tags);

-- Create full-text search index
-- This creates a tsvector column for efficient text search
alter table public.stuffs add column search_vector tsvector
  generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(notes, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(url, '')), 'D')
  ) stored;

-- Create GIN index on search_vector for fast full-text search
create index stuffs_search_idx on public.stuffs using gin(search_vector);
```

### 1.2 Lấy API Keys

1. Vào **Settings** > **API**
2. Copy các giá trị sau:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`

   **Nếu project mới (từ Nov 2025)**:
   - `Publishable` key (bắt đầu với `sb_publishable_...`) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `Secret` key (bắt đầu với `sb_secret_...`) → `SUPABASE_SERVICE_ROLE_KEY`

   **Nếu project cũ (legacy)**:
   - `anon public` key (JWT format) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key (JWT format) → `SUPABASE_SERVICE_ROLE_KEY`

   > **Lưu ý**: Cả hai loại keys đều hoạt động như nhau. Code không cần thay đổi.

## Bước 2: Setup Cloudinary

### 2.1 Lấy API Credentials

1. Đăng nhập vào [Cloudinary Console](https://console.cloudinary.com/)
2. Vào **Settings** > **API Keys**
3. Copy các giá trị:
   - `Cloud name` → `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
   - `API Key` → `CLOUDINARY_API_KEY`
   - `API Secret` → `CLOUDINARY_API_SECRET`

### 2.2 Tạo Upload Preset (Optional)

1. Vào **Settings** > **Upload**
2. Scroll xuống **Upload presets**
3. Tạo preset mới với cấu hình:
   - Folder: `stuffs`
   - Signing Mode: Signed
   - Access Mode: Public

## Bước 3: Cấu hình Environment Variables

### 3.1 Local Development

Copy `example.env.local` thành `.env.local` và điền các giá trị:

```bash
# ---- SUPABASE
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# ---- CLOUDINARY
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# ---- ADMIN AUTHENTICATION
ADMIN_PASSWORD="your-secure-password"
```

### 3.2 Production (Vercel)

1. Vào Vercel Dashboard > Project > **Settings** > **Environment Variables**
2. Thêm tất cả các biến trên
3. **Quan trọng**: Dùng Supabase database riêng cho production (khác với dev)
4. Redeploy sau khi thêm env vars

## Bước 4: Cài đặt Dependencies

```bash
pnpm install
```

Dependencies đã được cài:
- `@supabase/supabase-js` - Supabase client
- `cloudinary` - Cloudinary SDK
- `next-cloudinary` - Next.js integration
- `jsdom` - HTML parsing cho metadata
- `jose` - JWT cho authentication

## Bước 5: Chạy Development Server

```bash
pnpm run dev
```

Server sẽ chạy tại `http://localhost:3004`

## Cấu trúc Files Đã Tạo

```
src/
├── lib/
│   ├── supabase.ts              # Supabase client
│   ├── auth.ts                  # Admin authentication
│   ├── stuff-fetcher.ts         # Fetch stuff from Supabase
│   └── types/
│       └── stuff.ts             # TypeScript types
├── app/
│   ├── api/
│   │   ├── admin/
│   │   │   ├── login/route.ts   # Admin login
│   │   │   ├── logout/route.ts  # Admin logout
│   │   │   └── verify/route.ts  # Verify admin status
│   │   └── stuff/
│   │       ├── route.ts         # GET & POST stuff
│   │       ├── [id]/route.ts    # GET, PUT, DELETE single stuff
│   │       ├── fetch-metadata/route.ts  # Fetch URL metadata
│   │       └── upload-image/route.ts    # Upload to Cloudinary
│   ├── admin/
│   │   ├── page.tsx             # Admin page (server component)
│   │   └── AdminPageClient.tsx  # Admin login UI
│   ├── stuff/
│   │   ├── page.tsx             # Stuff listing (server component)
│   │   └── StuffPageClient.tsx  # Stuff UI với editor
│   └── components/
│       ├── StuffCard.tsx        # Display single stuff
│       ├── StuffEditor.tsx      # CRUD editor
│       └── StuffSectionHome.tsx # Homepage section
```

## Cách Sử Dụng

### Admin Access

1. Truy cập `/admin`
2. Nhập password (từ `ADMIN_PASSWORD`)
3. Sau khi đăng nhập, có thể:
   - Truy cập `/stuff` để quản lý
   - Click "Add New Stuff" để tạo mới
   - Click "Edit" trên mỗi card để chỉnh sửa

### Thêm Stuff Mới

1. Paste URL vào field "URL"
2. Hệ thống tự động fetch metadata (title, description, image)
3. Nếu có image từ metadata:
   - Click "Upload to Cloudinary" để upload
   - Image URL sẽ được thay thế bằng Cloudinary URL
4. Chỉnh sửa các field nếu cần
5. Thêm tags (nhấn Enter hoặc click "Add Tag")
6. Click "Save"

### Public Access

- Trang `/stuff` - Hiển thị tất cả stuff với pagination (30/page)
- Homepage - Section "Cool stuff" hiển thị 6 stuff mới nhất
- **Full-text search** - Tìm kiếm trong title, url, description, notes
- Filter by tags
- Kết hợp search + tag filter
- Không cần login để xem

### Sử Dụng Search

1. Vào trang `/stuff`
2. Nhập từ khóa vào search box
3. Click "Search" hoặc nhấn Enter
4. Kết quả được tìm trong:
   - **Title** (độ ưu tiên cao nhất)
   - **Description** (độ ưu tiên cao)
   - **Notes** (độ ưu tiên trung bình)
   - **URL** (độ ưu tiên thấp nhất)
5. Search hỗ trợ:
   - Từ đơn: `react`
   - Nhiều từ: `react tutorial`
   - Phrase: `"next.js tutorial"`
   - AND: `react AND typescript`
   - OR: `react OR vue`
   - Exclusion: `react -tutorial`

## API Endpoints

### Public
- `GET /api/stuff` - Lấy danh sách stuff
  - Query params:
    - `page` - Page number (default: 1)
    - `tag` - Filter by tag
    - `search` - Full-text search query
  - Example: `/api/stuff?page=1&tag=react&search=tutorial`
- `GET /api/stuff/[id]` - Lấy single stuff

### Admin Only
- `POST /api/stuff` - Tạo stuff mới
- `PUT /api/stuff/[id]` - Update stuff
- `DELETE /api/stuff/[id]` - Xóa stuff
- `POST /api/stuff/fetch-metadata` - Fetch URL metadata
- `POST /api/stuff/upload-image` - Upload image to Cloudinary

### Admin Authentication
- `POST /api/admin/login` - Login với password
- `POST /api/admin/logout` - Logout
- `GET /api/admin/verify` - Verify admin status

## Security

### Authentication
- Password-based với JWT tokens
- HttpOnly cookies (24h expiry)
- Admin routes protected với middleware

### Supabase API Keys
**Legacy Keys (JWT-based)**:
- `anon public` - Safe for client-side (RLS enforced)
- `service_role` - Server-side only (bypasses RLS)

**New Keys (2025+)**:
- `Publishable` (`sb_publishable_...`) - Replaces anon (RLS enforced)
- `Secret` (`sb_secret_...`) - Replaces service_role (bypasses RLS)

> **Quan trọng**: Cả hai loại keys đều tương thích. Code không cần thay đổi.

### Supabase RLS
- Public read access
- Write access chỉ cho authenticated users
- Service role/Secret key chỉ dùng server-side
- **NEVER** expose service role/secret key ở client-side

### Cloudinary
- API keys chỉ dùng server-side
- Upload qua API route (không expose keys)
- Images stored trong `stuff/` folder

## Free Tier Limits

### Supabase (Free)
- ✅ 500MB database
- ✅ 1GB file storage
- ✅ 2GB bandwidth
- ✅ Row Level Security
- ✅ Realtime subscriptions

### Cloudinary (Free)
- ✅ 25 monthly credits
- ✅ 25GB storage
- ✅ 25GB bandwidth
- ✅ Image transformations
- ✅ Auto optimization

## Troubleshooting

### Lỗi "Missing Supabase environment variables"
→ Kiểm tra `.env.local` có đầy đủ biến env chưa
→ Verify keys không có khoảng trắng thừa

### Supabase API Keys - Legacy vs New
**Nếu project tạo trước Nov 2025**:
- Dùng `anon public` (JWT format) cho `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Dùng `service_role` (JWT format) cho `SUPABASE_SERVICE_ROLE_KEY`

**Nếu project tạo sau Nov 2025**:
- Dùng `Publishable` (`sb_publishable_...`) cho `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Dùng `Secret` (`sb_secret_...`) cho `SUPABASE_SERVICE_ROLE_KEY`

**Migration từ legacy sang new keys**:
- Cả hai loại keys hoạt động giống nhau
- Không cần thay đổi code
- Simply replace trong `.env.local`

### Lỗi "Unauthorized" hoặc "row-level security policy" khi thêm stuff
**Lỗi**: `new row violates row-level security policy for table "stuffs"`

**Nguyên nhân**:
- RLS policy yêu cầu `auth.role() = 'authenticated'`
- Nhưng app dùng password-based auth (không phải Supabase Auth)
- Service role key chưa được setup

**Giải pháp**:
1. ✅ Đảm bảo `SUPABASE_SERVICE_ROLE_KEY` có trong `.env.local`
2. ✅ Code đã được update để dùng `getServerSupabase()` cho admin operations
3. ✅ Verify đã login qua `/admin`

**Cách hoạt động**:
- Public users: Dùng `anon` key → RLS enforced → Read-only
- Admin operations: Dùng `service_role` key → Bypasses RLS → Full access

### Lỗi upload Cloudinary
→ Kiểm tra API credentials và network

### Stuff không hiển thị trên homepage
→ Đảm bảo đã có dữ liệu trong Supabase

### Search không hoạt động
→ Kiểm tra đã chạy migration thêm `search_vector` column chưa
→ Nếu đã có dữ liệu trước khi thêm search, cần rebuild search index:
```sql
-- Rebuild search vector for existing data
update public.stuffs set title = title;
```

### Search kết quả không chính xác
→ PostgreSQL full-text search sử dụng English dictionary
→ Có thể cần điều chỉnh search weights trong migration
→ Hoặc sử dụng `plainto_tsquery` thay vì `websearch_to_tsquery`

## Full-Text Search Details

### Cách Hoạt Động

1. **Generated Column**: `search_vector` tự động update khi title, description, notes, hoặc url thay đổi
2. **Search Weights**:
   - A (highest): Title
   - B: Description
   - C: Notes
   - D (lowest): URL
3. **Index Type**: GIN index cho performance tốt nhất
4. **Search Type**: `websearch` - hỗ trợ query syntax như Google

### Ví Dụ Search Queries

```
# Tìm stuff có "react"
react

# Tìm stuff có cả "react" và "typescript"
react typescript
hoặc
react AND typescript

# Tìm stuff có "react" hoặc "vue"
react OR vue

# Tìm stuff có "react" nhưng không có "tutorial"
react -tutorial

# Tìm exact phrase
"next.js tutorial"

# Kết hợp
"react hooks" typescript -class
```

### Performance

- GIN index được tạo trên `search_vector`
- Search trên hàng trăm ngàn records vẫn nhanh (< 100ms)
- Index tự động update khi data thay đổi
- Không cần rebuild index thủ công

### Nâng Cao

Nếu muốn customize search behavior, edit migration:

```sql
-- Thay đổi search weights
alter table public.stuffs add column search_vector tsvector
  generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(tags::text, '')), 'B') ||  -- Thêm tags
    setweight(to_tsvector('english', coalesce(description, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(notes, '')), 'D')
  ) stored;
```

## Next Steps

1. **Custom Styling**: Tùy chỉnh UI cho StuffCard và StuffEditor
2. **Collections**: Nhóm stuff theo collections
3. **Import/Export**: Backup stuff data
4. **Social Sharing**: Thêm OG tags cho mỗi stuff
5. **Advanced Search**: Thêm search filters (date range, sort by relevance)

## Support

- Supabase Docs: https://supabase.com/docs
- Cloudinary Docs: https://cloudinary.com/documentation
- Next.js Docs: https://nextjs.org/docs
