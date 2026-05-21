# 🧪 Hướng dẫn Test Local (Tắt Cloudflare Turnstile)

## 🎯 Tổng quan

Code đã được thiết kế sẵn để **TỰ ĐỘNG TẮT** xác thực Cloudflare Turnstile khi chạy trên localhost!

---

## ✅ Cách 1: Mở file HTML trực tiếp (Đơn giản nhất)

### **Bước 1: Mở file**
```
Double-click vào file: index.html
```

### **Bước 2: Kiểm tra URL**
Trình duyệt sẽ mở với URL dạng:
```
file:///C:/Users/{USER}/Downloads/mes-batch-uploader-main/index.html
```

### **Bước 3: Kiểm tra**
- ✅ Widget Turnstile ở góc phải sẽ **TỰ ĐỘNG ẨN**
- ✅ Nút "🚀 BẮT ĐẦU" sẽ hiển thị: **"🚀 BẮT ĐẦU (Localhost)"**
- ✅ Nút đã được enable, không cần xác thực

### **Lưu ý:**
⚠️ Một số API có thể bị CORS error khi chạy từ `file://`

---

## ✅ Cách 2: Dùng Live Server (Khuyến nghị)

### **Bước 1: Cài đặt Live Server**

#### **Option A: VS Code Extension**
1. Mở VS Code
2. Vào Extensions (Ctrl+Shift+X)
3. Tìm "Live Server"
4. Cài đặt extension của Ritwick Dey

#### **Option B: Python HTTP Server**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### **Option C: Node.js http-server**
```bash
# Cài đặt
npm install -g http-server

# Chạy
http-server -p 8000
```

### **Bước 2: Chạy server**

#### **VS Code Live Server:**
1. Right-click vào file `index.html`
2. Chọn "Open with Live Server"
3. Trình duyệt tự động mở: `http://127.0.0.1:5500/index.html`

#### **Python/Node.js:**
1. Mở terminal trong thư mục project
2. Chạy lệnh server (xem bước 1)
3. Mở trình duyệt: `http://localhost:8000/index.html`

### **Bước 3: Kiểm tra**
- ✅ URL: `http://localhost:xxxx` hoặc `http://127.0.0.1:xxxx`
- ✅ Widget Turnstile tự động ẩn
- ✅ Nút "🚀 BẮT ĐẦU (Localhost)" đã enable

---

## 🔍 Cách kiểm tra đã tắt Turnstile chưa

### **1. Kiểm tra giao diện**
- Widget Turnstile ở góc phải **KHÔNG HIỂN THỊ**
- Nút chính hiển thị: **"🚀 BẮT ĐẦU (Localhost)"**
- Nút đã enable (không bị disable)

### **2. Kiểm tra Console**
1. Mở DevTools (F12)
2. Vào tab Console
3. Không thấy lỗi về Turnstile

### **3. Kiểm tra biến**
Trong Console, gõ:
```javascript
isLocalhost
```
Kết quả phải là: `true`

---

## 🛠️ Cách hoạt động (Technical)

### **Code tự động phát hiện localhost:**
```javascript
let isLocalhost = window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1';
```

### **Khi `isLocalhost = true`:**
1. ✅ Widget Turnstile bị ẩn:
   ```javascript
   if(isLocalhost) {
       document.getElementById('turnstileWidget').style.display = 'none';
   }
   ```

2. ✅ Nút "BẮT ĐẦU" được enable:
   ```javascript
   if(isLocalhost) {
       btnRun.disabled = false;
       btnRun.innerHTML = "🚀 BẮT ĐẦU (Localhost)";
   }
   ```

3. ✅ Không gửi token trong API request:
   ```javascript
   if (turnstileToken && !isLocalhost) {
       url += `&cf-turnstile-response=${encodeURIComponent(turnstileToken)}`;
   }
   ```

---

## 🚨 Troubleshooting

### **Vấn đề 1: Vẫn thấy Widget Turnstile**
**Nguyên nhân:** URL không phải localhost

**Giải pháp:**
1. Kiểm tra URL trong address bar
2. Phải là: `http://localhost:xxxx` hoặc `http://127.0.0.1:xxxx`
3. KHÔNG phải: `http://192.168.x.x` hoặc domain khác

**Test:**
```javascript
// Trong Console
console.log(window.location.hostname);
// Phải trả về: "localhost" hoặc "127.0.0.1"
```

---

### **Vấn đề 2: Nút vẫn bị disable**
**Nguyên nhân:** Code không nhận diện localhost

**Giải pháp:**
1. Mở Console (F12)
2. Gõ:
   ```javascript
   isLocalhost
   ```
3. Nếu trả về `false`, kiểm tra lại URL

