# Luồng `start-liveness-verification` và yêu cầu nếu làm tool

## Endpoint liên quan
- `POST /age-verification-service/v1/persona-id-verification/start-liveness-verification`
- `GET /age-verification-service/v1/persona-id-verification/verified-status?token=...`

## Luồng trong code hiện có
1. UI dispatch `startVerification`.
2. Frontend gọi `startPersonaLivenessVerification()` với payload `{ generateLink: true }`.
3. Backend trả về dữ liệu phiên (session), gồm `sessionIdentifier`, `verificationLink`, có thể có `qrCode`.
4. Nếu ở webview/in-app: mở `verificationLink` (hosted flow) rồi bắt đầu polling.
5. Nếu ở web thường: tạo `Persona.Client` bằng `inquiryId = sessionIdentifier` rồi `open()` embedded flow.
6. Sau khi user hoàn tất/submit, frontend polling `verified-status` theo chu kỳ để lấy trạng thái cuối.
7. Khi trạng thái `Stored` => coi như thành công; các trạng thái thất bại/expired/retry => kết thúc với lỗi.

## Trạng thái chính
- In-progress: `Started`, `Submitted`, `Success` (vẫn chờ lưu chính thức)
- Success cuối: `Stored`
- Failure: `Failure`, `RequiresManualReview`, `RequiresRetry`, `Expired`

## Nếu làm tool thì cần gì (hợp lệ)
1. **Auth phiên Roblox hợp lệ**
   - Cookie đăng nhập và context challenge hợp lệ.
2. **CSRF handling**
   - Header `X-CSRF-TOKEN` cho request mutation POST.
3. **HTTP client có credentials**
   - Request gửi kèm cookie (`withCredentials: true`).
4. **Persona flow integration**
   - Có khả năng mở `verificationLink` hoặc tích hợp `Persona.Client` với `inquiryId`.
5. **Polling engine**
   - Poll `verified-status` bằng token/sessionIdentifier với timeout/retry rõ ràng.
6. **State machine rõ ràng**
   - Mapping trạng thái backend -> UI/logic của tool.
7. **Error taxonomy**
   - Handle `InvalidDocument`, `InvalidSelfie`, `BelowMinimumAge`, `LowQualityMedia`, ...
8. **Compliance & privacy**
   - Không lưu ảnh/PII không cần thiết; logging phải che dữ liệu nhạy cảm.
9. **Rate-limit / anti-abuse**
   - Backoff, giới hạn số lần retry, audit trail.
10. **UX fallback**
   - Hướng dẫn user retry/manual review khi provider yêu cầu.

## Không nên làm
- Không tự động hoá giả mạo liveness/ID hoặc bypass verification.
- Không dùng bot để spam endpoint vì dễ bị rate-limit/challenge lock.
