const storeSettings = () => {
  const options = document.querySelectorAll("input");
  const settings = {};

  [].forEach.call(options, (option) => {
    if (option.id === 'updatePeriod' && (isNaN(option.value) || option.value < 0)) {
      option.value = config.defaults.updatePeriod;
    }

    settings[option.id] = option.type === 'checkbox' ? option.checked : option.value;
  });

  browser.storage.local.set({ leprabuttonSettings: settings });
};

const updateUI = (restoredSettings) => {
  const options = document.querySelectorAll("input");
  const settings = restoredSettings.leprabuttonSettings || config.defaults;

  [].forEach.call(options, (option) => {
    option[option.type === 'checkbox' ? 'checked' : 'value'] = settings[option.id];
  });
};

const onError = (e) => {
  console.error('Error reading settings', e);
};

browser.storage.local.get('leprabuttonSettings').then(updateUI, onError);

[].forEach.call(document.querySelectorAll('input'), (option) => {
  option.addEventListener('change', storeSettings);
});
