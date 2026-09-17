# AGENTS.md — MES QR Scanner Pro V3.0

> Tài liệu hướng dẫn cho AI / người dùng mới. Đọc file này để hiểu toàn bộ cấu trúc, luồng xử lý, và cách mở rộng project.

---

## 1. TỔNG QUAN

**MES QR Scanner Pro V3.0** là ứng dụng web single-page (HTML/CSS/JS thuần, không framework)用于 MES (Manufacturing Execution System) — quét QR, gửi lệnh scan tới IoT machines, quản lý packages theo Line/Style/Target.

### Tính năng chính
- **Quét QR thủ công**: Nhập MCID + Package → gửi /scan
- **IoT Machine Modal**: Lấy danh sách máy IoT từ server, lọc, chọn, gửi lệnh hàng loạt
- **Auto-Scan Multi-Package**: Tự động scan nhiều package cùng lúc, phân bổ IoT machines theo round-robin, hỗ trợ FA (First Article) per-package
- **Xem lại / Resume**: Tiếp tục scan từ gói đã dừng giữa chừng

### Tech Stack
- **Frontend**: HTML + CSS + Vanilla JS (single-file `index.html`, ~5000 dòng)
- **Backend API**: Cloudflare Worker proxy (`mes-proxy.chiscoong-cloudflare-com.workers.dev`)
- **Auth**: Cloudflare Turnstile CAPTCHA + session token

---

## 2. CẤU TRÚC FILE

```
├── index.html              ← TOÀN BỘ ứng dụng (HTML + CSS + JS)
├── _test_all.js            ← Test tự động (Node.js, chạy `node _test_all.js`)
├── README.md               ← README chính
├── README_V2.md            ← README chi tiết hơn
├── QUICK_START.md          ← Hướng dẫn nhanh
├── START_HERE.md           ← Điểm bắt đầu cho người mới
├── LOCALHOST_TESTING.md    ← Hướng dẫn test local
├── DEBUG_IOT_MODAL.md      ← Debug IoT Modal
└── AGENTS.md               ← Tài liệu này (cho AI / người mới)
```

**Lưu ý**: Toàn bộ code nằm trong `index.html`. Không có build step, không bundler.

---

## 3. ĐIỂM BẮT ĐẦU — `index.html`

File `index.html` được chia thành 3 phần lớn:

### 3.1. HTML Structure (dòng 1–~1600)
- `<head>`: Styles CSS inline
- `<body>`: Các modal, forms, buttons
  - **Login/Auth modal**: Turnstile CAPTCHA
  - **Main Dashboard**: Package selector, batch process, log
  - **IoT Machine Modal**: Danh sách máy IoT, filter, sort
  - **Auto-Scan Modal**: Quét tự động multi-package
  - **Package Management Modal**: CRUD packages

### 3.2. CSS (dòng ~16–~1600)
- Responsive design, gradient theme
- Styles cho từng modal: Auto-Scan, IoT, Report

### 3.3. JavaScript (dòng ~1600–~5008)
- **Globals & Config** (~1547–1600): API URLs, constants
- **Auth & Session** (~1601–1810): Login, logout, session check
- **API Helpers** (~1785–1810): `apiFetch()` wrapper
- **Package Operations** (~1862–2100): Parse MXPACKAGE, fetch packages
- **Batch Process** (~2118–2200): `runBatchProcess()`, main scan loop
- **Package Management Modal** (~2200–2700): CRUD operations
- **IoT Machine Modal** (~2700–3600): Danh sách máy, filter, sort, batch actions
- **Auto-Scan Module** (~3578–5008): Logic chính của Auto-Scan

---

## 4. API ENDPOINTS

Tất cả requests đi qua Cloudflare Worker proxy:

```
BASE_URL = "https://mes-proxy.chiscoong-cloudflare-com.workers.dev"
```

| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/scan` | GET | Gửi lệnh scan: `?mxpackage=&opserial=&mcid=&processtype=` |
| `/packages` | GET | Lấy danh sách packages: `?factory=&date=` |
| `/opdetails` | GET | Lấy operations của package: `?mxpackage=&mode=operations` |
| `/opdetails` | GET | Lấy summary: `?mxpackage=&mode=summary` |
| `/detail` | GET | Chi tiết machine |
| `/remove-machine` | GET | Xóa machine |
| `/iot-status` | GET | Danh sách IoT machines: `?factory=&...` |
| `/auth/verify` | POST | Xác thực Turnstile token |
| `/auth/validate` | POST | Validate session token |

---

## 5. AUTO-SCAN — LUỒNG XỬ LÝ CHI TIẾT

Đây là tính năng quan trọng nhất. Luồng xử lý gồm 5 bước:

### 5.1. Mở Modal → Load Packages
```
openAutoScanModal() → loadAutoScanPackages()
```
- Gọi API `/packages?factory=...&date=...`
- Tự động tích chọn các package đủ điều kiện (Target ≥ minTarget, chưa chạy xong)
- Hiển thị danh sách package với checkbox

### 5.2. User Chọn Package & Config
- **Chọn package**: Tick checkbox (manual selection được bảo vệ khi đổi quy tắc)
- **Quy tắc**:
  - `Bỏ qua Target < X`: Tự bỏ package có Target < ngưỡng
  - `FA/Pkg`: Số máy FA tối đa mỗi package (mặc định 1)
  - `FA ≤ % Target`: Ngưỡng CurrOutput để máy đó là FA candidate (mặc định 50%)
  - `Round-Robin`: Phân bổ đều IoT theo vòng tròn
- **Bộ lọc IoT** (4 checkbox): CurrOutput>0, MotoTime>0, MXPACKAGE trống, Factory khớp

### 5.3. Bắt Đầu → Chuẩn Bị Dữ Liệu
```
startAutoScanPipeline()
```
**Bước 1**: Load IoT machines
- Gọi API `/iot-status?factory=...`
- Lọc theo 4 điều kiện (từ checkbox bộ lọc)

**Bước 2**: Với mỗi package được chọn, lấy danh sách opserial
```
fetchAutoScanOperations(pkgId) → API /opdetails?mxpackage=...&mode=operations
```
- **Lọc bỏ opserial = 1** (luôn bắt đầu từ 2)
- **Lọc bỏ opserial đã chạy** (từ history localStorage)

### 5.4. Xây Dựng Kế Hoạch (buildAutoScanPlan)
```javascript
buildAutoScanPlan(pkgTasks, pool, roundRobin, faPerPkg, faPercent)
```

**Logic 2 giai đoạn:**

#### Giai đoạn 1: Gửi FA (mỗi package đúng 1 lần)
```
Duyệt từng package:
  → Tìm máy FA đầu tiên: CurrOutput > 0 && CurrOutput ≤ Target × faRatio
  → Gán vào opserial[0] của package đó, Type = 'FA'
  → Đánh dấu faUsedPerPkg[pkgId] = 1
  → Xóa máy đó khỏi pool available
```

#### Giai đoạn 2: Scan thường (round-robin)
```
States = mỗi package có danh sách opserial còn lại (đã bỏ opserial[0] nếu có FA)
Round-robin:
  Mỗi vòng: duyệt qua tất cả packages, mỗi package lấy 1 máy từ pool
  → Type = rỗng (không phải FA)
  → Tiếp tục cho đến khi hết máy hoặc hết opserial
```

**Output**: Mảng `plan[]` với mỗi phần tử:
```javascript
{
    pkgId: "M_OSP-0689_1_OSP1429RGL014001_01_02",
    lineName: "LINE03",
    target: 114,
    opserial: 2,
    mcid: "M10008887",
    type: "FA",       // hoặc "" cho scan thường
    currOutput: 45,
    motoTime: 120,
    factory: "FAC-C",
    mxpackage: ""     // trống = máy khả dụng
}
```

### 5.5. Gửi API Theo Kế Hoạch
```
Duyệt từng phần tử trong plan[]:
  → Gọi /scan?mxpackage=...&opserial=...&mcid=...&processtype=FA
  → Delay 1–2.5s giữa mỗi request (random)
  → Nếu OK: đánh dấu done trong history, cập nhật report
  → Nếu FAIL: ghi log lỗi
