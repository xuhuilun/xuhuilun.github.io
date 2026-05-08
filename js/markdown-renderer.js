(function() {
  function renderMarkdown() {
    var el = document.getElementById('article-body');
    if (!el) return;
    var src = el.dataset.mdSrc;
    if (!src) {
      el.textContent = '未找到 Markdown 来源，请检查 data-md-src 属性。';
      return;
    }

    fetch(new URL(src, window.location.href).href)
      .then(function(response) {
        if (!response.ok) throw new Error('无法加载 Markdown 文件：' + response.statusText);
        return response.text();
      })
      .then(function(markdown) {
        if (typeof markdownit !== 'function') {
          throw new Error('未找到 markdown-it，请检查脚本是否已正确加载。');
        }
        var md = markdownit({ html: true, linkify: true, typographer: true });
        el.innerHTML = md.render(markdown);
      })
      .catch(function(err) {
        console.error(err);
        el.innerHTML = '<div class="markdown-error">加载文章失败：' + err.message + '</div>';
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderMarkdown);
  } else {
    renderMarkdown();
  }
})();
