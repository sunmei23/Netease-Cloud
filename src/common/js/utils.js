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
