userScripts.push({
  name: 'archive',

  include: new RegExp(":\/\/([a-zA-Z0-9]+\.)?leprosorium\.ru"),

  run: () => {
    const handleNewHtml = function(e) {
      $('.b-aside_government', e ? e.target : document).forEach(item => {
        const $clone = $(item).clone();
        const $link = $clone.find('a');
        $link.attr('href', '/archive');
        $link.text('Архив');
        $clone.attr('style', 'margin-top: -5px;');
        $clone.insertAfter(item);
      });
    };

    handleNewHtml();

    document.addEventListener('DOMNodeInserted', handleNewHtml, false);
  }
});
