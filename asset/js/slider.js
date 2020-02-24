var slider = document.getElementById('slider'),
    sliderItems = document.getElementById('items'),
    sliderPics = document.getElementById('pictures'),
    prev = document.getElementById('prev'),
    next = document.getElementById('next'),
    skipButton = document.getElementById('skip');

slide(slider, sliderItems, sliderPics,  prev, next, skipButton);

function slide(wrapper, items, pictures, prev, next, skipButton) {
  var posX1 = 0,
      posX2 = 0,
      posInitial,
      posFinal,
      threshold = 100,
      slides = items.getElementsByClassName('slide'),
      slidesLength = slides.length,
      slideSize = items.getElementsByClassName('slide')[0].offsetWidth,
      firstSlide = slides[0],
      lastSlide = slides[slidesLength - 1],
  //  cloneFirst = firstSlide.cloneNode(true),
  //  cloneLast = lastSlide.cloneNode(true),
      index = 0,
      allowShift = true;
  
  // Clone first and last slide
  /*
  items.appendChild(cloneFirst);
  items.insertBefore(cloneLast, firstSlide);
  */
  wrapper.classList.add('loaded');
  
  // Mouse and Touch events
  items.onmousedown = dragStart;
  
  // Touch events
  items.addEventListener('touchstart', dragStart);
  items.addEventListener('touchend', dragEnd);
  items.addEventListener('touchmove', dragAction);
  
  // Click events
  prev.addEventListener('click', function () { 
    if(index > 0){
      shiftSlide(-1);
    }
  });
  
  next.addEventListener('click', function () { 
      if(index < 3){
        shiftSlide(1);
      }
   });
  
  skipButton.addEventListener('click', function() {
      shiftSlide(3 - index);
  });
  
  // Transition events
  items.addEventListener('transitionend', checkIndex);

   
  function dragStart (e) {
    e = e || window.event;
    e.preventDefault();
    posInitial = items.offsetLeft;
    
    if (e.type == 'touchstart') {
      posX1 = e.touches[0].clientX;
    } else {
      posX1 = e.clientX;
      document.onmouseup = dragEnd;
      document.onmousemove = dragAction;
    }
  }

  function dragAction (e) {
    e = e || window.event;
    
    if (e.type == 'touchmove') {
      posX2 = posX1 - e.touches[0].clientX;
      posX1 = e.touches[0].clientX;
    } else {
      posX2 = posX1 - e.clientX;
      posX1 = e.clientX;
    }
    items.style.left = (items.offsetLeft - posX2) + "px";
  }
  
  function dragEnd (e) {
    posFinal = items.offsetLeft;
    if (posFinal - posInitial < -threshold) {
      if(index < 3){
        shiftSlide(1, 'drag');
      }else{
        shiftSlide(0, 'drag');
      }      
    } else if (posFinal - posInitial > threshold) {
      if(index > 0){
        shiftSlide(-1, 'drag');
      }else{
        shiftSlide(0, 'drag');
      }     
    } else {
      items.style.left = (posInitial) + "px";
    }

    document.onmouseup = null;
    document.onmousemove = null;
  }
  
  function shiftSlide(dir, action) {
    items.classList.add('shifting');
    
    if (allowShift) {
      if (!action) { posInitial = items.offsetLeft; }
      items.style.left = (posInitial - slideSize * dir) + "px";

      index += dir;
      
      var v = document.getElementsByClassName("dot active");   
      var v1 = pictures.getElementsByClassName("sliderpicture active")

      if(v.length > 0){
        v[0].className = "dot";
        v1[0].className = "sliderpicture";
      }  
      v = document.getElementsByClassName("dot");         
      v1 = pictures.getElementsByClassName("sliderpicture");
      var inx = index % 4;
      if(inx < 0){
          inx += 4;
      }

      v[inx].className += " active";
      v1[inx].className = "sliderpicture active";

      var hrate = 60;
      if(inx == 3){
          hrate = 20;
      }
      document.getElementById("div_pic").style.height = hrate + "%";
      document.getElementById("div_slide").style.height = (100 - hrate) + "%";
      document.getElementById("skip").style.visibility = inx == 3 ? "hidden" : "visible";
      
    };
    
    allowShift = false;
  }
    
  function checkIndex (){
    items.classList.remove('shifting');

    if (index == -1) {
      items.style.left = -(slidesLength * slideSize) + "px";
      index = slidesLength - 1;
    }

    if (index == slidesLength) {
      items.style.left = -(1 * slideSize) + "px";
      index = 0;
    }    
    allowShift = true;
  }
}