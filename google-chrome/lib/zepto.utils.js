$.createScript = (code = '') => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.textContent = code;
  document.getElementsByTagName('head')[0].appendChild(script);
};

$.createStyle = (code = '') => {
  const style = document.createElement('style');
  style.type = 'text/css';
  style.textContent = code;
  document.getElementsByTagName('head')[0].appendChild(style);
};

$.escapeHTML = (str) => str.replace(/[&"<>]/g, (m) => ({ "&": "&amp;", '"': "&quot;", "<": "&lt;", ">": "&gt;" })[m]);
