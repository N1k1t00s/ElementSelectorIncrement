document.addEventListener('DOMContentLoaded', init);

function init() {
  const input = document.getElementById('selectorInput');
  const saveBtn = document.getElementById('saveBtn');
  const decrementBtn = document.getElementById('decrementBtn');
  const resetBtn = document.getElementById('resetBtn');
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

  // Сброс счетчика
  resetBtn.addEventListener('click', () => {
    chrome.storage.local.set({count: 0}, () => {
      updateCounter(0);
    });
  });

  // Обновление интерфейса
  chrome.storage.onChanged.addListener((changes) => {
    if(changes.count) {
      updateCounter(changes.count.newValue);
    }
  });

  function updateCounter(value) {
    counterValue.textContent = value;
    const isDisabled = value <= 0;
    decrementBtn.disabled = isDisabled;
    resetBtn.disabled = isDisabled;
  }
}

// Content script остается без изменений