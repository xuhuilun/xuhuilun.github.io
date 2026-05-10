// Fetch and inject the shared header component
(async function(){
  try{
    const resp = await fetch('/components/header.html', {cache: 'no-cache'});
    if (!resp.ok) return;
    const html = await resp.text();
    const placeholder = document.getElementById('site-header-placeholder');
    if (placeholder) {
      // replace placeholder with header HTML
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      placeholder.replaceWith(wrapper.firstElementChild);
    }
  }catch(e){
    console.warn('include-header failed', e);
  }
})();
