function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notif-${type}`;
  notification.innerText = message;

  const container = document.querySelector('.notifications-container');
  if (container) {
    container.appendChild(notification);

    setTimeout(() => {
      container.removeChild(notification);
    }, 3000);
  } else {
    console.error('Контейнер уведомлений не найден');
  }
}