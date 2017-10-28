userScripts.push({
  name: 'updateComments',

  include: new RegExp(":\/\/([a-zA-Z0-9]+\.)?leprosorium\.ru\/comments\/\\d+"),

  run: () => {
    const css = '.lp-refresh { display: block; color: lightgray; cursor: pointer; position: fixed; bottom: 11px; right: 40px; z-index: 999999; }' +
     '.lp-refresh-active { opacity: 0.05; transition: opacity 400ms ease-in-out; } ';

    $.createStyle(css);

    const $refreshBlock = $('<a>[обновить комментарии]</a>', { 'class': 'lp-refresh' });

    $refreshBlock.click((e) => {
      const $button = $(e.target);
      $button.addClass('lp-refresh-active');
      setTimeout(() => $button.removeClass('lp-refresh-active'), 1000);
      document.querySelector('[data-key="refresh"]').dispatchEvent(new CustomEvent('click'));
    });

    document.body.appendChild($refreshBlock[0]);
  }
});
