userScripts.push({
  name: 'transparentImages',

  include: new RegExp(":\/\/([a-zA-Z0-9]+\.)?leprosorium\.ru"),

  run: () => {
    const css = 'div.post .dt img, #js-comments .comment_inner .c_body img { opacity: 0.25; }' +
    	'div.post .dt img:hover, #js-comments .comment_inner .c_body img:hover { opacity: 1; }';
		$.createStyle(css);
  }
});
