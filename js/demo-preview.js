const demo = document.querySelectorAll('.idoc-demo-warpper .idoc-demo-previw');

function getButton(elm, type = 'BUTTON') {
  let btn;
  do {
    elm = elm.nextElementSibling
    if (elm.tagName === type) {
      btn = elm;
      elm = undefined;
      break;
    }
  } while (elm);
  return btn;
}
if (demo && demo.length > 0) {
  demo.forEach((item) => {
    if (item.previousElementSibling && item.previousElementSibling.tagName === 'INPUT') {
      const button = getButton(item);
      if (button) {
        button.innerHTML = item.classList.contains('ishiden') ? 'Preview' : 'Show Code';
        if (item.tagName === 'DIV') {
          item.innerHTML = item.previousElementSibling.defaultValue
        }
        button.onclick = () => {
          item.classList.toggle('ishiden');
          button.innerHTML = item.classList.contains('ishiden') ? 'Preview' : 'Show Code';
        }
      }
    }
  });
}