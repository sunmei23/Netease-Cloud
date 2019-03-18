export function sleep(delay) {
  var start = (new Date()).getTime();
  while ((new Date()).getTime() - start < delay) {
    continue;
  }
}
export function getFontSize(ele) {
  if (window.getComputedStyle) {
    return parseFloat(window.getComputedStyle(ele).fontSize);
  }else{
    return parseFloat(ele.currentStyle.fontSize);
  }
}
export function throttle(callback,duration){
  var lastTime = new Date().getTime();
  return function(pos){
    let now = new Date().getTime();
    if(now - lastTime > duration){
      callback(pos=null);
      lastTime = now;
    }
  }
}

export function debounce(callback,delay=300,nowFun){
  var t= null;
  return function(pos=null){
    nowFun(pos);
    if (!t){
      t = setTimeout(callback(pos),delay)
    }else{
      clearTimeout(t);
      t = setTimeout(callback(pos),delay)
    }
  }
}
