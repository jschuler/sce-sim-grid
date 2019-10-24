"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChangeTracker = void 0;

var React = _interopRequireWildcard(require("react"));

var _reactCore = require("@patternfly/react-core");

var _reactIcons = require("@patternfly/react-icons");

var _utils = require("../utils");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var ChangeTracker = React.memo(function (_ref) {
  var undoRedo = _ref.undoRedo,
      onUndo = _ref.onUndo,
      onRedo = _ref.onRedo;
  console.log('render ChangeTracker');

  var _React$useState = React.useState({
    undoRedo: undoRedo
  }),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      stateFromProps = _React$useState2[0],
      setStateFromProps = _React$useState2[1];

  React.useEffect(function () {
    // sync props to state
    setStateFromProps({
      undoRedo: undoRedo
    });
  }, [undoRedo]);
  /**
   * The text to display for the change-tracker
   */

  var getChangeText = function getChangeText() {
    if (stateFromProps.undoRedo.undoList.length === 1) {
      return "1 change";
    } else {
      return "".concat(stateFromProps.undoRedo.undoList.length, " changes");
    }
  };
  /**
   * When a cell id is clicked in the change-tracker, it scrolls and focuses the corresponding element in the grid
   */


  var focusElement = function focusElement(id) {
    (0, _utils.focusCell)(id, 250, true);
  };
  /**
   * The change-tracker element
   */


  var changeTracker = function changeTracker() {
    var input = React.createElement("input", {
      className: "pf-c-form-control pf-u-px-md",
      type: "button",
      id: "textInput10",
      name: "textInput10",
      "aria-label": "Input example with popover",
      value: getChangeText()
    });

    if (stateFromProps.undoRedo.undoList.length) {
      return React.createElement(_reactCore.Expandable, {
        toggleText: getChangeText(),
        className: "kie-changes pf-u-mx-sm"
      }, React.createElement("div", {
        className: "pf-c-content"
      }, React.createElement("dl", null, stateFromProps.undoRedo.undoList.map(function (change, index) {
        return React.createElement(React.Fragment, {
          key: index
        }, React.createElement("dt", null, React.createElement(_reactCore.Button, {
          variant: "link",
          onClick: function onClick() {
            return focusElement(change.id);
          },
          isInline: true
        }, change.id)), React.createElement("dd", null, change.value));
      }))));
    } else {
      return input;
    }
  }; // const redoTracker = () => {
  //   return (
  //     <Expandable toggleText={(stateFromProps.redoList.length).toString()} className="kie-changes pf-u-mx-sm">
  //       <div className="pf-c-content">
  //         <dl>
  //           {stateFromProps.redoList.map((redo: any, index: number) => (
  //             <React.Fragment key={index}>
  //               <dt><Button variant="link" onClick={() => focusElement(redo.id)} isInline>{redo.id}</Button></dt>
  //               <dd>{redo.value}</dd>
  //             </React.Fragment>
  //           ))}
  //         </dl>
  //       </div>
  //     </Expandable>
  //   );
  // }


  return React.createElement(_reactCore.ToolbarItem, null, React.createElement("div", {
    className: "pf-c-input-group"
  }, React.createElement(_reactCore.Button, {
    onClick: onUndo,
    variant: "control",
    isDisabled: stateFromProps.undoRedo.undoList.length === 0
  }, React.createElement(_reactIcons.UndoIcon, null)), changeTracker(), React.createElement(_reactCore.Button, {
    onClick: onRedo,
    variant: "control",
    isDisabled: stateFromProps.undoRedo.redoList.length === 0
  }, React.createElement(_reactIcons.RedoIcon, null))));
}, function (prevProps, nextProps) {
  if (prevProps.undoRedo.undoList.length !== nextProps.undoRedo.undoList.length || JSON.stringify(prevProps.undoRedo.undoList) !== JSON.stringify(nextProps.undoRedo.undoList)) {
    // last changed cell has changed, re-render
    return false;
  }

  if (prevProps.undoRedo.redoList.length !== nextProps.undoRedo.redoList.length || JSON.stringify(prevProps.undoRedo.redoList) !== JSON.stringify(nextProps.undoRedo.redoList)) {
    // last changed cell has changed, re-render
    return false;
  }

  return true;
}); // @ts-ignore

