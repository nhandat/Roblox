# Hướng dẫn chạy nhanh (Tiếng Việt)

## 1) Chạy project
Trong thư mục repo, chạy:

```bash
npm start
```

Nếu thấy output như sau là chạy thành công:

- `✅ Playground started`
- `Token: mock-xsrf-token`
- `window.Roblox ready: true`

## 2) Ý nghĩa
Project này là **source-map dump** nên không có runtime nội bộ của Roblox.
Vì vậy bản hiện tại chạy theo **mock runtime local** để bạn có thể phân tích code.

## 3) Muốn chỉnh behavior thì sửa ở đâu?
- `playground/entry.local.js`
- `playground/xsrfTokenHeaderInjector.local.js`
- `playground/xsrfTokenFormInjector.local.js`
- `mocks/externals.js`
- `mocks/xsrfToken.js`

Sau khi sửa, chạy lại:

```bash
npm start
```

## 4) Kiểm tra nhanh token header giả lập
Bạn có thể chạy:

```bash
node -e "import('./playground/xsrfTokenHeaderInjector.local.js').then(m=>console.log(m.default.handleAjaxSend({type:'POST',url:'/v1/test'})))"
```

Kỳ vọng in ra object có key `X-CSRF-TOKEN`.
