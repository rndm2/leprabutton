const config = {
  url: {
    domain: 'leprosorium.ru',
    api: {
      panel: 'https://leprosorium.ru/ajax/api/lepropanel',
      inbox: 'https://leprosorium.ru/ajax/inbox',
      new: 'https://leprosorium.ru/api',
    }
  },
  cookieName: 'uid',
  defaults: {
    showBadges: true,
    showLabels: true,
    thirdOption: false,
    updatePeriod: 5,
    alwaysNewWindow: false,
    'prefix[stuff]': 's',
    'prefix[inbox]': 'i',
    'prefix[both]': 'a',
    'plugin[colors]': true,
    'plugin[customLink]': true,
    'plugin[customLinkTitle]': 'Архив;Архив главной',
    'plugin[customLinkLink]': '/archive;/archive/main',
    'plugin[updateComments]': true,
    'plugin[postPreview]': true,
    'plugin[commentAndRatingFont]': true,
    'plugin[navButtons]': true,
    'plugin[transparentImages]': false,
    'plugin[commaToColon]': true,
    'plugin[userNumbers]': true,
    'plugin[eraseFromStuff]': true,
    'plugin[karmaAttitude]': true,
    'plugin[goodLatvia]': true,
    'plugin[placeKarmaButtons]': true,
    'plugin[hideCitizenship]': true,
    'plugin[upButton]': true,
  }
};
