userScripts.push({
  name: 'karmaAttitude',

  include: new RegExp(":\/\/([a-zA-Z0-9]+\.)?leprosorium\.ru\/users\/\\S+"),

  run: (lpr2data) => {
    if (!lpr2data) {
      return;
    }

    const strings = {
      male: ['Не покушался на вашу карму (0)', 'Насрал вам в карму (%s)', 'Присунул вам в карму (+%s)'],
      female: ['Не покушалась на вашу карму (0)', 'Насрала вам в карму (%s)', 'Присунула вам в карму (+%s)']
    };

    const handleNewHtml = () => {
      const $bUserDataRegistered = $('.b-user_data_registered');
      const $bUserStat = $('.b-user_stat');
      const $attitudeLabel = $('.attitude-label');

      if (($bUserDataRegistered.length === 0 || $bUserStat.length === 0) || $attitudeLabel.length > 0) {
        return;
      }

      document.removeEventListener('DOMNodeInserted', handleNewHtml);

      const $stat = $('<div />', { 'class': 'b-user_stat attitude-label', css: { width: '100%', clear: 'both' } });

      const userId = $bUserDataRegistered[0].textContent.match(/[0-9]+/)[0];
      const userGender = $bUserStat[0].textContent.search('Написала') === -1 ? 'male' : 'female';
      let text = strings[userGender][0];

      for (let i = 0; i < lpr2data.karma_votes.length; i++) {
        if (lpr2data.karma_votes[i].uid === userId) {
          text = strings[userGender][lpr2data.karma_votes[i].attitude > 0 ? 2 : 1].replace('%s', lpr2data.karma_votes[i].attitude);
          break;
        }
      }


      $stat.append($.escapeHTML(text));
      $('.b-user_stat').eq(0).after($stat);

      document.addEventListener('DOMNodeInserted', handleNewHtml, false);
    };

    handleNewHtml();

    document.addEventListener('DOMNodeInserted', handleNewHtml, false);
  }
});
