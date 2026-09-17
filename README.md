[README_V2.md](https://github.com/user-attachments/files/28101095/README_V2.md)
# mes-batch-uploader# MES QR Scanner Pro - Integrated Version

## 🎉 Version 2.0 - IoT Modal Enhanced

### ✨ Tính năng mới

#### 🔍 **IoT Machine Modal V2.0**
- ✅ Tự động lấy số opserial từ package
- ✅ Luôn bỏ qua opserial 1 (bắt đầu từ 2)
- ✅ Dropdown Type (FA/QA) cho từng máy
- ✅ Nút Random chọn tự động
- ✅ Validation chặt chẽ
- ✅ Log chi tiết với timestamp

#### 🧪 **Test Local Mode**
- ✅ Tự động tắt Cloudflare Turnstile khi chạy localhost
- ✅ Không cần xác thực để test
- ✅ Dễ dàng debug và phát triển

---

## 🚀 Quick Start

### **Test Local (Không cần xác thực)**

#### **Cách 1: Mở file trực tiếp**
```
Double-click: index.html
```

#### **Cách 2: Dùng Live Server (Khuyến nghị)**
```bash
# VS Code: Right-click → Open with Live Server

# Python:
python -m http.server 8000

# Node.js:
npx http-server -p 8000
```

Sau đó mở: `http://localhost:8000/index.html`

---

## 📚 Tài liệu

### **Hướng dẫn nhanh:**
- 📖 [`QUICK_START.md`](QUICK_START.md) - Test local trong 2 phút
- 🧪 [`LOCALHOST_TESTING.md`](LOCALHOST_TESTING.md) - Chi tiết test local

### **IoT Modal V2.0:**
- 📋 [`SUMMARY_CHANGES.md`](SUMMARY_CHANGES.md) - Tóm tắt thay đổi
- 📝 [`CHANGELOG_IOT_MODAL_V2.md`](CHANGELOG_IOT_MODAL_V2.md) - Chi tiết thay đổi
- 📖 [`GUIDE_IOT_MODAL_V2.md`](GUIDE_IOT_MODAL_V2.md) - Hướng dẫn sử dụng

### **Debug:**
- 🔍 [`DEBUG_IOT_MODAL.md`](DEBUG_IOT_MODAL.md) - Hướng dẫn debug

---

## 🎯 Tính năng chính

### **1. Quét QR và gửi lệnh**
- Quét mã QR từ camera hoặc nhập thủ công
- Gửi lệnh FA/QA đến máy IoT
- Theo dõi tiến độ real-time

### **2. Chọn máy IoT thông minh**
- Lấy danh sách máy từ IoT Status API
- Tự động lọc theo Factory
- Random chọn máy nhanh chóng
- Gán opserial tự động (bỏ qua opserial 1)

### **3. Quản lý Package nâng cao**
- Xem chi tiết operations
- Quét IoT status cho từng operation
- Gửi lệnh hàng loạt
- Xóa máy khỏi package

### **4. Log chi tiết**
- Timestamp đầy đủ với milliseconds
- Phân loại rõ ràng: INFO, SUCCESS, ERROR, WARNING
- Console.log đồng bộ để debug

---

## 🔐 Bảo mật

### **Cloudflare Turnstile**
- ✅ Tự động bật trên production
- ✅ Tự động tắt trên localhost
- ✅ Token refresh tự động
- ✅ Validation chặt chẽ

### **API Key**
- ✅ Không lưu trong localStorage
- ✅ Không log ra console
- ✅ Chỉ gửi qua HTTPS

---

## 🛠️ Công nghệ

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Security:** Cloudflare Turnstile
- **APIs:** 
  - MES QR Scanner API
  - IoT Status API
  - Module Requests API
  - Package API

---

## 📊 Workflow

```
1. Nhập API Key
   ↓
2. Chọn Factory và Package
   ↓
3. Chọn máy IoT:
   - Tự động lấy số opserial từ package
   - Lọc theo Factory
   - Random hoặc chọn thủ công
   - Chọn Type (FA/QA)
   ↓
4. Gửi lệnh:
   - Validation số lượng
   - Format: opserial,MCID,Type
   - Bỏ qua opserial 1
   ↓
5. Theo dõi kết quả:
   - Log chi tiết
   - Progress bar
   - Statistics
```

---

## 🚨 Quy tắc quan trọng

### **⚠️ LUÔN BỎ QUA OPSERIAL 1**
- Package có 25 operations → 24 khả dụng
- Output bắt đầu từ opserial 2
- Không bao giờ gán máy vào opserial 1

---

## 🧪 Testing

### **Test Local:**
```bash
# Mở file với localhost URL
# Widget Turnstile tự động ẩn
# Không cần xác thực
```

### **Test Production:**
```bash
# Deploy lên server
# Widget Turnstile tự động hiện
# Phải xác thực mới dùng được
```

---

## 📝 Changelog

### **Version 2.0 (21/05/2026)**
- ✅ IoT Modal V2.0 với nhiều cải tiến
- ✅ Tự động lấy số opserial từ package
- ✅ Dropdown Type thay vì nút riêng lẻ
- ✅ Nút Random chọn tự động
- ✅ Log chi tiết với timestamp
- ✅ Validation chặt chẽ hơn

### **Version 1.2**
- ✅ Cloudflare Turnstile integration
- ✅ Package management modal
- ✅ IoT scan functionality
- ✅ Batch operations

---

## 🆘 Troubleshooting

### **Vấn đề thường gặp:**

#### **1. Widget Turnstile không ẩn khi test local**
→ Kiểm tra URL phải là `localhost` hoặc `127.0.0.1`

#### **2. CORS Error**
→ Dùng Live Server thay vì mở file trực tiếp

#### **3. API trả về 403/401**
→ Kiểm tra API Key và Turnstile token

#### **4. Chọn quá nhiều máy**
→ Kiểm tra số opserial khả dụng

---

## 📞 Support

Nếu gặp vấn đề:
1. Mở Console (F12)
2. Copy toàn bộ log
3. Mô tả vấn đề chi tiết
4. Gửi cho AI để được hỗ trợ

---

## 📄 License

Copyright © 2026 MES QR Scanner Pro

---

## 👨‍💻 Author

Developed with ❤️ by Kiro AI Assistant

---

## 🎉 Enjoy!

Happy coding! 🚀
