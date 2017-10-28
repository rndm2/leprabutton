userScripts.push({
  name: 'placeKarmaButtons',

  include: new RegExp(":\/\/([a-zA-Z0-9]+\.)?leprosorium\.ru\/users\/\\S+"),

  run: () => {
    const handleNewHtml = () => {
    	const $bUserVotesWrapper = $('.b-user_votes_wrapper');

      if ($bUserVotesWrapper.length === 0 || $bUserVotesWrapper.hasClass('karma-processed')) {
      	return;
      }

      document.removeEventListener('DOMNodeInserted', handleNewHtml);

      $bUserVotesWrapper.addClass('karma-processed');
      $bUserVotesWrapper.css('top', '30px');
      $('.b-karma_controls').css('display', 'block');
      $('.b-karma_value').css('display', 'block');
      $('.b-karma_controls').eq(0).insertAfter($('.b-karma_controls').eq(1));
      $('.b-karma_controls').eq(0).insertBefore($('.b-karma_value'));

      document.addEventListener('DOMNodeInserted', handleNewHtml, false);
    };

    handleNewHtml();

    document.addEventListener('DOMNodeInserted', handleNewHtml, false);

    const css = 'i.b-karma_button { width: 20px; height: 20px; font-size: 14px; line-height: 18px;}';

		$.createStyle(css);
  }
});
