// Max character function
$(document).on('ready', function(){
  const MAXCHARS = 140;
  $('.new-tweet textarea').on('keyup', function(event){
    const length = $(this).val().length;
    const counter = $(this).parent().find('span');
    let color = 'black';
    counter.text(MAXCHARS - length);
    length > MAXCHARS ? color = 'red' : color = 'black';
    counter.css('color', color);
  });
});