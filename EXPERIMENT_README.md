# 360° Viewer Experiment - Justifikasi 36 Gambar

## Quick Start

1. **Jalankan Development Server:**
   ```bash
   npm run dev
   ```

2. **Akses Halaman Eksperimen:**
   ```
   http://localhost:3000/experiment
   ```

3. **Lakukan Eksperimen:**
   - Ikuti 4 tahap eksperimen (10, 18, 24, 36 gambar)
   - Berikan rating untuk setiap konfigurasi
   - Export data hasil eksperimen

## Struktur Eksperimen

### Fase 1: Testing 10 Gambar
- **Sudut per frame:** 36°
- **Folder gambar:** `public/gambar 360/10gambar/`
- **Target:** Baseline measurement
- **Expected:** Choppy animation, basic coverage

### Fase 2: Testing 18 Gambar  
- **Sudut per frame:** 20°
- **Folder gambar:** `public/gambar 360/18gambar/`
- **Target:** Standard e-commerce level
- **Expected:** Moderate smoothness

### Fase 3: Testing 24 Gambar
- **Sudut per frame:** 15°
- **Folder gambar:** `public/gambar 360/24gambar/`
- **Target:** Premium e-commerce level  
- **Expected:** Good smoothness

### Fase 4: Testing 36 Gambar
- **Sudut per frame:** 10°
- **Folder gambar:** `public/gambar 360/36gambar/`
- **Target:** Optimal configuration
- **Expected:** Excellent smoothness

## Metrik yang Diukur

### Quantitative Metrics:
- **Loading Time:** Waktu loading gambar (ms)
- **Interaction Time:** Total waktu berinteraksi (detik)
- **Rotation Count:** Jumlah rotasi penuh yang dilakukan
- **Image Index Transitions:** Perpindahan antar frame

### Qualitative Metrics (Rating 1-5):
- **Smoothness:** Kelancaran rotasi
- **Clarity:** Kejelasan detail produk
- **Usability:** Kemudahan penggunaan
- **Overall Experience:** Pengalaman keseluruhan

## Hasil dan Analisis

### Export Data
Data eksperimen dapat diekspor dalam format CSV untuk analisis lebih lanjut di Excel, SPSS, atau R.

**Format CSV:**
```csv
Jumlah Gambar,Rating Kelancaran,Rating Kejelasan,Rating Kemudahan,Rating Keseluruhan,Waktu Loading (ms),Komentar,Timestamp
```

### Visualisasi Hasil
Dashboard menampilkan:
- Tabel hasil individual
- Rata-rata per konfigurasi
- Perbandingan visual
- Trend analysis

## Technical Implementation

### Component Architecture
```
ExperimentPage
├── ExperimentViewer360 (reusable component)
├── Results Dashboard
├── Export Functionality
└── Progress Tracking
```

### Key Features
- **Progressive Loading:** Images loaded on-demand
- **Touch Support:** Mobile-friendly interactions  
- **Performance Monitoring:** Real-time metrics
- **Data Persistence:** Local storage backup
- **Export Capability:** CSV download

## Justifikasi Akademis

### Hipotesis
36 gambar memberikan optimal balance antara:
- Visual quality
- Loading performance  
- User satisfaction
- Business ROI

### Variabel
- **Independent:** Jumlah gambar (10, 18, 24, 36)
- **Dependent:** User satisfaction metrics
- **Control:** Same product, same viewing conditions

### Metodologi
- Within-subject design
- Counterbalanced presentation
- Quantitative + qualitative measurement
- Statistical significance testing

## Implementasi Produksi

Setelah eksperimen selesai, konfigurasi 36 gambar akan diimplementasikan di:

1. **Homepage 360° Showcase**
   - File: `src/app/page.tsx`
   - Component: `ImageViewer360`

2. **Product Detail Pages**
   - File: `src/app/product/[id]/page.tsx`
   - Component: `ProductMediaViewer`

3. **Dashboard Upload**
   - File: `src/components/Image360Uploader.tsx`
   - Validation: 36 images required

## Development Notes

### Performance Optimizations
- Image compression (JPEG, 85% quality)
- Progressive loading strategy
- CDN caching
- Service worker implementation

### Browser Support
- Chrome 90+
- Firefox 88+  
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

### Accessibility
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode
- Reduced motion preferences

## Troubleshooting

### Common Issues

**Slow Loading:**
- Check image optimization
- Verify CDN configuration
- Monitor network throttling

**Choppy Animation:**  
- Increase drag sensitivity
- Optimize image preloading
- Check hardware acceleration

**Mobile Issues:**
- Test touch event handling
- Verify viewport configuration
- Check responsive layouts

### Debug Mode
Add `?debug=true` to URL untuk debug information:
- Loading times per image
- Memory usage
- Frame rate monitoring
- Touch/mouse event logging

## Contribution

### Running Tests
```bash
npm test                    # Unit tests
npm run test:e2e           # End-to-end tests
npm run test:performance   # Performance tests
```

### Code Quality
```bash
npm run lint               # ESLint
npm run type-check         # TypeScript
npm run format             # Prettier
```

## Contact

Untuk pertanyaan terkait eksperimen atau implementasi:
- **Email:** [your-email]
- **Repository:** [repository-link]
- **Documentation:** `/EXPERIMENT_DOCUMENTATION.md`
