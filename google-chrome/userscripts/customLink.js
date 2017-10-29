userScripts.push({
  name: 'customLink',

  include: new RegExp(":\/\/([a-zA-Z0-9]+\.)?leprosorium\.ru"),

  run: (lpr2data, settings) => {
    const handleNewHtml = function(e) {
      const titles = settings['plugin[customLinkTitle]'].split(';');
      const links = settings['plugin[customLinkLink]'].split(';');

      $('.b-aside_government', e ? e.target : document).forEach(item => {
        titles.forEach((title, index) => {
          const $clone = $(item).clone();
          const $link = $clone.find('a');
          $link.attr('href', links[index]);
          $link.text(title);
          $clone.attr('style', 'margin-top: -5px;');
          $clone.insertAfter(item);
        });
      });
    };

    handleNewHtml();

    document.addEventListener('DOMNodeInserted', handleNewHtml, false);
  }
});
