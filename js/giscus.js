(() => {
  const targetElement = document.documentElement;
  const defaultTheme = targetElement.getAttribute('data-color-mode');
  changeGiscusTheme(defaultTheme);
  const observer = new MutationObserver((mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes') {
        const value = targetElement.getAttribute('data-color-mode');
        changeGiscusTheme(value);
      }
    }
  });

  observer.observe(targetElement, {
    attributes: true,
    attributeOldValue: true,
  });

  function changeGiscusTheme(theme = 'light') {
    const iframe = document.querySelector('.giscus-frame');
    if (iframe) {
      const config = {
        giscus: {
          setConfig: {
            theme: theme.toLocaleLowerCase(),
          },
        },
      };
      iframe.contentWindow.postMessage(config, 'https://giscus.app');
      const script = document.querySelector('script[data-script-id="giscus"]');
      script.setAttribute('data-theme', theme);
    }
  }
})();