exports.ChangeTracker = ChangeTracker;
ChangeTracker.whyDidYouRender = {
  customName: 'ChangeTracker'
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvY29tcG9uZW50cy9Ub29sYmFyL0NoYW5nZVRyYWNrZXIudHN4Il0sIm5hbWVzIjpbIkNoYW5nZVRyYWNrZXIiLCJSZWFjdCIsIm1lbW8iLCJ1bmRvUmVkbyIsIm9uVW5kbyIsIm9uUmVkbyIsImNvbnNvbGUiLCJsb2ciLCJ1c2VTdGF0ZSIsInN0YXRlRnJvbVByb3BzIiwic2V0U3RhdGVGcm9tUHJvcHMiLCJ1c2VFZmZlY3QiLCJnZXRDaGFuZ2VUZXh0IiwidW5kb0xpc3QiLCJsZW5ndGgiLCJmb2N1c0VsZW1lbnQiLCJpZCIsImNoYW5nZVRyYWNrZXIiLCJpbnB1dCIsIm1hcCIsImNoYW5nZSIsImluZGV4IiwidmFsdWUiLCJyZWRvTGlzdCIsInByZXZQcm9wcyIsIm5leHRQcm9wcyIsIkpTT04iLCJzdHJpbmdpZnkiLCJ3aHlEaWRZb3VSZW5kZXIiLCJjdXN0b21OYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBS0E7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FBRUEsSUFBTUEsYUFBYSxHQUFHQyxLQUFLLENBQUNDLElBQU4sQ0FJbkIsZ0JBQWtDO0FBQUEsTUFBL0JDLFFBQStCLFFBQS9CQSxRQUErQjtBQUFBLE1BQXJCQyxNQUFxQixRQUFyQkEsTUFBcUI7QUFBQSxNQUFiQyxNQUFhLFFBQWJBLE1BQWE7QUFDbkNDLEVBQUFBLE9BQU8sQ0FBQ0MsR0FBUixDQUFZLHNCQUFaOztBQURtQyx3QkFHU04sS0FBSyxDQUFDTyxRQUFOLENBQWU7QUFDekRMLElBQUFBLFFBQVEsRUFBUkE7QUFEeUQsR0FBZixDQUhUO0FBQUE7QUFBQSxNQUc1Qk0sY0FINEI7QUFBQSxNQUdaQyxpQkFIWTs7QUFPbkNULEVBQUFBLEtBQUssQ0FBQ1UsU0FBTixDQUFnQixZQUFNO0FBQ3BCO0FBQ0FELElBQUFBLGlCQUFpQixDQUFDO0FBQUVQLE1BQUFBLFFBQVEsRUFBUkE7QUFBRixLQUFELENBQWpCO0FBQ0QsR0FIRCxFQUdHLENB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UyxDQUFDdEIsUUFBVixDQUFtQlUsUUFBbkIsQ0FBNEJDLE1BQW5FLElBQTZFWSxJQUFJLENBQUNDLFNBQUwsQ0FBZUgsU0FBUyxDQUFDckIsUUFBVixDQUFtQlUsUUFBbEMsTUFBZ0RhLElBQUksQ0FBQ0MsU0FBTCxDQUFlRixTQUFTLENBQUN0QixRQUFWLENBQW1CVSxRQUFsQyxDQUFqSSxFQUE4SztBQUM1SztBQUNBLFdBQU8sS0FBUDtBQUNEOztBQUNELE1BQUlXLFNBQVMsQ0FBQ3JCLFFBQVYsQ0FBbUJvQixRQUFuQixDQUE0QlQsTUFBNUIsS0FBdUNXLFNBQVMsQ0FBQ3RCLFFBQVYsQ0FBbUJvQixRQUFuQixDQUE0QlQsTUFBbkUsSUFBNkVZLElBQUksQ0FBQ0MsU0FBTCxDQUFlSCxTQUFTLENBQUNyQixRQUFWLENBQW1Cb0IsUUFBbEMsTUFBZ0RHLElBQUksQ0FBQ0MsU0FBTCxDQUFlRixTQUFTLENBQUN0QixRQUFWLENBQW1Cb0IsUUFBbEMsQ0FBakksRUFBOEs7QUFDNUs7QUFDQSxXQUFPLEtBQVA7QUFDRDs7QUFDRCxTQUFPLElBQVA7QUFDRCxDQTdHcUIsQ0FBdEIsQyxDQStHQTs7O0FBQ0F2QixhQUFhLENBQUM0QixlQUFkLEdBQWdDO0FBQzlCQyxFQUFBQSxVQUFVLEVBQUU7QUFEa0IsQ0FBaEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQge1xuICBCdXR0b24sXG4gIFRvb2xiYXJJdGVtLFxuICBFeHBhbmRhYmxlXG59IGZyb20gJ0BwYXR0ZXJuZmx5L3JlYWN0LWNvcmUnO1xuaW1wb3J0IHsgVW5kb0ljb24sIFJlZG9JY29uIH0gZnJvbSAnQHBhdHRlcm5mbHkvcmVhY3QtaWNvbnMnO1xuaW1wb3J0IHsgZm9jdXNDZWxsIH0gZnJvbSAnLi4vdXRpbHMnO1xuXG5jb25zdCBDaGFuZ2VUcmFja2VyID0gUmVhY3QubWVtbzx7IFxuICB1bmRvUmVkbzogYW55LFxuICBvblVuZG86IGFueSxcbiAgb25SZWRvOiBhbnlcbn0+KCh7IHVuZG9SZWRvLCBvblVuZG8sIG9uUmVkbyB9KSA9PiB7XG4gIGNvbnNvbGUubG9nKCdyZW5kZXIgQ2hhbmdlVHJhY2tlcicpO1xuXG4gIGNvbnN0IFtzdGF0ZUZyb21Qcm9wcywgc2V0U3RhdGVGcm9tUHJvcHNdID0gUmVhY3QudXNlU3RhdGUoeyBcbiAgICB1bmRvUmVkb1xuICB9KTtcblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIC8vIHN5bmMgcHJvcHMgdG8gc3RhdGVcbiAgICBzZXRTdGF0ZUZyb21Qcm9wcyh7IHVuZG9SZWRvIH0pO1xuICB9LCBbIHVuZG9SZWRvIF0pO1xuXG4gIC8qKlxuICAgKiBUaGUgdGV4dCB0byBkaXNwbGF5IGZvciB0aGUgY2hhbmdlLXRyYWNrZXJcbiAgICovXG4gIGNvbnN0IGdldENoYW5nZVRleHQgPSAoKSA9PiB7XG4gICAgaWYgKHN0YXRlRnJvbVByb3BzLnVuZG9SZWRvLnVuZG9MaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIGAxIGNoYW5nZWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBgJHtzdGF0ZUZyb21Qcm9wcy51bmRvUmVkby51bmRvTGlzdC5sZW5ndGh9IGNoYW5nZXNgO1xuICAgIH1cbiAgfTtcblxuICAvKipcbiAgICogV2hlbiBhIGNlbGwgaWQgaXMgY2xpY2tlZCBpbiB0aGUgY2hhbmdlLXRyYWNrZXIsIGl0IHNjcm9sbHMgYW5kIGZvY3VzZXMgdGhlIGNvcnJlc3BvbmRpbmcgZWxlbWVudCBpbiB0aGUgZ3JpZFxuICAgKi9cbiAgY29uc3QgZm9jdXNFbGVtZW50ID0gKGlkOiBzdHJpbmcpID0+IHtcbiAgICBmb2N1c0NlbGwoaWQsIDI1MCwgdHJ1ZSk7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGNoYW5nZS10cmFja2VyIGVsZW1lbnRcbiAgICovXG4gIGNvbnN0IGNoYW5nZVRyYWNrZXIgPSAoKSA9PiB7XG4gICAgY29uc3QgaW5wdXQgPSAoXG4gICAgICA8aW5wdXQgXG4gICAgICAgIGNsYXNzTmFtZT1cInBmLWMtZm9ybS1jb250cm9sIHBmLXUtcHgtbWRcIiBcbiAgICAgICAgdHlwZT1cImJ1dHRvblwiIFxuICAgICAgICBpZD1cInRleHRJbnB1dDEwXCIgXG4gICAgICAgIG5hbWU9XCJ0ZXh0SW5wdXQxMFwiIFxuICAgICAgICBhcmlhLWxhYmVsPVwiSW5wdXQgZXhhbXBsZSB3aXRoIHBvcG92ZXJcIiBcbiAgICAgICAgdmFsdWU9e2dldENoYW5nZVRleHQoKX1cbiAgICAgIC8+XG4gICAgKTtcbiAgICBpZiAoc3RhdGVGcm9tUHJvcHMudW5kb1JlZG8udW5kb0xpc3QubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RXhwYW5kYWJsZSB0b2dnbGVUZXh0PXtnZXRDaGFuZ2VUZXh0KCl9IGNsYXNzTmFtZT1cImtpZS1jaGFuZ2VzIHBmLXUtbXgtc21cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBmLWMtY29udGVudFwiPlxuICAgICAgICAgICAgPGRsPlxuICAgICAgICAgICAgICB7c3RhdGVGcm9tUHJvcHMudW5kb1JlZG8udW5kb0xpc3QubWFwKChjaGFuZ2U6IGFueSwgaW5kZXg6IG51bWJlcikgPT4gKFxuICAgICAgICAgICAgICAgIDxSZWFjdC5GcmFnbWVudCBrZXk9e2luZGV4fT5cbiAgICAgICAgICAgICAgICAgIDxkdD48QnV0dG9uIHZhcmlhbnQ9XCJsaW5rXCIgb25DbGljaz17KCkgPT4gZm9jdXNFbGVtZW50KGNoYW5nZS5pZCl9IGlzSW5saW5lPntjaGFuZ2UuaWR9PC9CdXR0b24+PC9kdD5cbiAgICAgICAgICAgICAgICAgIDxkZD57Y2hhbmdlLnZhbHVlfTwvZGQ+XG4gICAgICAgICAgICAgICAgPC9SZWFjdC5GcmFnbWVudD5cbiAgICAgICAgICAgICAgKSl9XG4gICAgICAgICAgICA8L2RsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L0V4cGFuZGFibGU+XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gaW5wdXQ7XG4gICAgfVxuICB9XG5cbiAgLy8gY29uc3QgcmVkb1RyYWNrZXIgPSAoKSA9PiB7XG4gIC8vICAgcmV0dXJuIChcbiAgLy8gICAgIDxFeHBhbmRhYmxlIHRvZ2dsZVRleHQ9eyhzdGF0ZUZyb21Qcm9wcy5yZWRvTGlzdC5sZW5ndGgpLnRvU3RyaW5nKCl9IGNsYXNzTmFtZT1cImtpZS1jaGFuZ2VzIHBmLXUtbXgtc21cIj5cbiAgLy8gICAgICAgPGRpdiBjbGFzc05hbWU9XCJwZi1jLWNvbnRlbnRcIj5cbiAgLy8gICAgICAgICA8ZGw+XG4gIC8vICAgICAgICAgICB7c3RhdGVGcm9tUHJvcHMucmVkb0xpc3QubWFwKChyZWRvOiBhbnksIGluZGV4OiBudW1iZXIpID0+IChcbiAgLy8gICAgICAgICAgICAgPFJlYWN0LkZyYWdtZW50IGtleT17aW5kZXh9PlxuICAvLyAgICAgICAgICAgICAgIDxkdD48QnV0dG9uIHZhcmlhbnQ9XCJsaW5rXCIgb25DbGljaz17KCkgPT4gZm9jdXNFbGVtZW50KHJlZG8uaWQpfSBpc0lubGluZT57cmVkby5pZH08L0J1dHRvbj48L2R0PlxuICAvLyAgICAgICAgICAgICAgIDxkZD57cmVkby52YWx1ZX08L2RkPlxuICAvLyAgICAgICAgICAgICA8L1JlYWN0LkZyYWdtZW50PlxuICAvLyAgICAgICAgICAgKSl9XG4gIC8vICAgICAgICAgPC9kbD5cbiAgLy8gICAgICAgPC9kaXY+XG4gIC8vICAgICA8L0V4cGFuZGFibGU+XG4gIC8vICAgKTtcbiAgLy8gfVxuXG4gIHJldHVybiAoXG4gICAgPFRvb2xiYXJJdGVtPlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJwZi1jLWlucHV0LWdyb3VwXCI+XG4gICAgICAgIDxCdXR0b24gb25DbGljaz17b25VbmRvfSB2YXJpYW50PVwiY29udHJvbFwiIGlzRGlzYWJsZWQ9e3N0YXRlRnJvbVByb3BzLnVuZG9SZWRvLnVuZG9MaXN0Lmxlbmd0aCA9PT0gMH0+XG4gICAgICAgICAgPFVuZG9JY29uIC8+XG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgICB7Y2hhbmdlVHJhY2tlcigpfVxuICAgICAgICB7Lyoge3JlZG9UcmFja2VyKCl9ICovfVxuICAgICAgICA8QnV0dG9uIG9uQ2xpY2s9e29uUmVkb30gdmFyaWFudD1cImNvbnRyb2xcIiBpc0Rpc2FibGVkPXtzdGF0ZUZyb21Qcm9wcy51bmRvUmVkby5yZWRvTGlzdC5sZW5ndGggPT09IDB9PlxuICAgICAgICAgIDxSZWRvSWNvbiAvPlxuICAgICAgICA8L0J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgIDwvVG9vbGJhckl0ZW0+XG4gICk7XG59LCAocHJldlByb3BzLCBuZXh0UHJvcHMpID0+IHtcbiAgaWYgKHByZXZQcm9wcy51bmRvUmVkby51bmRvTGlzdC5sZW5ndGggIT09IG5leHRQcm9wcy51bmRvUmVkby51bmRvTGlzdC5sZW5ndGggfHwgSlNPTi5zdHJpbmdpZnkocHJldlByb3BzLnVuZG9SZWRvLnVuZG9MaXN0KSAhPT0gSlNPTi5zdHJpbmdpZnkobmV4dFByb3BzLnVuZG9SZWRvLnVuZG9MaXN0KSkge1xuICAgIC8vIGxhc3QgY2hhbmdlZCBjZWxsIGhhcyBjaGFuZ2VkLCByZS1yZW5kZXJcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKHByZXZQcm9wcy51bmRvUmVkby5yZWRvTGlzdC5sZW5ndGggIT09IG5leHRQcm9wcy51bmRvUmVkby5yZWRvTGlzdC5sZW5ndGggfHwgSlNPTi5zdHJpbmdpZnkocHJldlByb3BzLnVuZG9SZWRvLnJlZG9MaXN0KSAhPT0gSlNPTi5zdHJpbmdpZnkobmV4dFByb3BzLnVuZG9SZWRvLnJlZG9MaXN0KSkge1xuICAgIC8vIGxhc3QgY2hhbmdlZCBjZWxsIGhhcyBjaGFuZ2VkLCByZS1yZW5kZXJcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59KTtcblxuLy8gQHRzLWlnbm9yZVxuQ2hhbmdlVHJhY2tlci53aHlEaWRZb3VSZW5kZXIgPSB7XG4gIGN1c3RvbU5hbWU6ICdDaGFuZ2VUcmFja2VyJ1xufTtcblxuZXhwb3J0IHsgQ2hhbmdlVHJhY2tlciB9OyJdfQ==