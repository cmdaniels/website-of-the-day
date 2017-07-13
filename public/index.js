$.ajax({
  url: '/wotd',
  method: 'GET'
}).done(function(res) {
  $('body').css('background-image', 'url(thumbnail.png?random=' + new Date().getTime() + ')');
  $('a').attr('href', res.url);
});
