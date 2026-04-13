const statusEl = document.getElementById('status');
const refreshBtn = document.getElementById('refreshBtn');

async function loadStatus() {
  statusEl.textContent = 'Đang tải...';
  try {
    const res = await fetch('/api/status');
    const data = await res.json();
    statusEl.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    statusEl.textContent = `Lỗi: ${error.message}`;
  }
}

refreshBtn.addEventListener('click', loadStatus);
loadStatus();
