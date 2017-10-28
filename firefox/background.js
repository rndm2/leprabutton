let sharedData = {};
let sharedSettings = {};
let user = {};
let leprabuttonDataPort;

// Get cookies and settings
const requestInitialData = () => Promise.all([
  browser.storage.local.get('leprabutton'),
  browser.storage.local.get('leprabuttonSettings'),
  browser.cookies.getAll({ domain: `.${config.url.domain}`, name: config.cookieName })
]).then(onInitialDataReceived);

// Starting, set shared objects, launch timer, etc
const onInitialDataReceived = (responses) => {
  const [data, settings, cookies] = responses;
  const [cookie] = cookies;
  const { leprabuttonSettings } = settings;
  const { leprabutton } = data;

  if (!cookie || cookie.value === "" || isNaN(+cookie.value)) {
    user = {};
    return;
  }

  sharedSettings = Object.assign({}, config.defaults, leprabuttonSettings);
  sharedData = Object.assign({}, leprabutton);
  user.uid = cookie.value;

  requestLeproData();

  const time = (+sharedSettings.updatePeriod) * 60 * 1000;

  if (!isNaN(time) && time > 0) {
    setInterval(requestLeproData, time);
  }
};

// Request site data
const requestLeproData = _.throttle(() => {
  $.ajax({
    type: 'get',
    url: config.url.api.panel,
    dataType: 'json',
    success: onLeproDataReceived,
    error: () => onLeproDataReceived({}),
  });
  $.ajax({
    type: 'get',
    url: `${config.url.api.panel}/${user.uid}`,
    dataType: 'json',
    success: onLeproDataReceived,
    error: () => onLeproDataReceived({}),
  });
}, 15000, { leading: true });

// Put everything to local storage
const onLeproDataReceived = (response) => {
  sharedData = Object.assign({ userData: user }, sharedData, response);
  browser.storage.local.set({ leprabutton: sharedData });
  updateBadge();
};

// Update badge text function
const updateBadge = () => {
  if (!sharedSettings.showBadges) {
    browser.browserAction.setBadgeText({ text: '' });
    browser.browserAction.setTitle({ title: browser.runtime.getManifest().browser_action.default_title });
    return;
  }

  const stuffPrefix = sharedSettings['prefix[stuff]'] || '';
  const inboxPrefix = sharedSettings['prefix[inbox]'] || '';
  const bothPrefix = sharedSettings['prefix[both]'] || '';
  const getSummText = (summ) => summ >= 100 ? '99+' : summ;
  let { myunreadposts, myunreadcomms, inboxunreadposts, inboxunreadcomms } = sharedData;

  myunreadposts = +myunreadposts;
  myunreadcomms = +myunreadcomms;
  inboxunreadposts = +inboxunreadposts;
  inboxunreadcomms = +inboxunreadcomms;

  const stuffSumm = myunreadposts + myunreadcomms;
  const inboxSumm = inboxunreadposts + inboxunreadcomms;
  const bothSumm = stuffSumm + inboxSumm;

  let titleText =
    ` Привет, ${sharedData.login}! Вот что у тебя есть - ` +
    (stuffSumm ? `мои вещи: ` : '') +
    `${myunreadposts > 0 ? (myunreadposts + '/' + myunreadcomms) : (myunreadcomms > 0 ? myunreadcomms : '')}` +
    (stuffSumm && inboxSumm ? `, ` : '') +
    (inboxSumm ? `инбокс: ` : '') +
    `${inboxunreadposts > 0 ? (inboxunreadposts + '/' + inboxunreadcomms) : (inboxunreadcomms > 0 ? inboxunreadcomms : '')} `
  ;
  let badgeText = '';

  if (stuffSumm > 0 && inboxSumm > 0) {
    badgeText = `${bothPrefix}${getSummText(bothSumm)}`;
  } else if (stuffSumm > 0) {
    badgeText = `${stuffPrefix}${getSummText(stuffSumm)}`;
  } else if (inboxSumm > 0) {
    badgeText = `${inboxPrefix}${getSummText(inboxSumm)}`;
  }

  browser.browserAction.setBadgeText({ text: badgeText });
  browser.browserAction.setTitle({ title: titleText });
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
    updateBadge();
  }
});

// Each time user load page or open popup send to script sharedData and sharedSettings
// Will be passed to content scripts
browser.runtime.onConnect.addListener((port) => {
  switch (port.name) {
    case 'leprabuttonDataPort':
      leprabuttonDataPort = port;
      leprabuttonDataPort.postMessage({ sharedData, sharedSettings });
      break;
    case 'leprabuttonUpdatePort':
      requestLeproData();
      break;
  }
});

// Go-go-go
requestInitialData();
