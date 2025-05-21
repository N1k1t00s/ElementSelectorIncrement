document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('selectorInput');
  const saveBtn = document.getElementById('saveBtn');
  const counter = document.getElementById('counter');

  // Загрузка сохраненных данных
  chrome.storage.local.get(['selector', 'count'], data => {
    if(data.selector) {
      input.value = data.selector;
      counter.textContent = `Счёт: ${data.count || 0}`;
    }
  });

  // Сохранение селектора
  saveBtn.addEventListener('click', () => {
    const selector = input.value.trim();
    if(!selector) return;
    
    chrome.storage.local.set({
      selector: selector,
      count: 0
    }, () => {
      counter.textContent = 'Счёт: 0';
      chrome.runtime.sendMessage({action: "updateSelector", selector: selector});
    });
  });

  // Обновление счетчика
  chrome.storage.onChanged.addListener(changes => {
    if(changes.count) {
      counter.textContent = `Счёт: ${changes.count.newValue}`;
    }
  });
});