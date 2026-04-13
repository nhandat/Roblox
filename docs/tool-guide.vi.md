# Hướng dẫn làm tool cho luồng Persona Liveness (Roblox)

> Mục tiêu: xây một tool **hợp lệ** để điều phối luồng xác minh (không bypass, không giả mạo), dựa trên endpoint:
> - `POST /age-verification-service/v1/persona-id-verification/start-liveness-verification`
> - `GET /age-verification-service/v1/persona-id-verification/verified-status`

## 1) Tool này nên làm gì?
Tool đóng vai trò orchestration layer:
1. Khởi tạo phiên liveness.
2. Điều hướng user qua Persona hosted/embedded flow.
3. Poll trạng thái xác minh.
4. Trả kết quả cuối + hướng dẫn retry/manual review.

## 2) Phạm vi khuyến nghị
- ✅ Nên làm: điều phối API, quản lý trạng thái, UI progress, error handling.
- ❌ Không nên làm: tự động hoá giả mạo liveness, vượt challenge, spam endpoint.

## 3) Kiến trúc tối thiểu
- `apiClient`
  - `startLivenessVerification()`
  - `getVerificationStatus(token)`
- `verificationStateMachine`
  - trạng thái: `Init -> Loading -> Challenge -> Polling -> Completed/Cancelled`
- `personaAdapter`
  - hosted link (webview) hoặc Persona embedded client
- `pollingWorker`
  - interval + max retries + timeout + backoff
- `ui`
  - màn hình loading/challenge/result
- `telemetry`
  - log event + metrics + trace id

## 4) Input/Output contract gợi ý
### Start verification
- Request: `POST .../start-liveness-verification`
- Body: `{ "generateLink": true }`
- Response (kỳ vọng):
  - `sessionIdentifier`
  - `verificationLink`
  - `qrCode` (tuỳ trường hợp)
  - `daysUntilNextVerification`

### Poll status
- Request: `GET .../verified-status?token=<sessionIdentifier>`
- Response:
  - `sessionStatus`
  - `sessionErrorCode`

## 5) Mapping trạng thái backend -> trạng thái tool
- `Started`, `Submitted`, `Success` -> giữ `Polling`
- `Stored` -> `Completed(success)`
- `Failure`, `RequiresRetry`, `RequiresManualReview`, `Expired` -> `Completed(error)`

## 6) Security checklist (bắt buộc)
1. Dùng session/cookie hợp lệ và context challenge đúng.
2. Gửi `X-CSRF-TOKEN` cho mutation POST.
3. Không log PII thô (ảnh giấy tờ/selfie).
4. Mã hoá dữ liệu nhạy cảm ở rest/in-transit.
5. Giới hạn retry, có backoff để tránh bị lock/rate-limit.
6. Có audit log cho hành động quan trọng.

## 7) Kế hoạch triển khai (MVP)
### Milestone 1: API wrapper
- Viết module gọi `start-liveness-verification` và `verified-status`.
- Chuẩn hoá lỗi theo taxonomy (`InvalidDocument`, `InvalidSelfie`, ...).

### Milestone 2: State machine
- Cài đặt reducer/statechart cho toàn bộ lifecycle.
- Unit test chuyển trạng thái theo response thật.

### Milestone 3: Persona integration
- Hosted flow: mở `verificationLink` ở tab/webview.
- Embedded flow: gắn Persona Client với `inquiryId=sessionIdentifier`.

### Milestone 4: Polling + timeout
- Poll mỗi X giây với max N lần.
- Dừng poll khi `Stored` hoặc trạng thái fail terminal.

### Milestone 5: UX + observability
- UI hiển thị tiến trình, lỗi, retry action.
- Metrics: start success rate, completion rate, timeout rate, retry rate.

## 8) Test plan gợi ý
- Unit test: mapping status, timeout, retry logic.
- Integration test: mock API 200/4xx/5xx và validate state transitions.
- E2E test: happy path + manual review path + expired path.

## 9) Definition of Done
- Start + poll chạy ổn định trên web và webview.
- Trạng thái terminal xử lý đúng (success/failure/retry/review/expired).
- Không lộ dữ liệu nhạy cảm trong log.
- Có dashboard tối thiểu theo dõi funnel xác minh.
