let currentSelector = null;
let observer = null;

// Инициализация
chrome.storage.local.get(['selector'], ({selector}) => {
  currentSelector = selector;
  startObserver();
});

// Обработчик сообщений
chrome.runtime.onMessage.addListener(({action, selector}) => {
  if(action === "updateSelector") {
    currentSelector = selector;
    chrome.storage.local.set({count: 0});
  }
});

// Отслеживание кликов
document.addEventListener('click', e => {
  if(!currentSelector) return;
  
  const element = e.target.closest(currentSelector);
  if(element) {
    chrome.storage.local.get(['count'], ({count = 0}) => {
      chrome.storage.local.set({count: count + 1});
      animateElement(element);
    });
  }
});

// Анимация элемента
function animateElement(element) {
  element.style.transition = 'transform 0.2s';
  element.style.transform = 'scale(0.95)';
  setTimeout(() => element.style.transform = '', 200);
}

// Наблюдатель за DOM
function startObserver() {
  if(observer) observer.disconnect();
  
  observer = new MutationObserver(() => {
    chrome.storage.local.get(['selector'], ({selector}) => {
      currentSelector = selector;
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true
  });
}