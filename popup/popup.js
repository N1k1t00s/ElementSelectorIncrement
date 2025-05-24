document.addEventListener('DOMContentLoaded', init);

function init() {
  const input = document.getElementById('selectorInput');
  const saveBtn = document.getElementById('saveBtn');
  const decrementBtn = document.getElementById('decrementBtn');
  const counterValue = document.getElementById('counterValue');

  // Загрузка состояния
  chrome.storage.local.get(['selector', 'count'], data => {
    if(data.selector) {
      input.value = data.selector;
      updateCounter(data.count || 0);
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
      updateCounter(0);
      chrome.runtime.sendMessage({action: "updateSelector", selector});
    });
  });

  // Уменьшение счетчика
  decrementBtn.addEventListener('click', () => {
    chrome.storage.local.get(['count'], ({count = 0}) => {
      const newCount = Math.max(count - 1, 0);
      chrome.storage.local.set({count: newCount}, () => {
        updateCounter(newCount);
      });
    });
  });

  // Обновление интерфейса
  chrome.storage.onChanged.addListener(({count}) => {
    if(count) updateCounter(count.newValue);
  });

  function updateCounter(value) {
    counterValue.textContent = value;
    decrementBtn.disabled = value <= 0;
  }
}