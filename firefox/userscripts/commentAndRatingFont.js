userScripts.push({
  name: 'commentAndRatingFont',

  include: new RegExp(":\/\/([a-zA-Z0-9]+\.)?leprosorium\.ru\/comments\/\\d+"),

  run: () => {
    const css = '.c_vote .vote_result { width: auto; min-width: 24px; padding: 0 4px; }' +
      '.vote-big-38 .vote_button { right: 10px; }' +
      '.vote-big-48 .vote_button { right: 15px; }' +
			'.font-size-11 .vote_result { font-size: 11px !important }' +
      '.font-size-12 .vote_result { font-size: 12px !important }' +
      '.font-size-13 .vote_result { font-size: 13px !important }' +
      '.font-size-14 .vote_result { font-size: 14px !important }' +
      '.font-size-15 .vote_result { font-size: 15px !important }' +
      '.font-size-16 .vote_result { font-size: 16px !important }' +
			'.color-999 .vote_result { color: #ff0000 }' +
      '.color-512 .vote_result { color: #cc0000 }' +
      '.color-255 .vote_result { color: #990000 }' +
      '.color-156 .vote_result { color: #000000 }' +
      '.color-64 .vote_result { color: #666666 }' +
      '.color--5 .vote_result { color: #aaaa33 }' +
      '.color--42 .vote_result { color: #bb8833 }' +
      '.color--100 .vote_result { color: #aa7733 }' +
      '.color--150 .vote_result { color: #aa5533 }' +
      '.color--250 .vote_result { color: #993333 }';

    $.createStyle(css);

		const handleNewHtml = (e) => {
			const $votes = $('.comment .vote_result', e ? e.target : document);

			$votes.forEach(item => {
        const rating = parseInt(item.textContent);

        if (rating > 0) {
          const fontSize = Math.min(16, 9 + Math.round(0.3 * Math.sqrt(Math.abs(rating * 4))));

          item.parentNode.className += ` font-size-${fontSize}`;

          if (fontSize >= 15 &&  fontSize <= 16) {
            if (rating > 999) {
              item.parentNode.className += ' vote-big-48';
            } else {
              item.parentNode.className += ' vote-big-38';
            }
          }
        }

				let itemColor;

				if (rating > 999) itemColor = 'color-999';
				if (rating > 512 && rating <= 999) itemColor = 'color-512';
				if (rating > 255 && rating <= 512) itemColor = 'color-255';
				if (rating > 156 && rating <= 255) itemColor = 'color-156';
				if (rating > 64 && rating <= 156) itemColor = 'color-64';
				if (rating <= -5 && rating > -42) itemColor = 'color--5';
				if (rating <= -42 && rating > -100) itemColor = 'color--42';
				if (rating <= -100 && rating > -150) itemColor = 'color--100';
				if (rating <= -150 && rating > -250) itemColor = 'color--150';
				if (rating <= -250) itemColor = 'color--250';

        item.parentNode.className += ` ${itemColor}`;
      });
		};

    handleNewHtml();

    document.addEventListener('DOMNodeInserted', handleNewHtml, false);
  }
});
