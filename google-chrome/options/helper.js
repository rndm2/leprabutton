const storeSettings = () => {
  const options = document.querySelectorAll("input");
  const settings = {};

  [].forEach.call(options, (option) => {
    if (option.id === 'updatePeriod' && (isNaN(option.value) || option.value < 0)) {
      option.value = config.defaults.updatePeriod;
    }

    settings[option.id] = option.type === 'checkbox' ? option.checked : option.value;
  });

  chrome.storage.local.set({ leprabuttonSettings: settings });
};

const updateUI = (restoredSettings) => {
  const options = document.querySelectorAll("input");
  const settings = Object.assign({}, config.defaults, restoredSettings.leprabuttonSettings || config.defaults);

  [].forEach.call(options, (option) => {
    option[option.type === 'checkbox' ? 'checked' : 'value'] = settings[option.id];
  });
};

chrome.storage.local.get('leprabuttonSettings', updateUI);

[].forEach.call(document.querySelectorAll('input'), (option) => {
  option.addEventListener('change', storeSettings);
});
