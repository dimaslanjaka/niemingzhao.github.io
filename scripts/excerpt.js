const rExcerpt = /<!-- ?more ?-->/;

hexo.extend.filter.register("after_post_render", function (data) {
  const content = data.content;

  // abort process existing excerpt
  if (typeof data.excerpt == "string") {
    if (data.excerpt.trim().length > 0) {
      return;
    }
  }

  if (rExcerpt.test(content)) {
    data.content = content.replace(rExcerpt, function (match, index) {
      data.excerpt = content.substring(0, index).trim();
      data.more = content.substring(index + match.length).trim();

      return '<a id="more">Read More</a>';
    });
  } else {
    // truncate first 150 letters
    data.excerpt = content.trim().substring(0, 150);
    // bring back content
    data.more = content;
  }
});
