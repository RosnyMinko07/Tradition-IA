/**
 * TRADITION IA - TOAST NOTIFICATION UTILITY
 */

export function showToast(msg, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icon = type === 'error' ? '⚠️' : type === 'info' ? 'ℹ️' : '✨';
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span style="font-size: 1.2rem;">${icon}</span> <div style="font-weight: 500;">${msg}</div>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
