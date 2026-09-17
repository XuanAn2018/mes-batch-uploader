# FAVICON.md — Hướng dẫn tạo Icon Biểu trưng (Favicon)

---

## 1. FAVICON LÀ GÌ?

Favicon là icon nhỏ hiển thị trên:
- **Tab trình duyệt** (bên cạnh tiêu đề trang)
- **Bookmark** (đánh dấu trang)
- **Thanh địa chỉ** (URL bar)

Kích thước tiêu chuẩn: **16x16px**, **32x32px**, **48x48px**

---

## 2. HƯỚNG DẪN CHO NGƯỜI DÙNG

### Cách nhanh nhất (không cần biết code)

**Bước 1**: Vào 1 trong 2 trang sau:
- https://favicon.io — Tạo favicon miễn phí từ text, emoji, hoặc upload ảnh
- https://realfavicongenerator.net — Tạo favicon đa thiết bị (đầy đủ kích thước)

**Bước 2**: Tải file về,解 nén

**Bước 3**: Copy file `favicon.ico` (hoặc `favicon.png`) vào cùng thư mục với `index.html`

**Bước 4**: Thêm dòng này vào `<head>` của `index.html`:
```html
<!-- Nếu dùng file .ico -->
<link rel="icon" href="favicon.ico">

<!-- Nếu dùng file .png -->
<link rel="icon" type="image/png" href="favicon.png">

<!-- Nếu dùng file .svg -->
<link rel="icon" type="image/svg+xml" href="favicon.svg">
```

**Bước 5**: Lưu file → Refresh browser → Xem trên tab trình duyệt

### Các định dạng phổ biến

| Định dạng | Ưu điểm | Nhược điểm |
|-----------|---------|------------|
| `.ico` | Hỗ trợ mọi browser, mọi hệ điều hành | Kích thước cố định, không co giãn |
| `.png` | Nén tốt, màu sắc phong phú | Không hỗ trợ animation |
| `.svg` | Co giãn không vỡ, nhẹ, có thể animation | Một số browser cũ không hỗ trợ |
| `.svg` + `.png` fallback | Kết hợp ưu điểm cả hai | Cần thêm 1 file fallback |

---

## 3. HƯỚNG DẪN CHO AI (TẠO FAVICON TỪ ĐẦU)

### Nguyên tắc thiết kế

1. **Đơn giản** — Icon nhỏ nên chi tiết phức tạp sẽ bị mờ
2. **Màu nổi bật** — Nên dùng màu chính của website (theme color)
3. **Dễ nhận dạng** — Phải thấy rõ ngay cả khi 16x16px
4. **Phù hợp mã nguồn** — Icon phải liên quan đến chức năng trang web

### Cách tạo SVG inline (không cần file riêng)

Đây là cách đơn giản nhất, đặt trực tiếp trong `<head>`:

```html
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%23MÀU_NỀN'/%3E%3C!-- Các hình vẽ --%3E%3C/svg%3E">
```

**Lưu ý khi encode SVG sang data URI:**
- Thay `#` bằng `%23`
- Thay `<` bằng `%3C`, `>` bằng `%3E`
- Thay `"` bằng `'`
- Thay `{` bằng `%7B`, `}` bằng `%7D`

### Các loại icon theo chuyên ngành

#### MES / Manufacturing / Factory
```
- Bánh răng, ổ cờ (⚙️) — máy móc
- Conveyor belt — dây chuyền sản xuất
- QR code — mã sản phẩm
- Warehouse — kho hàng
```

#### QR Scanner / Barcode
```
- QR code pattern — họa tiết QR
- Crosshair / Target — tâm scan
- Camera lens — ống kính quét
- Checkmark trong khung — scan thành công
```

#### IoT / Smart Devices
```
- Circuit pattern — mạch điện
- WiFi signal — kết nối không dây
- Sensor icon — cảm biến
- Cloud + device — IoT cloud
```

#### Web App / Dashboard
```
- Chart / Graph — biểu đồ
- Grid layout — bố cục bảng
- Gauge — đồng hồ đo
- Lightning bolt — hiệu suất
```

### Template SVG cơ bản

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <!-- Nền bo tròn -->
  <rect width="64" height="64" rx="12" fill="#4338ca"/>
  
  <!-- Icon chính (tùy chỉnh theo ngành) -->
  <rect x="12" y="12" width="16" height="16" rx="2" fill="white"/>
  <rect x="36" y="12" width="16" height="16" rx="2" fill="white"/>
  <rect x="12" y="36" width="16" height="16" rx="2" fill="white"/>
  
  <!-- Chi tiết nhỏ / accent -->
  <circle cx="44" cy="44" r="4" fill="#fbbf24"/>
</svg>
```

### Color palette gợi ý cho favicon

| Ngành | Màu nền | Màu icon | Mã hex |
|-------|---------|----------|--------|
| MES/Factory | Tím/Đỏ | Trắng | `#4338ca` / `white` |
| Technology | Xanh dương | Trắng | `#2563eb` / `white` |
| Nature/Eco | Xanh lá | Trắng | `#16a34a` / `white` |
| Energy/Power | Cam/Vàng | Trắng | `#f59e0b` / `white` |
| Medical | Xanh ngọc | Trắng | `#0891b2` / `white` |

### Checklist khi tạo favicon

- [ ] Kích thước file < 100KB
- [ ] Dễ nhận dạng ở 16x16px
- [ ] Màu sắc phù hợp theme website
- [ ] Không chứa text dài (chỉ logo/ symbol)
- [ ] Test trên Chrome, Firefox, Edge
- [ ] Test trên mobile (icon bookmark trên iOS/Android)

---

## 4. QUY TRÌNH TẠO FAVICON CHO DỰ ÁN MỚI

```
1. Xác định ngành nghề / chức năng website
   ↓
2. Chọn 1-2 biểu tượng đại diện (symbol)
   ↓
3. Tạo SVG với nền bo tròn + icon chính
   ↓
4. Encode SVG sang data URI
   ↓
5. Thêm <link rel="icon"> vào <head> index.html
   ↓
6. Test trên browser → Điều chỉnh nếu cần
   ↓
7. Commit + Push lên repo
```

---

## 5. VÍ DỤ THỰC TẾ — MES QR Scanner Pro

Favicon hiện tại của dự án này:
- **Nền**: Tím (`#4338ca`) — trùng màu gradient theme
- **Icon**: Họa tiết QR code (3 ô vuông góc + các ô nhỏ)
- **Accent**: Chấm vàng giữa (`#fbbf24`) — biểu tượng scan/hoạt động

Ý nghĩa:
- QR code → Chức năng chính là quét QR
- Màu tím → Đồng bộ với UI (gradient tím-xanh)
- Chấm vàng → Điểm nhấn, dễ nhận dạng trên tab
