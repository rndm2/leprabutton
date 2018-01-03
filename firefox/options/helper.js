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

const syncOptions = (name, checked) => {
  if (name === 'plugin[transparentImages]') {
    if (checked === true) {
      document.getElementById('plugin[transparentImagesRegexEnabled]').disabled = false;
      document.getElementById('plugin[transparentImagesRegex]').disabled = false;
    } else {
      document.getElementById('plugin[transparentImagesRegexEnabled]').disabled = true;
      document.getElementById('plugin[transparentImagesRegex]').disabled = true;
    }
  }

  if (name === 'plugin[transparentImagesRegexEnabled]') {
    if (checked === true) {
      document.getElementById('plugin[transparentImagesRegex]').classList.remove('hidden');
    } else {
      document.getElementById('plugin[transparentImagesRegex]').classList.add('hidden');
    }
  }
};

const updateUI = (restoredSettings) => {
  const options = document.querySelectorAll("input");
  const settings = Object.assign({}, config.defaults, restoredSettings.leprabuttonSettings || config.defaults, config.forceRewriteSettings);

  [].forEach.call(options, (option) => {
    option[option.type === 'checkbox' ? 'checked' : 'value'] = settings[option.id];
    syncOptions(option.id, settings[option.id]);
  });
};

browser.storage.local.get('leprabuttonSettings').then(updateUI);

[].forEach.call(document.querySelectorAll('input'), (option) => {
  option.addEventListener('change', (e) => {
    storeSettings();
    syncOptions(e.target.id, e.target.checked);
  });
});
