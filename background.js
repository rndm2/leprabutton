let sharedData = {};
let sharedSettings = {};
let user = {};
let leprabuttonPort;

// Get cookies and settings
const requestInitialData = () => Promise.all([
  browser.storage.local.get('leprabuttonSettings'),
  browser.cookies.getAll({ domain: `.${config.url.domain}`, name: config.cookieName })
]).then(onInitialDataReceived);

// Starting, set shared objects, launch timer, etc
const onInitialDataReceived = (responses) => {
  const [settings, cookies] = responses;
  const [cookie] = cookies;
  const { leprabuttonSettings } = settings;

  if (!cookie || cookie.value === "" || isNaN(+cookie.value)) {
    user = {};
    return;
  }

  sharedSettings = { ...config.defaults, ...leprabuttonSettings };
  user.uid = cookie.value;

  requestLeproData();

  const time = (+leprabuttonSettings.updatePeriod) * 60 * 1000;

  if (!isNaN(time) && time > 0) {
    setInterval(requestLeproData, time);
  }
};

// Request site data
const requestLeproData = () => {
  $.ajax({ type: 'get', url: config.url.api, dataType: 'json', success: onLeproDataReceived });
  $.ajax({ type: 'get', url: `${config.url.api}/${user.uid}`, dataType: 'json', success: onLeproDataReceived });
};

// Put everything to local storage
const onLeproDataReceived = (response) => {
  sharedData = { userData: user, ...sharedData, ...response };

  browser.storage.local.get('leprabutton').then((oldResponse) => {
    browser.storage.local.set({ leprabuttonPrev: oldResponse.leprabutton });
    browser.storage.local.set({ leprabutton: sharedData });
  });
};

// If cookie changed, probably user logged in or out
// Purge storage and make request
browser.cookies.onChanged.addListener((data) => {
  if (data.cookie.domain.search(config.url.domain) !== -1 && data.cookie.name === config.cookieName) {
    browser.storage.local.set({ leprabutton: {} });
    sharedData = {};
    requestInitialData();
  }
});

// If storage changed, probably settings changed
// Assign new settings
browser.storage.onChanged.addListener((data) => {
  if (data.leprabuttonSettings !== undefined) {
    sharedSettings = data.leprabuttonSettings.newValue;
  }
});

// Each time user load page send to loader.js sharedData and sharedSettings
// Will be passed to content scripts
browser.runtime.onConnect.addListener((port) => {
  if (port.name === 'leprabuttonPort') {
    leprabuttonPort = port;
    leprabuttonPort.postMessage({ sharedData, sharedSettings });
  }
});

// Go-go-go
requestInitialData();
