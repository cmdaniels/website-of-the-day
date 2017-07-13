$.ajax({
  url: '/wotd',
  method: 'GET'
}).done(function(res) {
  $('body').css('background-image', 'url(thumbnail.png)');
  $('a').attr('href', res.url);
});
