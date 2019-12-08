// AHJUST SIZE OF PHOTO MODAL
// include img-modal.html
jQuery(document).ready(function($){

  // add more attributes to the img.pop
  $('.pop').attr("data-toggle", "tooltip");
  $('.pop').attr("data-placement", "top");
  $('.pop').attr("title", "Click to see a bigger photo.");

  // current view port size
  var wW = $(window).width() - 16;
  var wH = $(window).height() - 16; // max display

  $('[data-toggle="tooltip"]').tooltip();

  $('.pop').on('click', function() {

    // real size of the photo
    var rW = $(this).find('img')[0].naturalWidth;
    var rH = $(this).find('img')[0].naturalHeight;

    var cW, cH; // photo's will be set to this size!
    cW = rW; cH = rH; // initial setting

    if (rH < wH){
      if (rW > wW){
        cW = wW; cH = wW*rH/rW;
      }
    } else{
      if (rW < wW){
        cH = wH; cW = wH*rW/rH;
      } else if(wW*rH/rW < wH){
        cW = wW; cH = wW*rH/rW;
      } else{
        cH = wH; cW = wH*rW/rH;
      }
    }

    // Show max photo's size if it's smaller than the current view port. Otherwise, it scale photo to the size of view port.
    $('.modal-dialog')[0].style.width = cW + "px";
    $('.modal-dialog')[0].style.height = cH + "px";

    $('.imagepreview').attr(
      'src', $(this).find('img').attr('src')
      );
    $('#imagemodal').modal('show');
  });
});