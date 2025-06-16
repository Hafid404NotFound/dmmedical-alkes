# 🔄 Fitur Foto 360° - DM Medical Alkes

## 📋 Overview

Sistem telah diupgrade dari video 360° menjadi **foto 360°** yang lebih efisien dan user-friendly. Sekarang admin dapat mengupload folder berisi beberapa foto untuk membuat tampilan 360° yang dapat diputar.

## ✨ Fitur Baru

### 🏗️ Untuk Admin (Dashboard)

- **Upload Folder 360°**: Upload seluruh folder berisi foto-foto 360° sekaligus
- **Preview Real-time**: Lihat preview 360° langsung saat upload
- **Auto-sorting**: Foto otomatis diurutkan berdasarkan nama file
- **Management Tool**: Hapus, tambah, atau atur ulang foto 360°

### 👥 Untuk Customer (Product Detail)

- **Interactive 360° View**: Drag untuk memutar produk 360°
- **Auto Rotate**: Putar otomatis untuk demo
- **Touch Support**: Swipe di mobile untuk navigasi
- **Keyboard Controls**: Arrow keys untuk navigasi
- **Tab Switching**: Switch antara 360° view dan gallery foto biasa

## 🔧 Implementasi

### 1. Komponen Baru

#### `Image360Uploader.tsx`

- Upload folder dengan multiple files
- Preview 360° dengan navigation
- Support drag & drop folder
- Auto-rotation demo

#### `ImageViewer360.tsx`

- Interactive 360° viewer untuk customer
- Mouse drag, touch swipe, keyboard navigation
- Auto-rotate mode dengan controls
- Responsive design

#### `ProductMediaViewer.tsx` (Updated)

- Tab switching antara 360° dan gallery
- Integration dengan ImageViewer360
- Fallback untuk produk tanpa 360°
- Fullscreen mode untuk gallery

### 2. Database Schema

```sql
-- Migration script: add_images360_column.sql
ALTER TABLE product
ADD COLUMN IF NOT EXISTS images360 JSONB DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS idx_product_images360
ON product USING GIN (images360);
```

### 3. Interface Updates

```typescript
// IProduct.ts
interface IProduct {
  // ... existing fields
  images360?: string[] | string;
}

// IReqCreateNewProduct.ts
interface IReqCreateNewProduct {
  // ... existing fields
  images360?: string[];
}
```

## 📖 Cara Penggunaan

### Admin - Upload Foto 360°

1. **Persiapkan Folder**:

   ```
   📁 produk-360/
   ├── 001.jpg
   ├── 002.jpg
   ├── 003.jpg
   └── ... (hingga 36 foto)
   ```

2. **Upload di Dashboard**:

   - Buka halaman tambah/edit produk
   - Scroll ke section "📷 Foto 360° Produk"
   - Klik "Pilih Folder"
   - Pilih folder yang berisi foto-foto 360°
   - Preview akan muncul otomatis

3. **Tips Foto 360°**:
   - Gunakan tripod untuk konsistensi
   - Putar objek 10° setiap foto (36 foto = 360°)
   - Beri nama file urut: 001.jpg, 002.jpg, dst
   - Resolusi sama untuk semua foto
   - Pencahayaan konsisten

### Customer - Melihat 360°

1. **Di Halaman Detail Produk**:

   - Pilih tab "360° View" jika tersedia
   - Drag mouse/finger untuk memutar
   - Gunakan tombol controls:
     - ⏮️ Previous frame
     - ▶️ Auto rotate
     - ⏭️ Next frame
     - 🔄 Quick rotate

2. **Navigation**:
   - **Desktop**: Mouse drag, arrow keys
   - **Mobile**: Touch swipe
   - **Auto-rotate**: Klik tombol play

## 🛠️ Technical Details

### File Structure

```
src/
├── components/
│   ├── Image360Uploader.tsx     # Admin upload component
│   ├── ImageViewer360.tsx       # Customer viewer component
│   └── ProductMediaViewer.tsx   # Main media container
├── types/
│   ├── IProduct.ts              # Updated with images360
│   └── IReqCreateNewProduct.ts  # Updated with images360
└── app/
    ├── dashboard/product/new/   # Admin creation page
    └── product/[id]/           # Customer detail page
```

### Key Features

#### Performance Optimizations

- Lazy loading untuk foto 360°
- Responsive images dengan Next.js Image
- JSONB indexing untuk database queries
- Efficient drag detection

#### User Experience

- Smooth transitions dan animations
- Touch/mouse gesture support
- Loading states dan error handling
- Mobile-first responsive design

#### Admin Experience

- Bulk folder upload
- Real-time preview
- Error handling untuk format file
- Progress indicators

## 🎯 Benefits

### Vs Video 360°:

- ✅ **Lebih ringan**: Foto vs video size
- ✅ **Lebih cepat load**: Progressive loading
- ✅ **Lebih smooth**: No video buffering
- ✅ **Lebih kontrol**: Frame-by-frame navigation
- ✅ **Lebih compatible**: Support semua device

### Vs Foto Biasa:

- ✅ **Interaktif**: Customer bisa explore sendiri
- ✅ **Engaging**: More immersive experience
- ✅ **Detail**: Lihat dari segala sudut
- ✅ **Trust**: Transparansi produk lebih tinggi

## 🚀 Migration Guide

1. **Jalankan SQL Migration**:

   ```sql
   -- Copy paste dari add_images360_column.sql
   ```

2. **Update Existing Products**:

   - Edit produk existing
   - Upload foto 360° jika tersedia
   - Save untuk update database

3. **Remove Video References** (Optional):
   - Video 360° masih bisa digunakan bersamaan
   - Atau hapus field video_url jika tidak diperlukan

## 🧪 Testing

1. **Test Upload**:

   - Upload folder dengan 10-36 foto
   - Cek preview bekerja
   - Cek urutan foto benar

2. **Test Viewer**:

   - Desktop: drag mouse
   - Mobile: swipe finger
   - Keyboard: arrow keys
   - Auto-rotate: klik play button

3. **Test Integration**:
   - Tab switching 360° ↔ Gallery
   - Fallback jika tidak ada 360°
   - Performance dengan banyak foto

## 🔮 Future Enhancements

- [ ] 3D model support (.obj, .gltf)
- [ ] Zoom in/out pada 360° view
- [ ] Hotspot annotations
- [ ] 360° video support (upgrade)
- [ ] VR/AR integration
- [ ] Social sharing 360° views

---

**Status**: ✅ Completed - Ready for Production

**Last Updated**: June 17, 2025
