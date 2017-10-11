browser.runtime.connect({ name: 'leprabuttonPort' })
  .onMessage.addListener((data) => {
    console.log('Received message from background script', data);

    userScripts.forEach(script => {
      if (data.sharedSettings[`plugin[${script.name}]`] === true && script.include.test(window.location.href)) {
        const time1 = new Date();
        script.run(data.sharedData);
        const time2 = new Date();
        console.log(`--- User script "${script.name}" executed in ${time2 - time1}ms ---`);
      }
    });
  });