```

### 5.6. History & Resume
- **History**: Lưu trong `localStorage` key `autoScanHistory`
  ```javascript
  {
      "packageId": {
          opserials: { "2": true, "3": true, ... },
          total: 92,
          faDone: { opserial: "2", mcid: "M10008887", currOutput: 45 }
      }
  }
  ```
- **Resume**: Khi dừng giữa chừng, nút "Tiếp Tục" hiện ra
  - Check FA history: nếu package đã có FA → không gán FA lại (effectiveFaPerPkg = 0)
  - Lọc bỏ opserial đã done
  - Chạy tiếp pipeline từ đầu

---

## 6. BIẾN GLOBAL QUAN TRỌNG

```javascript
// API (dòng ~1547)
const BASE_URL = "https://mes-proxy.chiscoong-cloudflare-com.workers.dev";
const API_ENDPOINT = `${BASE_URL}/scan`;
const MODULE_API = `${BASE_URL}/opdetails`;
const PACKAGE_API = `${BASE_URL}/packages`;
const IOT_STATUS_API = `${BASE_URL}/iot-status`;

// Auto-Scan State (dòng ~3578)
let autoScanRunning = false;
let autoScanAbortController = null;
let autoScanPackages = [];             // danh sách packages load từ server
let autoScanSelectedIds = new Set();   // các package được tick chọn
let autoScanManuallySelected = new Set(); // package user tự tick (bảo vệ khi đổi quy tắc)
let autoScanIotPool = [];              // pool IoT machines đủ điều kiện
let autoScanPlan = [];                 // kế hoạch phân bổ
let asReport = {};                     // số liệu báo cáo { rows: {}, skipped: [] }
```

---

## 7. LƯU Ý KHI MỞ RỘNG

### 7.1. Thêm điều kiện lọc IoT mới
- Thêm checkbox UI trong section "Bộ lọc IoT"
- Thêm getter function (VD: `getAutoScanFilterXxx()`)
- Áp dụng trong `startAutoScanPipeline` khi lọc `eligibleIot`
- Áp dụng trong `resumeAutoScanPipeline` (copy logic tương tự)

### 7.2. Thêm field mới vào plan
- Thêm field trong `buildAutoScanPlan` (dòng ~4018)
- Cập nhật `addAutoScanRow()` nếu cần hiển thị
- Cập nhật report modal trong `showAutoScanReport()`

### 7.3. Thay đổi logic FA
- Sửa `buildAutoScanPlan()` — đặc biệt phần Giai đoạn 1
- Cập nhật `faPerPkg`, `faRatio` logic
- Cập nhật resume logic trong `resumeAutoScanPipeline()`

### 7.4. Test
- Chạy `node _test_all.js` để kiểm tra nhanh
- Test mock DOM đã được setup sẵn trong file test
- Nếu thêm element mới, cần thêm stub trong mock DOM

---

## 8. FLOW TÓM TẮT

```
User mở Auto-Scan Modal
    │
    ├─ Load packages từ server (filter theo Factory + Date)
    ├─ User tick chọn package + config quy tắc
    │
    ├─ Nhấn "Bắt Đầu"
    │   │
    │   ├─ Load IoT machines từ server (filter 4 điều kiện)
    │   ├─ Với mỗi package: lấy opserials (>1, bỏ đã chạy)
    │   │
    │   ├─ buildAutoScanPlan():
    │   │   ├─ Giai đoạn 1: Gửi FA mỗi package 1 lần
    │   │   └─ Giai đoạn 2: Round-robin scan thường
    │   │
    │   └─ Gửi API /scan theo plan (delay 1–2.5s/request)
    │
    ├─ Lưu history vào localStorage
    ├─ Hiển thị báo cáo
    │
    └─ Nếu dừng → Nút "Tiếp Tục" hiện → resumeAutoScanPipeline()
```

---

## 9. TEST

```bash
node _test_all.js
```

Các test cases:
1. Gửi đúng số request theo plan
2. Chỉ dùng 1 FA per package
3. Không dùng FA nếu package không đủ điều kiện
4. Không bao giờ dùng opserial 1
5. Báo cáo ghi đúng OK/FAIL theo package
6. History lưu đúng, lần 2 bỏ qua package đã xong

---

## 10. DEPLOY

```bash
git init
git add .
git commit -m "MES QR Scanner Pro V3.0 - Auto-Scan"
git remote add origin https://github.com/xuanan2018/test.git
git push -u origin main
```
