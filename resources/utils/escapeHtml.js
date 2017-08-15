let container = null;

export default html => {
  if (container === null) {
    container = document.createElement('div');
  }
  container.innerText = html;
  return container.innerHTML;
}
