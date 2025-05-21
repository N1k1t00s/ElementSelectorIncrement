let currentSelector = null;
let count = 0;

// Инициализация
chrome.storage.local.get(['selector', 'count'], data => {
  currentSelector = data.selector;
  count = data.count || 0;
});

// Обработчик сообщений
chrome.runtime.onMessage.addListener(msg => {
  if(msg.action === "updateSelector") {
    currentSelector = msg.selector;
    count = 0;
    chrome.storage.local.set({count: 0});
  }
});

// Отслеживание кликов
document.addEventListener('click', e => {
  if(!currentSelector) return;
  
  try {
    const element = document.querySelector(currentSelector);
    if(element && element.contains(e.target)) {
      count++;
      chrome.storage.local.set({count});
      element.style.outline = '2px solid red';
    }
  } catch(error) {
    console.error('Ошибка:', error);
  }
});