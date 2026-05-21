# 🔍 Hướng Dẫn Debug Modal "Chọn máy IoT"

## Vấn đề đã được sửa

### ✅ Đã sửa 3 vấn đề chính:

1. **Thiếu element `iotModalCount`** 
   - Đã thêm element hiển thị số lượng máy tìm thấy
   - Vị trí: Ngay trên bảng danh sách máy

2. **Modal mở ngay cả khi API lỗi**
   - Đã thêm kiểm tra và thông báo lỗi rõ ràng
   - Modal chỉ mở khi có dữ liệu hợp lệ

3. **Thiếu thông tin debug**
   - Đã thêm console logging chi tiết
   - Đã thêm hàm test API: `window.testIoTAPI()`

---

## 🧪 Cách kiểm tra

### Bước 1: Mở file HTML trong trình duyệt
```
Mở file: index.html
```

### Bước 2: Mở Developer Console
- **Chrome/Edge**: `F12` hoặc `Ctrl+Shift+I`
- **Firefox**: `F12` hoặc `Ctrl+Shift+K`

### Bước 3: Nhập API Key và Package ID
1. Nhập API Key vào ô "API Key"
2. Nhập Package ID vào ô "Package ID"

### Bước 4: Test API trực tiếp (Tùy chọn)
Trong Console, gõ:
```javascript
testIoTAPI()
```

Kết quả sẽ hiển thị:
- ✅ URL API được gọi
- ✅ Response status
- ✅ Dữ liệu trả về (JSON)
- ✅ Số lượng máy
- ✅ Mẫu dữ liệu máy đầu tiên

### Bước 5: Nhấn nút "🔍 Chọn máy IoT"
Quan sát:
- Log trong console
- Thông báo lỗi (nếu có)
- Modal có mở không
- Dữ liệu có hiển thị không

---

## 🔎 Các trường hợp lỗi có thể xảy ra

### Lỗi 1: API Key không đúng
**Triệu chứng:**
```
❌ IoT Status API lỗi: {"success":false,"error":"Invalid API Key"}
```

**Giải pháp:**
- Kiểm tra lại API Key
- Đảm bảo không có khoảng trắng thừa

### Lỗi 2: API endpoint không phản hồi
**Triệu chứng:**
```
❌ Fetch error: TypeError: Failed to fetch
```

**Giải pháp:**
- Kiểm tra kết nối mạng
- Kiểm tra API endpoint: `https://iot-status.vercel.app/`
- Thử truy cập trực tiếp trong trình duyệt

### Lỗi 3: API trả về dữ liệu nhưng không đúng format
**Triệu chứng:**
```
❌ JSON parse error
```

**Giải pháp:**
- Chạy `testIoTAPI()` để xem raw response
- Kiểm tra format JSON trả về
- Có thể API đã thay đổi format

### Lỗi 4: API trả về thành công nhưng không có dữ liệu
**Triệu chứng:**
```
⚠️ API trả về thành công nhưng không có dữ liệu máy nào.
```

**Giải pháp:**
- Kiểm tra filter (Factory, Line, Status)
- Có thể không có máy nào trong hệ thống
- Kiểm tra quyền truy cập của API Key

---

## 📊 Cấu trúc dữ liệu API mong đợi

API cần trả về JSON với format:
```json
{
  "success": true,
  "data": [
    {
      "MachineId": "60:01:94:3A:74:B5",
      "MacAddress": "60:01:94:3A:74:B5",
      "Factory": "P2C1",
      "Line": "Line 01",
      "CurrentStatus": "ONLINE",
      "IotStatus": "ON",
      "CurrOutput": 150,
      "MotoTime": 3600,
      "LastTeaching": "2024-01-15 10:30:00",
      "MXPACKAGE": "PKG001"
    }
  ]
}
```

---

## 🛠️ Debug nâng cao

### Kiểm tra element tồn tại
```javascript
console.log('Modal:', document.getElementById('iotMachineModal'));
console.log('Count:', document.getElementById('iotModalCount'));
console.log('Table Body:', document.getElementById('iotMachineTableBody'));
console.log('Empty:', document.getElementById('iotModalEmpty'));
```

### Kiểm tra dữ liệu toàn cục
```javascript
console.log('iotModalData:', iotModalData);
console.log('iotModalFilteredData:', iotModalFilteredData);
```

### Mở modal thủ công
```javascript
openIotMachineModal();
```

### Render lại bảng
```javascript
renderIotMachineTable(iotModalData);
```

---

## 📝 Ghi chú

- Tất cả các thay đổi đã được thêm logging chi tiết
- Mọi lỗi sẽ hiển thị alert và log trong console
- Modal chỉ mở khi có dữ liệu hợp lệ
- Đã thêm element hiển thị số lượng máy

---

## 🆘 Nếu vẫn gặp vấn đề

1. Chụp màn hình console log
2. Chạy `testIoTAPI()` và copy kết quả
3. Kiểm tra Network tab trong DevTools
4. Xem request/response của API call
