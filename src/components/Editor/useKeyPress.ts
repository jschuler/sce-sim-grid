import { useEffect } from 'react';

export const useKeyPress = (targetKey: any, fn: any, elementId?: any) => {
  useEffect(() => {
    function downHandler(event: any) {
      debugger;
      const { key, keyCode } = event;
      if (elementId && event.target.getAttribute('id') !== elementId) {
        return;
      }
      if (key === targetKey || keyCode === targetKey) {
        fn();
      }
    }
    window.addEventListener('keydown', downHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
    };
  }, [targetKey, fn]);
};