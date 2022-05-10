;(() => {
  const scrollSmoothOffset = 56;
  function updateScroll() {
    const heading = document.getElementById(decodeURIComponent(location.hash.replace(/^#/, '')));
    if (heading) {
      document.scrollingElement.scrollTop = heading.offsetTop - scrollSmoothOffset + 3;
    }
  }

  function preventClickHandle(selector) {
    const mdContainer = document.querySelectorAll(selector);
    if (mdContainer && mdContainer.length > 0) {
      mdContainer.forEach((anchor) => {
        anchor.addEventListener('click', (e) => {
          e.preventDefault();
          location.hash = anchor.getAttribute('href');
          updateScroll();
          updateAnchor();
          tocsCollapse()
        });
      });
    }
  }
  function scrollListener(evn) {
    const anchors = document.querySelectorAll('markdown-style a.anchor[href*="#"][aria-hidden]');
    const scrollTop = evn && evn.target && evn.target.scrollingElement && evn.target.scrollingElement.scrollTop;
    let element;
    let index = 0;
    anchors.forEach((anchor, idx) => {
      if (anchor.offsetTop - scrollSmoothOffset < scrollTop || (idx === 0 && anchor.offsetTop > scrollTop)) {
        element = anchor;
        index = idx;
      }
    });

    if (element) {
      const tocElement = document.querySelector(`a.tocs-link[href='${decodeURIComponent(element.hash)}']`);
      if (tocElement) {
        updateAnchor(tocElement)
        tocsCollapse(tocElement);
      } else {
        const first = document.querySelector('a.tocs-link[href*="#"]');
        if (index === 0 && first) {
          updateAnchor(first);
          tocsCollapse(first);
        }
      }
    }
  }

  document.addEventListener('scroll', scrollListener, false);

  function updateAnchor(element) {
    const anchorContainer = document.querySelectorAll('.tocs aside.inner.toc a.tocs-link');
    anchorContainer.forEach((tocanchor) => {
      tocanchor.classList.remove('is-active-link');
    });
    const anchor = element || document.querySelector(`a.tocs-link[href='${decodeURIComponent(location.hash)}']`);
    if (anchor) {
      anchor.classList.add('is-active-link');
    }
  }

  function tocsCollapse(element) {
    const tocContainer = document.querySelector('nav.tocs > aside.inner.toc');
    if (element) {
      tocContainer.scrollTop = element.offsetTop;
    }

    const list = document.querySelectorAll('aside.toc ol.tocs-list');
    list.forEach((item) => {
      item.classList.remove('is-open');
    });
    if (element && element.nextElementSibling) {
      element.nextElementSibling.classList.add('is-open');
    }
    isOpen(element);
  }

  function isOpen(element) {
    if (!element) {
      element = document.querySelector(`a.tocs-link[href='${decodeURIComponent(location.hash)}']`);
    }
    if (element && element.parentElement && element.parentElement.tagName !== 'ASIDE' && !element.parentElement.classList.contains('toc')) {
      isOpen(element.parentElement);
      if (element.parentElement.classList.contains('is-collapsed')) {
        element.parentElement.classList.add('is-open');
      }
    }
  }

  preventClickHandle('markdown-style a.anchor[href*="#"][aria-hidden]');
  preventClickHandle('.tocs aside.inner.toc a.tocs-link');

  function updateSiderBarScroll() {
    const siderBar = document.querySelector(".sidebar[role*='navigation']");
    const siderAnchor = document.querySelector(".sidebar[role*='navigation'] a[class*='active']");
    if (siderAnchor) {
      siderBar.scrollTop = siderAnchor.offsetTop;
    }
  }

  const timer = setTimeout(() => {
    updateSiderBarScroll();
    updateScroll();
    updateAnchor();
    tocsCollapse()
    clearTimeout(timer);
  }, 100);

})();