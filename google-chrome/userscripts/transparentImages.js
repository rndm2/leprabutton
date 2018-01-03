userScripts.push({
  name: 'transparentImages',

  include: new RegExp(":\/\/([a-zA-Z0-9]+\.)?leprosorium\.ru"),

  run: () => {
    const css = '' +
     'div.post .dt img,' +
     'div.post .dt video,' +
     '#js-comments .comment_inner .c_body img,' +
     '#js-comments .comment_inner .c_body video { opacity: 0.25; }' +
     'div.post .dt img:hover,' +
     'div.post .dt video:hover,' +
     '#js-comments .comment_inner .c_body img:hover,' +
     '#js-comments .comment_inner .c_body video:hover { opacity: 1; }';
		$.createStyle(css);
  }
});
