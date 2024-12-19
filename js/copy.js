/**
 * https://github.com/uiwjs/copy-to-clipboard/blob/master/src/main.js
 */
function copyTextToClipboard(text, cb) {
  const el = document.createElement('textarea');
  el.value = text;
  el.setAttribute('readonly', '');
  el.style = {
    position: 'absolute',
    left: '-9999px',
  };
  document.body.appendChild(el);
  const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
  el.select();
  let isCopy = false;
  try {
    const successful = document.execCommand('copy');
    isCopy = !!successful;
  } catch (err) {
    isCopy = false;
  }
  document.body.removeChild(el);
  if (selected && document.getSelection) {
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(selected);
  }
  cb && cb(isCopy);
}

function copied(target, str) {
  target.classList.add('active');
  const input = target.parentElement.querySelector('input');
  if (input) {
    copyTextToClipboard(input.value || '', function () {
      setTimeout(() => {
        target.classList.remove('active');
      }, 2000);
    });
  }
}
