// Adapted from https://codepen.io/wilbo/pen/xRVLOj by Wilbert Schepenaar.
const handleCodeCopying = () => {
  const preTags = document.getElementsByTagName('pre');

  const isPrismClass = (preTag) =>
    preTag.className.substring(0, 8) === 'language';

  if (preTags !== null) {
    for (let i = 0; i < preTags.length; i++) {
      if (!isPrismClass(preTags[i])) continue;
      preTags[
        i
      ].innerHTML = `<div class="copy"><i class="fontello-icon icon-clone"></i></div>${preTags[i].innerHTML}`;
    }
  }

  const clipboard = new ClipboardJS('.copy', {
    target: (trigger) => trigger.nextElementSibling,
  });

  clipboard.on('success', (event) => {
    event.trigger.innerHTML = '<i class="fontello-icon icon-ok"></i>';
    setTimeout(() => {
      event.clearSelection();
      event.trigger.innerHTML = '<i class="fontello-icon icon-clone"></i>';
    }, 1000);
  });
};

export { handleCodeCopying };