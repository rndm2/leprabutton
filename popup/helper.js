const navigate = (url, newTab) => {
  browser.tabs[newTab ? 'create' : 'update']({ url });
  window.close();
};

const updateUI = (responses) => {
  const [storageData, settingsData] = responses;
  const { leprabutton: data, leprabuttonPrev: dataPrev } = storageData;
  const { leprabuttonSettings: settings } = settingsData;
  const loggedIn = data && data.uid && data.uid !== '' && !isNaN(+data.uid);

  $('#not-authorised').toggle(!loggedIn);
  $('#authorised').toggle(loggedIn);

  if (!loggedIn) {
    return;
  }


  const attitudeData = data.karma_votes[data.karma_votes.length - 1];
  const attitudeString = `${attitudeData.login} ${attitudeData.attitude}`;
  const isPositiveAttitude = settings.thirdOption || attitudeData.attitude >= 0;

  $('#karma-plus').toggle(isPositiveAttitude);
  $('#karma-minus').toggle(!isPositiveAttitude);
  $('#username').text(data.login);
  $('.attitude').text(data.karma).attr('title', attitudeString);
  $('#rating').text(data.rating);
  $('#stuff').text(
    data.myunreadposts > 0
      ? (data.myunreadposts + '/' + data.myunreadcomms)
      : (data.myunreadcomms > 0 ? data.myunreadcomms : '')
    );
  $('#inbox').text(
    data.inboxunreadposts > 0
      ? (data.inboxunreadposts + '/' + data.inboxunreadcomms)
      : (data.inboxunreadcomms > 0 ? data.inboxunreadcomms : '')
  );

  const hasStuff = data.myunreadposts > 0 || data.myunreadcomms > 0;
  const hasInboxes = data.inboxunreadposts > 0 || data.inboxunreadcomms > 0;

  $('#icon-stuff').toggle(!hasStuff);
  $('#icon-stuff-active').toggle(hasStuff);
  $('#icon-inbox').toggle(!hasInboxes);
  $('#icon-inbox-active').toggle(hasInboxes);
};

Promise.all([
  browser.storage.local.get(['leprabutton', 'leprabuttonPrev']),
  browser.storage.local.get('leprabuttonSettings')
]).then(updateUI);

document.addEventListener('click', (e) => {
  if (e.button > 1) {
    return;
  }

  switch(true) {
    case e.target.className.search('link-logo') !== -1:
      navigate('https://leprosorium.ru', e.button !== 0);
      break;
    case e.target.className.search('link-stuff') !== -1:
      navigate('https://leprosorium.ru/my', e.button !== 0);
      break;
    case e.target.className.search('link-inbox') !== -1:
      navigate('https://leprosorium.ru/my/inbox', e.button !== 0);
      break;
    default:
      break;
  }
});

document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  browser.runtime.openOptionsPage();
});
