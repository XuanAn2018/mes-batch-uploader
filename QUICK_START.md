# ⚡ Quick Start - Test Local trong 2 phút

## 🎯 Mục tiêu
Test ứng dụng trên localhost **KHÔNG CẦN** xác thực Cloudflare Turnstile

---

## 🚀 Cách 1: Mở file trực tiếp (Nhanh nhất)

### **1 bước duy nhất:**
```
Double-click vào file: index.html
```

### **Kết quả:**
- ✅ Widget Turnstile tự động ẩn
- ✅ Nút "🚀 BẮT ĐẦU (Localhost)" đã enable
- ✅ Sẵn sàng test!

### **⚠️ Lưu ý:**
Có thể gặp CORS error với một số API

---

## 🚀 Cách 2: Dùng Live Server (Khuyến nghị)

### **Nếu có VS Code:**

#### **Bước 1: Cài Live Server**
1. Mở VS Code
2. Extensions (Ctrl+Shift+X)
3. Tìm "Live Server"
4. Install

#### **Bước 2: Chạy**
1. Right-click vào `index.html`
2. Chọn "Open with Live Server"
3. Done! ✅

---

### **Nếu có Python:**

```bash
# Mở terminal trong thư mục project
python -m http.server 8000

# Mở trình duyệt:
# http://localhost:8000/index.html
```

---

### **Nếu có Node.js:**

```bash
# Cài đặt (chỉ 1 lần)
npm install -g http-server

# Chạy
http-server -p 8000

# Mở trình duyệt:
# http://localhost:8000/index.html
```

---

## ✅ Kiểm tra nhanh

### **Dấu hiệu thành công:**
1. ✅ URL: `http://localhost:xxxx` hoặc `http://127.0.0.1:xxxx`
2. ✅ Widget Turnstile **KHÔNG HIỂN THỊ**
3. ✅ Nút hiển thị: **"🚀 BẮT ĐẦU (Localhost)"**
4. ✅ Nút đã enable (không bị disable)

### **Test trong Console (F12):**
```javascript
isLocalhost
// Phải trả về: true
```

---

## 🧪 Test ngay

1. ✅ Nhập API Key
2. ✅ Chọn Factory và Package
3. ✅ Nhấn "🔍 Chọn máy IoT"
4. ✅ Test các chức năng

---

## 🚨 Gặp vấn đề?

### **Vẫn thấy Widget Turnstile?**
→ Kiểm tra URL phải là `localhost` hoặc `127.0.0.1`

### **Nút vẫn bị disable?**
→ Trong Console (F12), gõ:
```javascript
isLocalhost = true;
btnRun.disabled = false;
btnRun.innerHTML = "🚀 BẮT ĐẦU (Localhost)";
document.getElementById('turnstileWidget').style.display = 'none';
```

### **CORS Error?**
→ Dùng Live Server (Cách 2) thay vì mở file trực tiếp

---

## 📚 Đọc thêm

- **Chi tiết:** `LOCALHOST_TESTING.md`
- **Hướng dẫn IoT Modal:** `GUIDE_IOT_MODAL_V2.md`
- **Changelog:** `CHANGELOG_IOT_MODAL_V2.md`

---

## 🎉 Xong!

Giờ bạn có thể test thoải mái mà không cần xác thực Turnstile! 🚀

**Lưu ý:** Khi deploy lên production, Turnstile sẽ tự động bật lại.
