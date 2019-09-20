import { useEffect } from 'react';

export const useKeyPress = (targetKey: any, fn: any, elementId?: any, withModifier?: boolean) => {
  useEffect(() => {
    function downHandler(event: any) {
      const { key, keyCode } = event;
      if (elementId && event.target.getAttribute('id') !== elementId) {
        return;
      }
      if (!withModifier && (event.ctrlKey || event.metaKey)) {
        // ignore key combination like ctrl+c/command+c unless we specifically asked to use with modifier
        return;
      }
      if (typeof targetKey === 'string' || typeof targetKey === 'number') {
        if (key === targetKey || keyCode === targetKey) {
          if (withModifier) {
            if (event.ctrlKey || event.metaKey) {
              fn(event);
            }
          } else {
            fn(event);
          }
        }
      } else if (targetKey.test(key)) {
        if (withModifier) {
          if (event.ctrlKey || event.metaKey) {
            fn(event);
          }
        } else {
          fn(event);
        }
      }
    }
    window.addEventListener('keydown', downHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  }, [targetKey, fn]);
};