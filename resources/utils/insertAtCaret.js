// https://github.com/karalamalar/insertAtCaret

export default (ele, text) => {
  let input = ele,
    scrollPos, strPosStart = 0,
    strPosEnd = 0,
    isModernBrowser = ("selectionStart" in input && "selectionEnd" in input),
    before, after, range, selection;

  if (!((input.tagName && input.tagName.toLowerCase() === "textarea") || (input.tagName && input.tagName.toLowerCase() === "input" && input.type.toLowerCase() === "text"))) {
    return;
  }

  scrollPos = input.scrollTop;

  if (isModernBrowser) {
    strPosStart = input.selectionStart;
    strPosEnd = input.selectionEnd;
  } else {
    input.focus();
    range = document.selection.createRange();
    range.moveStart('character', -input.value.length);
    strPosStart = range.text.length;
  }

  if (strPosEnd < strPosStart)
    strPosEnd = strPosStart;

  before = (input.value).substring(0, strPosStart);
  after = (input.value).substring(strPosEnd, input.value.length);
  input.value = before + text + after;
  strPosStart = strPosStart + text.length;

  if (isModernBrowser) {
    input.selectionStart = strPosStart;
    input.selectionEnd = strPosStart;
  } else {
    range = document.selection.createRange();
    range.moveStart('character', strPosStart);
    range.moveEnd('character', 0);
    range.select();
  }

  input.scrollTop = scrollPos;
}
