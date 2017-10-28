userScripts.push({
  name: 'postPreview',

  include: new RegExp(":\/\/([a-zA-Z0-9]+\.)?leprosorium\.ru"),

  run: () => {
    const appendPreview = (innerHTML) => {
      const $body = $(document.body);
      const $preview = $('<div />', { 'class': 'leprabutton-preview-area' });
      const $close = $('<i>[закрыть]</i>', { 'class': 'leprabutton-preview-close' });
      const data = document.createElement('div');

      data.innerHTML = innerHTML;

      $preview.append($close);
      $preview.append(data);

      $body.append($preview);

      $close.click(() => $preview.remove());
    };

    const handleSuccess = data => {
      const inboxId = data.id;
      const inboxInnerHtml = data.data.text;

      const csrf_token = window.wrappedJSObject.globals.user.csrf_token;

      $.ajax({ type: 'post', url: `${config.url.api.inbox}/delete/`, dataType: 'json', data: { post: inboxId, csrf_token } });

      appendPreview(inboxInnerHtml)
    };

    const handleError = (xhr, errorType, error) => {
      let errorText = 'Сервер не пояснил деталей ошибки';

      if (xhr && xhr.response) {
        try {
          const data = $.parseJSON(xhr.response);

          if (data.status === 'error') {
            if (Array.isArray(data.errors)) {
              errorText = '';

              data.errors.forEach(error => {
                errorText += `${JSON.stringify(error)}<br />`;
              })
            } else {
              errorText = JSON.stringify(data.errors);
            }
          }
        } catch(e) {}
      }

      appendPreview(`<div class="leprabutton-preview-error"><h1>Произошла ошибка:</h1><div>${errorType}</div><div>${error.toString()}</div><div>${errorText}</div></div>`);
      console.log('Shit happens', xhr, errorType, error);
    };

    const handleClick = (e) => {
      const $button = $(e.target);

      if ($button.hasClass('disabled')) {
        return;
      }

      $button.addClass('disabled');

      $holder = $button.closest('#js-new_inbox_form, #js-new_post_form, .b-comments_reply_block');
      $textarea = $holder.find('#js-new_inbox_body, #js-new_post_body, .b-comments_add_textarea textarea');

      const text = $textarea.val();
      const uid = window.wrappedJSObject.Cookie.read('uid');
      const sid = window.wrappedJSObject.Cookie.read('sid');

      $.ajax({
        type: 'post',
        headers: { 'X-Futuware-UID': uid, 'X-Futuware-SID': sid },
        url: `${config.url.api.new}/inbox`,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({ recipients: [{ id: +uid }], text }),
        complete: () => setTimeout(() => $button.removeClass('disabled'), 1000),
        success: handleSuccess,
        error: handleError
      });

    };

    const css =
      '.leprabutton-preview { padding: 1px 12px 0; display: inline-block; vertical-align: top; height: 19px; font-size: 14px; cursor: pointer; }' +
      '.leprabutton-preview.disabled { opacity: 0.5; cursor: default; }' +
      '.leprabutton-preview-area { position: fixed; top: 5%; left: 20%; right: 20%; bottom: 5%; border: 1px solid gray; background: #f6efd2; z-index: 999999; }' +
      '.leprabutton-preview-area > div { position: absolute; padding: 10px; top: 25px; left: 20px; right: 20px; bottom: 20px; overflow: auto; background: #fff; }' +
      '.leprabutton-preview-error { color: red; }' +
      '.leprabutton-preview-close { position: absolute; font-style: normal; right: 5px; top: 5px; cursor: pointer; }';

    $.createStyle(css);

    const $previewButton = $('<a>&#128065;</a>', { 'class': 'leprabutton-preview' });

    const handleNewHtml = (e) => {
      $submits = $('#js-new_post_submit, #js-new_inbox_submit, .b-comments_reply_block_yarrr', e ? e.target : document);

      $submits.forEach((submit) => {
        const $clone = $previewButton.clone();
        $clone.click(handleClick);
        $clone.insertBefore(submit);
      });
    };

    handleNewHtml();

    document.addEventListener('DOMNodeInserted', handleNewHtml, false);
  }
});
