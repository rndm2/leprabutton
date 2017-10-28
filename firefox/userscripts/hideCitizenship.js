userScripts.push({
  name: 'hideCitizenship',

  include: new RegExp(":\/\/([a-zA-Z0-9]+\.)?leprosorium\.ru\/users\/\\S+"),

  run: () => {
    const handleNewHtml = () => {
    	const $bUserCitizen = $('.b-user_citizen');

      if ($bUserCitizen.length === 0) {
      	return;
      }

      $bUserCitizen.remove();
    };

    handleNewHtml();

    document.addEventListener('DOMNodeInserted', handleNewHtml, false);
  }
});