**Fix thủ công (tạm thời):**
```javascript
// Trong Console
isLocalhost = true;
btnRun.disabled = false;
btnRun.innerHTML = "🚀 BẮT ĐẦU (Localhost)";
document.getElementById('turnstileWidget').style.display = 'none';
```

---

### **Vấn đề 3: CORS Error**
**Hiện tượng:**
```
Access to fetch at '...' from origin 'file://' has been blocked by CORS policy
```

**Nguyên nhân:** Mở file trực tiếp bằng `file://`

**Giải pháp:**
✅ Dùng Live Server (Cách 2)  
✅ Hoặc dùng Python/Node.js HTTP server

---

### **Vấn đề 4: API vẫn yêu cầu token**
**Hiện tượng:** API trả về lỗi 403 hoặc 401

**Nguyên nhân:** Backend vẫn yêu cầu token

**Giải pháp:**
1. Kiểm tra backend có whitelist localhost không
2. Hoặc tạm thời disable validation ở backend
3. Hoặc dùng API Key test

---

## 🎯 Checklist Test Local

### **Trước khi test:**
- [ ] Đã mở file bằng localhost URL
- [ ] Widget Turnstile đã ẩn
- [ ] Nút "BẮT ĐẦU" hiển thị "(Localhost)"
- [ ] Nút đã enable

### **Trong khi test:**
- [ ] Nhập API Key
- [ ] Chọn Package
- [ ] Mở modal "🔍 Chọn máy IoT"
- [ ] Kiểm tra log trong Console
- [ ] Test các chức năng chính

### **Sau khi test:**
- [ ] Kiểm tra không có lỗi trong Console
- [ ] Kiểm tra API calls trong Network tab
- [ ] Kiểm tra dữ liệu trả về đúng

---

## 📊 So sánh Localhost vs Production

| Feature | Localhost | Production |
|---------|-----------|------------|
| Turnstile Widget | ❌ Ẩn | ✅ Hiển thị |
| Xác thực bắt buộc | ❌ Không | ✅ Có |
| Token trong API | ❌ Không gửi | ✅ Gửi |
| Nút "BẮT ĐẦU" | ✅ Luôn enable | 🔒 Cần xác thực |
| CORS | ⚠️ Có thể lỗi | ✅ OK |

---

## 🚀 Deploy lên Production

### **Bước 1: Test kỹ trên localhost**
- Đảm bảo tất cả chức năng hoạt động
- Kiểm tra không có lỗi trong Console

### **Bước 2: Deploy**
- Upload file lên server
- URL phải là domain thật (không phải localhost)

### **Bước 3: Kiểm tra Production**
- ✅ Widget Turnstile hiển thị
- ✅ Nút "BẮT ĐẦU" bị disable ban đầu
- ✅ Phải xác thực mới dùng được

### **Bước 4: Test Turnstile**
1. Hoàn thành xác thực Turnstile
2. Nút "BẮT ĐẦU" được enable
3. Test các chức năng

---

## 💡 Tips

### **Tip 1: Dùng Live Server**
Live Server tự động reload khi bạn sửa code, rất tiện!

### **Tip 2: Mở Console ngay từ đầu**
Để theo dõi log và phát hiện lỗi sớm.

### **Tip 3: Test cả localhost và production**
Đảm bảo code hoạt động ở cả 2 môi trường.

### **Tip 4: Bookmark localhost URL**
Để dễ dàng quay lại test.

### **Tip 5: Dùng Network tab**
Để xem API calls có gửi token hay không.

---

## 🔐 Bảo mật

### **⚠️ QUAN TRỌNG:**
- Localhost mode chỉ dùng để test
- KHÔNG deploy code với `isLocalhost = true` cố định
- Backend vẫn phải validate token ở production

### **Kiểm tra trước khi deploy:**
```javascript
// Đảm bảo code này KHÔNG bị sửa:
let isLocalhost = window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1';

// KHÔNG được hard-code:
// let isLocalhost = true; ❌ SAI!
```

---

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra URL có phải localhost không
2. Kiểm tra Console có lỗi gì
3. Kiểm tra biến `isLocalhost` trong Console
4. Xem phần Troubleshooting ở trên

---

## 🎉 Tóm tắt

### **Để test local:**
1. ✅ Mở file bằng localhost URL
2. ✅ Widget Turnstile tự động ẩn
3. ✅ Nút "BẮT ĐẦU" tự động enable
4. ✅ Test thoải mái không cần xác thực!

### **Khi deploy production:**
1. ✅ Upload file lên server
2. ✅ Widget Turnstile tự động hiện
3. ✅ Xác thực bắt buộc
4. ✅ An toàn và bảo mật!

---

**Happy Testing! 🚀**
