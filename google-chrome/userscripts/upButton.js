userScripts.push({
  name: 'upButton',

  include: new RegExp(":\/\/([a-zA-Z0-9]+\.)?leprosorium\.ru"),

  run: () => {
    const css = '.lp-up-block { position: fixed; bottom: 10px; right: 0px; z-index: 100; }' +
      '.lp-up-block input { display: block; width: 28px; height: 28px; color: #000; background-color: #fff; border: 1px solid #000; padding: 0pt; margin: 0pt; margin-bottom: 1px; cursor: pointer; opacity: 0.25; }' +
      '.lp-up-block input:hover { opacity: 1; }';

    $.createStyle(css);

    const upBlock = $('<div />', { 'class': 'lp-up-block' })[0];
    const upLink = $('<input />', {
      type: 'button',
      value: '↑',
      onclick: 'new Fx.Scroll(window, {duration: \'short\'}).start(0, 0); this.blur();'
    })[0];

    upBlock.appendChild(upLink);
    document.body.appendChild(upBlock);

    const hostFunction = () => {
      window.__lpUpTimeout = false;

      window.addEventListener('scroll', () => {
        clearTimeout(window.__lpUpTimeout);
        window.__lpUpTimeout = setTimeout(() => {
          const $block = $$('.lp-up-block');
          $block.get('tween')[0].cancel();
          $block.fade(document.documentElement.scrollTop > 100 ? 'in' : 'out');
        }, 100);
      }, false);

      window.dispatchEvent(new CustomEvent('scroll'));
    };

    const code = 'const LP_upInit = ' + hostFunction.toString() + '; LP_upInit();';

    $.createScript(code);
  }
});
