userScripts.push({
  name: 'eraseFromStuff',

  include: new RegExp(":\/\/([a-zA-Z0-9]+\.)?leprosorium\.ru"),

  run: () => {
    const handleNewHtml = function(e) {
      const $targets = $('.b-post_my_post_controls_button_out_interest', e ? e.target : document);

      if ($targets.length > 0) {
        $targets.text('стереть из моих вещей');
      }
    };

    handleNewHtml();

    document.addEventListener('DOMNodeInserted', handleNewHtml, false);
  }
});
