"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useKeyPress = void 0;

var _react = require("react");

var useKeyPress = function useKeyPress(targetKey, fn, options) {
  (0, _react.useEffect)(function () {
    var ref = options && options.hasOwnProperty('ref') ? options.ref : null;
    var id = options && options.hasOwnProperty('id') ? options.id : null;
    var withModifier = options && options.hasOwnProperty('withModifier') ? options.withModifier : false;
    var withShift = options && options.hasOwnProperty('withShift') ? options.withShift : false;
    var isActive = options && options.hasOwnProperty('isActive') ? options.isActive : true; // const log = (options && options.hasOwnProperty('log')) ? options.log : '';

    if (isActive === false) {
      return;
    }

    function downHandler(event) {
      var key = event.key,
          keyCode = event.keyCode;

      if (id && event.target.getAttribute('id') !== id) {
        return;
      }

      if (!withModifier && (event.ctrlKey || event.metaKey)) {
        // ignore key combination like ctrl+c/command+c unless we specifically asked to use with modifier
        return;
      }

      if (typeof targetKey === 'string' && key === targetKey || typeof targetKey === 'number' && keyCode === targetKey || targetKey.test && targetKey.test(key)) {
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

    return function () {
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

exports.useKeyPress = useKeyPress;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3V0aWxzL3VzZUtleVByZXNzLnRzIl0sIm5hbWVzIjpbInVzZUtleVByZXNzIiwidGFyZ2V0S2V5IiwiZm4iLCJvcHRpb25zIiwicmVmIiwiaGFzT3duUHJvcGVydHkiLCJpZCIsIndpdGhNb2RpZmllciIsIndpdGhTaGlmdCIsImlzQWN0aXZlIiwiZG93bkhhbmRsZXIiLCJldmVudCIsImtleSIsImtleUNvZGUiLCJ0YXJnZXQiLCJnZXRBdHRyaWJ1dGUiLCJjdHJsS2V5IiwibWV0YUtleSIsInRlc3QiLCJzaGlmdEtleSIsImN1cnJlbnQiLCJhZGRFdmVudExpc3RlbmVyIiwid2luZG93IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFDOztBQUVNLElBQU1BLFdBQVcsR0FBRyxTQUFkQSxXQUFjLENBQUNDLFNBQUQsRUFBaUJDLEVBQWpCLEVBQTBCQyxPQUExQixFQUE0QztBQUNyRSx3QkFBVSxZQUFNO0FBQ2QsUUFBTUMsR0FBRyxHQUFJRCxPQUFPLElBQUlBLE9BQU8sQ0FBQ0UsY0FBUixDQUF1QixLQUF2QixDQUFaLEdBQTZDRixPQUFPLENBQUNDLEdBQXJELEdBQTJELElBQXZFO0FBQ0EsUUFBTUUsRUFBRSxHQUFJSCxPQUFPLElBQUlBLE9BQU8sQ0FBQ0UsY0FBUixDQUF1QixJQUF2QixDQUFaLEdBQTRDRixPQUFPLENBQUNHLEVBQXBELEdBQXlELElBQXBFO0FBQ0EsUUFBTUMsWUFBWSxHQUFJSixPQUFPLElBQUlBLE9BQU8sQ0FBQ0UsY0FBUixDQUF1QixjQUF2QixDQUFaLEdBQXNERixPQUFPLENBQUNJLFlBQTlELEdBQTZFLEtBQWxHO0FBQ0EsUUFBTUMsU0FBUyxHQUFJTCxPQUFPLElBQUlBLE9BQU8sQ0FBQ0UsY0FBUixDQUF1QixXQUF2QixDQUFaLEdBQW1ERixPQUFPLENBQUNLLFNBQTNELEdBQXVFLEtBQXpGO0FBQ0EsUUFBTUMsUUFBUSxHQUFJTixPQUFPLElBQUlBLE9BQU8sQ0FBQ0UsY0FBUixDQUF1QixVQUF2QixDQUFaLEdBQWtERixPQUFPLENBQUNNLFFBQTFELEdBQXFFLElBQXRGLENBTGMsQ0FNZDs7QUFFQSxRQUFJQSxRQUFRLEtBQUssS0FBakIsRUFBd0I7QUFDdEI7QUFDRDs7QUFDRCxhQUFTQyxXQUFULENBQXFCQyxLQUFyQixFQUFpQztBQUFBLFVBQ3ZCQyxHQUR1QixHQUNORCxLQURNLENBQ3ZCQyxHQUR1QjtBQUFBLFVBQ2xCQyxPQURrQixHQUNORixLQURNLENBQ2xCRSxPQURrQjs7QUFFL0IsVUFBSVAsRUFBRSxJQUFJSyxLQUFLLENBQUNHLE1BQU4sQ0FBYUMsWUFBYixDQUEwQixJQUExQixNQUFvQ1QsRUFBOUMsRUFBa0Q7QUFDaEQ7QUFDRDs7QUFDRCxVQUFJLENBQUNDLFlBQUQsS0FBa0JJLEtBQUssQ0FBQ0ssT0FBTixJQUFpQkwsS0FBSyxDQUFDTSxPQUF6QyxDQUFKLEVBQXVEO0FBQ3JEO0FBQ0E7QUFDRDs7QUFDRCxVQUNHLE9BQU9oQixTQUFQLEtBQXFCLFFBQXJCLElBQWlDVyxHQUFHLEtBQUtYLFNBQTFDLElBQ0MsT0FBT0EsU0FBUCxLQUFxQixRQUFyQixJQUFpQ1ksT0FBTyxLQUFLWixTQUQ5QyxJQUVDQSxTQUFTLENBQUNpQixJQUFWLElBQWtCakIsU0FBUyxDQUFDaUIsSUFBVixDQUFlTixHQUFmLENBSHJCLEVBRzJDO0FBQ3ZDLFlBQUlMLFlBQVksSUFBSSxDQUFDQyxTQUFyQixFQUFnQztBQUM5QixjQUFJLENBQUNHLEtBQUssQ0FBQ0ssT0FBTixJQUFpQkwsS0FBSyxDQUFDTSxPQUF4QixLQUFvQyxDQUFDTixLQUFLLENBQUNRLFFBQS9DLEVBQXlEO0FBQ3ZEakIsWUFBQUEsRUFBRSxDQUFDUyxLQUFELENBQUY7QUFDRDtBQUNGLFNBSkQsTUFJTyxJQUFJLENBQUNKLFlBQUQsSUFBaUJDLFNBQXJCLEVBQWdDO0FBQ3JDLGNBQUksQ0FBQ0csS0FBSyxDQUFDSyxPQUFQLElBQWtCLENBQUNMLEtBQUssQ0FBQ00sT0FBekIsSUFBb0NOLEtBQUssQ0FBQ1EsUUFBOUMsRUFBd0Q7QUFDdERqQixZQUFBQSxFQUFFLENBQUNTLEtBQUQsQ0FBRjtBQUNEO0FBQ0YsU0FKTSxNQUlBLElBQUlKLFlBQVksSUFBSUMsU0FBcEIsRUFBK0I7QUFDcEMsY0FBSSxDQUFDRyxLQUFLLENBQUNLLE9BQU4sSUFBaUJMLEtBQUssQ0FBQ00sT0FBeEIsS0FBb0NOLEtBQUssQ0FBQ1EsUUFBOUMsRUFBd0Q7QUFDdERqQixZQUFBQSxFQUFFLENBQUNTLEtBQUQsQ0FBRjtBQUNEO0FBQ0YsU0FKTSxNQUlBO0FBQ0xULFVBQUFBLEVBQUUsQ0FBQ1MsS0FBRCxDQUFGO0FBQ0Q7QUFDSjtBQUNGOztBQUNELFFBQUlQLEdBQUcsSUFBSUEsR0FBRyxDQUFDZ0IsT0FBZixFQUF3QjtBQUN0QjtBQUNBaEIsTUFBQUEsR0FBRyxDQUFDZ0IsT0FBSixDQUFZQyxnQkFBWixDQUE2QixTQUE3QixFQUF3Q1gsV0FBeEM7QUFDRCxLQUhELE1BR087QUFDTDtBQUNBWSxNQUFBQSxNQUFNLENBQUNELGdCQUFQLENBQXdCLFNBQXhCLEVBQW1DWCxXQUFuQztBQUNEOztBQUNELFdBQU8sWUFBTTtBQUNYLFVBQUlOLEdBQUcsSUFBSUEsR0FBRyxDQUFDZ0IsT0FBZixFQUF3QjtBQUN0QjtBQUNBaEIsUUFBQUEsR0FBRyxDQUFDZ0IsT0FBSixDQUFZRyxtQkFBWixDQUFnQyxTQUFoQyxFQUEyQ2IsV0FBM0M7QUFDRCxPQUhELE1BR087QUFDTDtBQUNBWSxRQUFBQSxNQUFNLENBQUNDLG1CQUFQLENBQTJCLFNBQTNCLEVBQXNDYixXQUF0QztBQUNEO0FBQ0YsS0FSRDtBQVNELEdBekREO0FBMERELENBM0RNIiwic291cmNlc0NvbnRlbnQiOlsiIGltcG9ydCB7IHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IGNvbnN0IHVzZUtleVByZXNzID0gKHRhcmdldEtleTogYW55LCBmbjogYW55LCBvcHRpb25zPzogYW55KSA9PiB7XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgcmVmID0gKG9wdGlvbnMgJiYgb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgncmVmJykpID8gb3B0aW9ucy5yZWYgOiBudWxsO1xuICAgIGNvbnN0IGlkID0gKG9wdGlvbnMgJiYgb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnaWQnKSkgPyBvcHRpb25zLmlkIDogbnVsbDtcbiAgICBjb25zdCB3aXRoTW9kaWZpZXIgPSAob3B0aW9ucyAmJiBvcHRpb25zLmhhc093blByb3BlcnR5KCd3aXRoTW9kaWZpZXInKSkgPyBvcHRpb25zLndpdGhNb2RpZmllciA6IGZhbHNlO1xuICAgIGNvbnN0IHdpdGhTaGlmdCA9IChvcHRpb25zICYmIG9wdGlvbnMuaGFzT3duUHJvcGVydHkoJ3dpdGhTaGlmdCcpKSA/IG9wdGlvbnMud2l0aFNoaWZ0IDogZmFsc2U7XG4gICAgY29uc3QgaXNBY3RpdmUgPSAob3B0aW9ucyAmJiBvcHRpb25zLmhhc093blByb3BlcnR5KCdpc0FjdGl2ZScpKSA/IG9wdGlvbnMuaXNBY3RpdmUgOiB0cnVlO1xuICAgIC8vIGNvbnN0IGxvZyA9IChvcHRpb25zICYmIG9wdGlvbnMuaGFzT3duUHJvcGVydHkoJ2xvZycpKSA/IG9wdGlvbnMubG9nIDogJyc7XG4gICAgXG4gICAgaWYgKGlzQWN0aXZlID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBmdW5jdGlvbiBkb3duSGFuZGxlcihldmVudDogYW55KSB7XG4gICAgICBjb25zdCB7IGtleSwga2V5Q29kZSB9ID0gZXZlbnQ7XG4gICAgICBpZiAoaWQgJiYgZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgnaWQnKSAhPT0gaWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaWYgKCF3aXRoTW9kaWZpZXIgJiYgKGV2ZW50LmN0cmxLZXkgfHwgZXZlbnQubWV0YUtleSkpIHtcbiAgICAgICAgLy8gaWdub3JlIGtleSBjb21iaW5hdGlvbiBsaWtlIGN0cmwrYy9jb21tYW5kK2MgdW5sZXNzIHdlIHNwZWNpZmljYWxseSBhc2tlZCB0byB1c2Ugd2l0aCBtb2RpZmllclxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoXG4gICAgICAgICh0eXBlb2YgdGFyZ2V0S2V5ID09PSAnc3RyaW5nJyAmJiBrZXkgPT09IHRhcmdldEtleSkgfHwgXG4gICAgICAgICh0eXBlb2YgdGFyZ2V0S2V5ID09PSAnbnVtYmVyJyAmJiBrZXlDb2RlID09PSB0YXJnZXRLZXkpIHx8IFxuICAgICAgICAodGFyZ2V0S2V5LnRlc3QgJiYgdGFyZ2V0S2V5LnRlc3Qoa2V5KSkpIHtcbiAgICAgICAgICBpZiAod2l0aE1vZGlmaWVyICYmICF3aXRoU2hpZnQpIHtcbiAgICAgICAgICAgIGlmICgoZXZlbnQuY3RybEtleSB8fCBldmVudC5tZXRhS2V5KSAmJiAhZXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgICAgICAgICAgZm4oZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoIXdpdGhNb2RpZmllciAmJiB3aXRoU2hpZnQpIHtcbiAgICAgICAgICAgIGlmICghZXZlbnQuY3RybEtleSAmJiAhZXZlbnQubWV0YUtleSAmJiBldmVudC5zaGlmdEtleSkge1xuICAgICAgICAgICAgICBmbihldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmICh3aXRoTW9kaWZpZXIgJiYgd2l0aFNoaWZ0KSB7XG4gICAgICAgICAgICBpZiAoKGV2ZW50LmN0cmxLZXkgfHwgZXZlbnQubWV0YUtleSkgJiYgZXZlbnQuc2hpZnRLZXkpIHtcbiAgICAgICAgICAgICAgZm4oZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmbihldmVudCk7XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAocmVmICYmIHJlZi5jdXJyZW50KSB7XG4gICAgICAvLyBjb25zb2xlLmxvZyhgYWRkIGV2ZW50IGxpc3RlbmVyICR7bG9nfSAtIHJlZmApO1xuICAgICAgcmVmLmN1cnJlbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGRvd25IYW5kbGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gY29uc29sZS5sb2coYGFkZCBldmVudCBsaXN0ZW5lciAke2xvZ30gLSB3aW5kb3dgKTtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZG93bkhhbmRsZXIpO1xuICAgIH1cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaWYgKHJlZiAmJiByZWYuY3VycmVudCkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhgcmVtb3ZlIGV2ZW50IGxpc3RlbmVyICR7bG9nfSAtIHJlZmApO1xuICAgICAgICByZWYuY3VycmVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZG93bkhhbmRsZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coYHJlbW92ZSBldmVudCBsaXN0ZW5lciAke2xvZ30gLSB3aW5kb3dgKTtcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBkb3duSGFuZGxlcik7XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG59OyJdfQ==