chrome.runtime.connect({ name: 'leprabuttonUpdatePort' });
chrome.runtime.connect({ name: 'leprabuttonDataPort' })
  .onMessage.addListener((data) => {
    console.log('Content script loader received message from background script', data);

    userScripts.forEach(script => {
      if (data.sharedSettings[`plugin[${script.name}]`] === true && script.include.test(window.location.href)) {
        const time1 = new Date();
        script.run(data.sharedData, data.sharedSettings);
        const time2 = new Date();
        console.log(`--- User script "${script.name}" executed in ${time2 - time1}ms ---`);
      }
    });
  });
