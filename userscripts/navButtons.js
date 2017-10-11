userScripts.push({
  name: 'navButtons',

  include: new RegExp(':\/\/([a-zA-Z0-9]+\.)?leprosorium\.ru\/(comments\/\\d+|my\/inbox\/\\d+)'),

  run: () => {
    let currentPostNew = -1;
    let currentPostMine = -1;

    let navLinkNext;
    let navLinkPrev;

    const css = '.lp-nc-block { position: fixed; top: 90px; right: 0px; z-index: 100; }' +
      '.lp-nc-block input { display: block; width: 28px; height: 28px; color: #000; background-color: #fff; border: 1px solid #000; padding: 0pt; margin: 0pt; margin-bottom: 1px; cursor: pointer; opacity: 0.25; }' +
      '.lp-nc-block input:hover { opacity: 1; }';

    const hostFunction = (e, targetEl) => {
      const lpMode = e.shiftKey || e.ctrlKey ? 'mine' : 'new';
      const event = document.createEvent('HTMLEvents');

      event.initEvent('handleNewComments', true, false);
      targetEl.setAttribute('lpMode', lpMode);
      targetEl.dispatchEvent(event);
      targetEl.blur();

      const postId = lpMode === 'new'
        ? targetEl.parentNode.getAttribute('__lpPostNewId')
        : targetEl.parentNode.getAttribute('__lpPostMineId');
      const offset = lpMode === 'new'
        ? parseInt(targetEl.parentNode.getAttribute('__lpPostNewOffset'))
        : parseInt(targetEl.parentNode.getAttribute('__lpPostMineOffset'));

      const p = $(postId);
      const f = new Fx.Scroll(window, {duration: 'short'});

      if (!p || !offset || !f) {
        return;
      }

      f.start(0, offset);

      (() => { p.childNodes[0].highlight('#f4fbac'); }).delay(250);
    };

    const code = 'const LP_scrollTo = ' + hostFunction.toString();

    const $newComments = $('.comment.new', document);
    const $mineComments = $('.comment.mine', document);

    const navBlock = $('<div />', { 'class': 'lp-nc-block' })[0];

    if ($newComments.length > 0 || $mineComments.length > 0) {
      $.createStyle(css);
      $.createScript(code);

      navLinkNext = $('<input />', {type: 'button', value: '↓', onclick: 'LP_scrollTo(event, this);'})[0];
      navLinkNext.addEventListener('handleNewComments', (e) => navigate(navBlock, 1, e.target.getAttribute('lpMode')));

      navLinkPrev = $('<input />', {type: 'button', value: '↑', onclick: 'LP_scrollTo(event, this);'})[0];
      navLinkPrev.addEventListener('handleNewComments', (e) => navigate(navBlock, -1, e.target.getAttribute('lpMode')));

      navBlock.appendChild(navLinkPrev);
      navBlock.appendChild(navLinkNext);
      document.body.appendChild(navBlock);
    }

    if ($newComments.length > 0) {
      navBlock.setAttribute('__lpPostNewId', $newComments[0].id);
      setOffset(navBlock, $newComments[currentPostNew], 'new');
    }

    if ($mineComments.length > 0) {
      navBlock.setAttribute('__lpPostMineId', $mineComments[0].id);
      setOffset(navBlock, $mineComments[currentPostMine], 'mine');
    }

    const navigate = (navBlock, dir, mode) => {
      let currentCounter = (mode === 'new' ? currentPostNew : currentPostMine);
      const $targetComments = (mode === 'new' ? $newComments : $mineComments);
      const commentsLength = $targetComments.length;

      if (commentsLength === 0) {
        return;
      }

      if (dir > 0) {
        currentCounter++;

        if (currentCounter >= commentsLength) {
          currentCounter = commentsLength - 1;
        }
      } else {
        currentCounter--;

        if (currentCounter < 0) {
          currentCounter = 0;
        }
      }

      if (mode === 'new') {
        currentPostNew = currentCounter;
        navBlock.setAttribute('__lpPostNewId', $newComments[currentPostNew].id);
      } else {
        currentPostMine = currentCounter;
        navBlock.setAttribute('__lpPostMineId', $mineComments[currentPostMine].id);
      }

      setOffset(navBlock, $targetComments[currentCounter], mode);
    };

    function setOffset(navBlock, element, mode) {
      if (!element) {
        return;
      }

      const getOffsetTop = function(el) {
        let offsetTop = el.offsetTop;

        while (el.offsetParent && el.offsetParent.offsetTop) {
          el = el.offsetParent;
          offsetTop += el.offsetTop;
        }

        return offsetTop;
      };

      const elTop = getOffsetTop(element);

      const html = document.documentElement;
      const maxHtmlTop = html.scrollHeight - html.clientHeight;
      let htmlTopNew;

      if (element.offsetHeight > html.clientHeight) {
        htmlTopNew = elTop;
      } else {
        htmlTopNew = elTop - (Math.round(html.clientHeight / 2)) + Math.round(element.offsetHeight / 2);
      }

      if (htmlTopNew > maxHtmlTop) {
        htmlTopNew = maxHtmlTop;
      }

      if (mode === 'new') {
        navBlock.setAttribute('__lpPostNewOffset', htmlTopNew);
      } else {
        navBlock.setAttribute('__lpPostMineOffset', htmlTopNew);
      }
    }
  }
});
