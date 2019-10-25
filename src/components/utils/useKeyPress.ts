 import { useEffect } from 'react';

 export const useKeyPress = (targetKey: any, fn: any, options?: any) => {
  useEffect(() => {
    const ref = (options && options.hasOwnProperty('ref')) ? options.ref : null;
    const id = (options && options.hasOwnProperty('id')) ? options.id : null;
    const withModifier = (options && options.hasOwnProperty('withModifier')) ? options.withModifier : false;
    const withShift = (options && options.hasOwnProperty('withShift')) ? options.withShift : false;
    const isActive = (options && options.hasOwnProperty('isActive')) ? options.isActive : true;
    // const log = (options && options.hasOwnProperty('log')) ? options.log : '';

    if (isActive === false) {
      return;
    }
    function downHandler(event: any) {
      const { key, keyCode } = event;
      if (id && event.target.getAttribute('id') !== id) {
        return;
      }
      if (!withModifier && (event.ctrlKey || event.metaKey)) {
        // ignore key combination like ctrl+c/command+c unless we specifically asked to use with modifier
        return;
      }
      if (
        (typeof targetKey === 'string' && key === targetKey) ||
        (typeof targetKey === 'number' && keyCode === targetKey) ||
        (targetKey.test && targetKey.test(key))) {
          if (withModifier && !withShift) {
            if ((event.ctrlKey || event.metaKey) && !event.shiftKey) {
              fn(event);
            }
          } else if (!withModifier && withShift) {
            if (!event.ctrlKey && !event.metaKey && event.shiftKey) {
              fn(event);
            }
          } else if (withModifier && withShift) {
            if ((event.ctrlKey || event.metaKey) && event.shiftKey) {
              fn(event);
            }
          } else {
            fn(event);
          }
      }
    }
    if (ref && ref.current) {
      // console.log(`add event listener ${log} - ref`);
      ref.current.addEventListener('keydown', downHandler);
    } else {
      // console.log(`add event listener ${log} - window`);
      window.addEventListener('keydown', downHandler);
    }
    return () => {
      if (ref && ref.current) {
        // console.log(`remove event listener ${log} - ref`);
        ref.current.removeEventListener('keydown', downHandler);
      } else {
        // console.log(`remove event listener ${log} - window`);
        window.removeEventListener('keydown', downHandler);
      }
    };
  });
};
