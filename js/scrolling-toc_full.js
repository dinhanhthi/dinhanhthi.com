// Thien
$(function() {
  $(window).scroll(function() {
    $(":header").each(function() {
      if ($(window).scrollTop() >= $(this).offset().top - 100) {
        var id = $(this).attr('id');
        $('#toc a').removeClass('toc-active');
        $('#toc a[href="#' + id + '"]').addClass('toc-active');
      }
    });
  });
});
