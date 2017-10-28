userScripts.push({
  name: 'commaToColon',

  include: new RegExp(":\/\/([a-zA-Z0-9]+\.)?leprosorium\.ru"),

  run: () => {
    const handleNewHtml = function(e) {
      $('.c_answer', e ? e.target : document).forEach(item => {
        const handler = () => {
          const $textarea = $(item).closest('.comment').find('.b-comments_add_textarea textarea');

          if ($textarea.length === 0 || $textarea.attr('data-processed')) {
            return;
          }

          const text = $textarea.val();

          if (text && text.search(/[\wа-яА-Я-]+,/) === 0) {
            const splitted = text.split(/,\s$/);

            if (splitted.length > 0) {
              $textarea.val(splitted[0] + ': ').attr('data-processed', true);
            }
          }
        };

        item.addEventListener('click', handler);
        item.addEventListener('mousemove', handler);
        item.addEventListener('mouseout', handler);
      });
    };

    handleNewHtml();

    document.addEventListener('DOMNodeInserted', handleNewHtml, false);
  }
});
