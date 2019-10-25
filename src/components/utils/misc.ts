export const setCaretPosition = (element: any, caretPos: number) => {
  // (el.selectionStart === 0 added for Firefox bug)
  if (element.selectionStart || element.selectionStart === 0) {
    element.focus();
    element.setSelectionRange(caretPos, caretPos);
    return true;
  }
  return false;
};

export const setCaretPositionAtEnd = (element: HTMLInputElement) => {
  const end = element.value.length;
  setCaretPosition(element, end);
};

export const focusCell = (id: string, focusTimeout: number = 1, scrollTo: boolean = false) => {
  const element = document.getElementById(id);
  if (element) {
    if (scrollTo) {
      element.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'});
    }
    setTimeout(() => {
      element.focus();
    }, focusTimeout);
  }
};

export const getRowColumnFromId = (id: string) => {
  const currentIdArr: string[] = id.split(' ');
  const row = Number.parseInt(currentIdArr[1], 10);
  const column = Number.parseInt(currentIdArr[3], 10);
  return {
    row,
    column,
  };
};
