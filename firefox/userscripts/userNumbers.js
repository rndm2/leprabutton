userScripts.push({
  name: 'userNumbers',

  include: new RegExp(":\/\/([a-zA-Z0-9]+\.)?leprosorium\.ru"),

  run: () => {
    const $wrapper = $('<span />', { 'class': 'user-number' });

    const handleNewHtml = (e) => {
    	const $html = $(e.target);

      if ($html.find('.ddi').length > 0) {
        makeNumbers(e.target);
      }
    };

    const makeNumbers = function(context) {
      context = context || document;

      $('.ddi .user-number', context).remove();

      $('.ddi .c_user', context).forEach(item => {
        $(item).after($wrapper.clone().text(' [' + item.getAttribute('data-user_id') + ']'));
      });
    };

    makeNumbers();

    document.addEventListener('DOMNodeInserted', handleNewHtml, false);
  }
});
