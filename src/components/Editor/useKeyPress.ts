import { useEffect } from 'react';

export const useKeyPress = (targetKey: any, fn: any, elementId?: any, asRegexWhitelist?: boolean) => {
  useEffect(() => {
    function downHandler(event: any) {
      const { key, keyCode } = event;
      if (elementId && event.target.getAttribute('id') !== elementId) {
        return;
      }
      if (asRegexWhitelist) {
        if (targetKey.test(key)) {
          fn(event);
        }
      } else if (key === targetKey || keyCode === targetKey) {
        fn(event);
      }
    }
    window.addEventListener('keydown', downHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  }, [targetKey, fn]);
};