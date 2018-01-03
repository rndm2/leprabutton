chrome.runtime.connect({ name: 'leprabuttonUpdatePort' });
chrome.runtime.connect({ name: 'leprabuttonDataPort' })
  .onMessage.addListener((data) => {
    console.log('Content script loader received message from background script', data);

    userScripts.forEach(script => {
      let additionalRegex;

      if (data.sharedSettings[`plugin[${script.name}RegexEnabled]`] === true && data.sharedSettings[`plugin[${script.name}Regex]`]) {
        additionalRegex = data.sharedSettings[`plugin[${script.name}Regex]`];
      } else {
        additionalRegex = undefined;
      }

      if (
        data.sharedSettings[`plugin[${script.name}]`] === true && script.include.test(window.location.href) &&
        (
          additionalRegex === undefined ||
          (additionalRegex !== undefined && window.location.href.search(new RegExp(additionalRegex)) !== -1)
        )
      ) {
        const time1 = new Date();
        script.run(data.sharedData, data.sharedSettings);
        const time2 = new Date();
        console.log(`--- User script "${script.name}" executed in ${time2 - time1}ms ---`);
      }
    });
  });
