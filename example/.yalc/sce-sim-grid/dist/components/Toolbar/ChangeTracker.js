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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1Rvb2xiYXIvQ2hhbmdlVHJhY2tlci50c3giXSwibmFtZXMiOlsiQ2hhbmdlVHJhY2tlciIsIlJlYWN0IiwibWVtbyIsInVuZG9SZWRvIiwib25VbmRvIiwib25SZWRvIiwiY29uc29sZSIsImxvZyIsInVzZVN0YXRlIiwic3RhdGVGcm9tUHJvcHMiLCJzZXRTdGF0ZUZyb21Qcm9wcyIsInVzZUVmZmVjdCIsImdldENoYW5nZVRleHQiLCJ1bmRvTGlzdCIsImxlbmd0aCIsImZvY3VzRWxlbWVudCIsImlkIiwiY2hhbmdlVHJhY2tlciIsImlucHV0IiwibWFwIiwiY2hhbmdlIiwiaW5kZXgiLCJ2YWx1ZSIsInJlZG9MaXN0IiwicHJldlByb3BzIiwibmV4dFByb3BzIiwiSlNPTiIsInN0cmluZ2lmeSIsIndoeURpZFlvdVJlbmRlciIsImN1c3RvbU5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFLQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNQSxhQUFhLEdBQUdDLEtBQUssQ0FBQ0MsSUFBTixDQUluQixnQkFBa0M7QUFBQSxNQUEvQkMsUUFBK0IsUUFBL0JBLFFBQStCO0FBQUEsTUFBckJDLE1BQXFCLFFBQXJCQSxNQUFxQjtBQUFBLE1BQWJDLE1BQWEsUUFBYkEsTUFBYTtBQUNuQ0MsRUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVksc0JBQVo7O0FBRG1DLHdCQUdTTixLQUFLLENBQUNPLFFBQU4sQ0FBZTtBQUN6REwsSUFBQUEsUUFBUSxFQUFSQTtBQUR5RCxHQUFmLENBSFQ7QUFBQTtBQUFBLE1BRzVCTSxjQUg0QjtBQUFBLE1BR1pDLGlCQUhZOztBQU9uQ1QsRUFBQUEsS0FBSyxDQUFDVSxTQUFOLENBQWdCLFlBQU07QUFDcEI7QUFDQUQsSUFBQUEsaUJBQWlCLENBQUM7QUFBRVAsTUFBQUEsUUFBUSxFQUFSQTtBQUFGLEtBQUQsQ0FBakI7QUFDRCxHQUhELEVBR0csQ0FBRUEsUUFBRixDQUhIO0FBS0E7Ozs7QUFHQSxNQUFNUyxhQUFhLEdBQUcsU0FBaEJBLGFBQWdCLEdBQU07QUFDMUIsUUFBSUgsY0FBYyxDQUFDTixRQUFmLENBQXdCVSxRQUF4QixDQUFpQ0MsTUFBakMsS0FBNEMsQ0FBaEQsRUFBbUQ7QUFDakQ7QUFDRCxLQUZELE1BRU87QUFDTCx1QkFBVUwsY0FBYyxDQUFDTixRQUFmLENBQXdCVSxRQUF4QixDQUFpQ0MsTUFBM0M7QUFDRDtBQUNGLEdBTkQ7QUFRQTs7Ozs7QUFHQSxNQUFNQyxZQUFZLEdBQUcsU0FBZkEsWUFBZSxDQUFDQyxFQUFELEVBQWdCO0FBQ25DLDBCQUFVQSxFQUFWLEVBQWMsR0FBZCxFQUFtQixJQUFuQjtBQUNELEdBRkQ7QUFJQTs7Ozs7QUFHQSxNQUFNQyxhQUFhLEdBQUcsU0FBaEJBLGFBQWdCLEdBQU07QUFDMUIsUUFBTUMsS0FBSyxHQUNUO0FBQ0UsTUFBQSxTQUFTLEVBQUMsOEJBRFo7QUFFRSxNQUFBLElBQUksRUFBQyxRQUZQO0FBR0UsTUFBQSxFQUFFLEVBQUMsYUFITDtBQUlFLE1BQUEsSUFBSSxFQUFDLGFBSlA7QUFLRSxvQkFBVyw0QkFMYjtBQU1FLE1BQUEsS0FBSyxFQUFFTixhQUFhO0FBTnRCLE1BREY7O0FBVUEsUUFBSUgsY0FBYyxDQUFDTixRQUFmLENBQXdCVSxRQUF4QixDQUFpQ0MsTUFBckMsRUFBNkM7QUFDM0MsYUFDRSxvQkFBQyxxQkFBRDtBQUFZLFFBQUEsVUFBVSxFQUFFRixhQUFhLEVBQXJDO0FBQXlDLFFBQUEsU0FBUyxFQUFDO0FBQW5ELFNBQ0U7QUFBSyxRQUFBLFNBQVMsRUFBQztBQUFmLFNBQ0UsZ0NBQ0dILGNBQWMsQ0FBQ04sUUFBZixDQUF3QlUsUUFBeEIsQ0FBaUNNLEdBQWpDLENBQXFDLFVBQUNDLE1BQUQsRUFBY0MsS0FBZDtBQUFBLGVBQ3BDLG9CQUFDLEtBQUQsQ0FBTyxRQUFQO0FBQWdCLFVBQUEsR0FBRyxFQUFFQTtBQUFyQixXQUNFLGdDQUFJLG9CQUFDLGlCQUFEO0FBQVEsVUFBQSxPQUFPLEVBQUMsTUFBaEI7QUFBdUIsVUFBQSxPQUFPLEVBQUU7QUFBQSxtQkFBTU4sWUFBWSxDQUFDSyxNQUFNLENBQUNKLEVBQVIsQ0FBbEI7QUFBQSxXQUFoQztBQUErRCxVQUFBLFFBQVE7QUFBdkUsV0FBeUVJLE1BQU0sQ0FBQ0osRUFBaEYsQ0FBSixDQURGLEVBRUUsZ0NBQUtJLE1BQU0sQ0FBQ0UsS0FBWixDQUZGLENBRG9DO0FBQUEsT0FBckMsQ0FESCxDQURGLENBREYsQ0FERjtBQWNELEtBZkQsTUFlTztBQUNMLGFBQU9KLEtBQVA7QUFDRDtBQUNGLEdBN0JELENBakNtQyxDQWdFbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUVBLFNBQ0Usb0JBQUMsc0JBQUQsUUFDRTtBQUFLLElBQUEsU0FBUyxFQUFDO0FBQWYsS0FDRSxvQkFBQyxpQkFBRDtBQUFRLElBQUEsT0FBTyxFQUFFZCxNQUFqQjtBQUF5QixJQUFBLE9BQU8sRUFBQyxTQUFqQztBQUEyQyxJQUFBLFVBQVUsRUFBRUssY0FBYyxDQUFDTixRQUFmLENBQXdCVSxRQUF4QixDQUFpQ0MsTUFBakMsS0FBNEM7QUFBbkcsS0FDRSxvQkFBQyxvQkFBRCxPQURGLENBREYsRUFJR0csYUFBYSxFQUpoQixFQU1FLG9CQUFDLGlCQUFEO0FBQVEsSUFBQSxPQUFPLEVBQUVaLE1BQWpCO0FBQXlCLElBQUEsT0FBTyxFQUFDLFNBQWpDO0FBQTJDLElBQUEsVUFBVSxFQUFFSSxjQUFjLENBQUNOLFFBQWYsQ0FBd0JvQixRQUF4QixDQUFpQ1QsTUFBakMsS0FBNEM7QUFBbkcsS0FDRSxvQkFBQyxvQkFBRCxPQURGLENBTkYsQ0FERixDQURGO0FBY0QsQ0FuR3FCLEVBbUduQixVQUFDVSxTQUFELEVBQVlDLFNBQVosRUFBMEI7QUFDM0IsTUFBSUQsU0FBUyxDQUFDckIsUUFBVixDQUFtQlUsUUFBbkIsQ0FBNEJDLE1BQTVCLEtBQXVDVyxTQUFTLENBQUN0QixRQUFWLENBQW1CVSxRQUFuQixDQUE0QkMsTUFBbkUsSUFBNkVZLElBQUksQ0FBQ0MsU0FBTCxDQUFlSCxTQUFTLENBQUNyQixRQUFWLENBQW1CVSxRQUFsQyxNQUFnRGEsSUFBSSxDQUFDQyxTQUFMLENBQWVGLFNBQVMsQ0FBQ3RCLFFBQVYsQ0FBbUJVLFFBQWxDLENBQWpJLEVBQThLO0FBQzVLO0FBQ0EsV0FBTyxLQUFQO0FBQ0Q7O0FBQ0QsTUFBSVcsU0FBUyxDQUFDckIsUUFBVixDQUFtQm9CLFFBQW5CLENBQTRCVCxNQUE1QixLQUF1Q1csU0FBUyxDQUFDdEIsUUFBVixDQUFtQm9CLFFBQW5CLENBQTRCVCxNQUFuRSxJQUE2RVksSUFBSSxDQUFDQyxTQUFMLENBQWVILFNBQVMsQ0FBQ3JCLFFBQVYsQ0FBbUJvQixRQUFsQyxNQUFnREcsSUFBSSxDQUFDQyxTQUFMLENBQWVGLFNBQVMsQ0FBQ3RCLFFBQVYsQ0FBbUJvQixRQUFsQyxDQUFqSSxFQUE4SztBQUM1SztBQUNBLFdBQU8sS0FBUDtBQUNEOztBQUNELFNBQU8sSUFBUDtBQUNELENBN0dxQixDQUF0QixDLENBK0dBOzs7QUFDQXZCLGFBQWEsQ0FBQzRCLGVBQWQsR0FBZ0M7QUFDOUJDLEVBQUFBLFVBQVUsRUFBRTtBQURrQixDQUFoQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7XG4gIEJ1dHRvbixcbiAgVG9vbGJhckl0ZW0sXG4gIEV4cGFuZGFibGVcbn0gZnJvbSAnQHBhdHRlcm5mbHkvcmVhY3QtY29yZSc7XG5pbXBvcnQgeyBVbmRvSWNvbiwgUmVkb0ljb24gfSBmcm9tICdAcGF0dGVybmZseS9yZWFjdC1pY29ucyc7XG5pbXBvcnQgeyBmb2N1c0NlbGwgfSBmcm9tICcuLi91dGlscyc7XG5cbmNvbnN0IENoYW5nZVRyYWNrZXIgPSBSZWFjdC5tZW1vPHsgXG4gIHVuZG9SZWRvOiBhbnksXG4gIG9uVW5kbzogYW55LFxuICBvblJlZG86IGFueVxufT4oKHsgdW5kb1JlZG8sIG9uVW5kbywgb25SZWRvIH0pID0+IHtcbiAgY29uc29sZS5sb2coJ3JlbmRlciBDaGFuZ2VUcmFja2VyJyk7XG5cbiAgY29uc3QgW3N0YXRlRnJvbVByb3BzLCBzZXRTdGF0ZUZyb21Qcm9wc10gPSBSZWFjdC51c2VTdGF0ZSh7IFxuICAgIHVuZG9SZWRvXG4gIH0pO1xuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgLy8gc3luYyBwcm9wcyB0byBzdGF0ZVxuICAgIHNldFN0YXRlRnJvbVByb3BzKHsgdW5kb1JlZG8gfSk7XG4gIH0sIFsgdW5kb1JlZG8gXSk7XG5cbiAgLyoqXG4gICAqIFRoZSB0ZXh0IHRvIGRpc3BsYXkgZm9yIHRoZSBjaGFuZ2UtdHJhY2tlclxuICAgKi9cbiAgY29uc3QgZ2V0Q2hhbmdlVGV4dCA9ICgpID0+IHtcbiAgICBpZiAoc3RhdGVGcm9tUHJvcHMudW5kb1JlZG8udW5kb0xpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICByZXR1cm4gYDEgY2hhbmdlYDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGAke3N0YXRlRnJvbVByb3BzLnVuZG9SZWRvLnVuZG9MaXN0Lmxlbmd0aH0gY2hhbmdlc2A7XG4gICAgfVxuICB9O1xuXG4gIC8qKlxuICAgKiBXaGVuIGEgY2VsbCBpZCBpcyBjbGlja2VkIGluIHRoZSBjaGFuZ2UtdHJhY2tlciwgaXQgc2Nyb2xscyBhbmQgZm9jdXNlcyB0aGUgY29ycmVzcG9uZGluZyBlbGVtZW50IGluIHRoZSBncmlkXG4gICAqL1xuICBjb25zdCBmb2N1c0VsZW1lbnQgPSAoaWQ6IHN0cmluZykgPT4ge1xuICAgIGZvY3VzQ2VsbChpZCwgMjUwLCB0cnVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgY2hhbmdlLXRyYWNrZXIgZWxlbWVudFxuICAgKi9cbiAgY29uc3QgY2hhbmdlVHJhY2tlciA9ICgpID0+IHtcbiAgICBjb25zdCBpbnB1dCA9IChcbiAgICAgIDxpbnB1dCBcbiAgICAgICAgY2xhc3NOYW1lPVwicGYtYy1mb3JtLWNvbnRyb2wgcGYtdS1weC1tZFwiIFxuICAgICAgICB0eXBlPVwiYnV0dG9uXCIgXG4gICAgICAgIGlkPVwidGV4dElucHV0MTBcIiBcbiAgICAgICAgbmFtZT1cInRleHRJbnB1dDEwXCIgXG4gICAgICAgIGFyaWEtbGFiZWw9XCJJbnB1dCBleGFtcGxlIHdpdGggcG9wb3ZlclwiIFxuICAgICAgICB2YWx1ZT17Z2V0Q2hhbmdlVGV4dCgpfVxuICAgICAgLz5cbiAgICApO1xuICAgIGlmIChzdGF0ZUZyb21Qcm9wcy51bmRvUmVkby51bmRvTGlzdC5sZW5ndGgpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxFeHBhbmRhYmxlIHRvZ2dsZVRleHQ9e2dldENoYW5nZVRleHQoKX0gY2xhc3NOYW1lPVwia2llLWNoYW5nZXMgcGYtdS1teC1zbVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGYtYy1jb250ZW50XCI+XG4gICAgICAgICAgICA8ZGw+XG4gICAgICAgICAgICAgIHtzdGF0ZUZyb21Qcm9wcy51bmRvUmVkby51bmRvTGlzdC5tYXAoKGNoYW5nZTogYW55LCBpbmRleDogbnVtYmVyKSA9PiAoXG4gICAgICAgICAgICAgICAgPFJlYWN0LkZyYWdtZW50IGtleT17aW5kZXh9PlxuICAgICAgICAgICAgICAgICAgPGR0PjxCdXR0b24gdmFyaWFudD1cImxpbmtcIiBvbkNsaWNrPXsoKSA9PiBmb2N1c0VsZW1lbnQoY2hhbmdlLmlkKX0gaXNJbmxpbmU+e2NoYW5nZS5pZH08L0J1dHRvbj48L2R0PlxuICAgICAgICAgICAgICAgICAgPGRkPntjaGFuZ2UudmFsdWV9PC9kZD5cbiAgICAgICAgICAgICAgICA8L1JlYWN0LkZyYWdtZW50PlxuICAgICAgICAgICAgICApKX1cbiAgICAgICAgICAgIDwvZGw+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvRXhwYW5kYWJsZT5cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBpbnB1dDtcbiAgICB9XG4gIH1cblxuICAvLyBjb25zdCByZWRvVHJhY2tlciA9ICgpID0+IHtcbiAgLy8gICByZXR1cm4gKFxuICAvLyAgICAgPEV4cGFuZGFibGUgdG9nZ2xlVGV4dD17KHN0YXRlRnJvbVByb3BzLnJlZG9MaXN0Lmxlbmd0aCkudG9TdHJpbmcoKX0gY2xhc3NOYW1lPVwia2llLWNoYW5nZXMgcGYtdS1teC1zbVwiPlxuICAvLyAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInBmLWMtY29udGVudFwiPlxuICAvLyAgICAgICAgIDxkbD5cbiAgLy8gICAgICAgICAgIHtzdGF0ZUZyb21Qcm9wcy5yZWRvTGlzdC5tYXAoKHJlZG86IGFueSwgaW5kZXg6IG51bWJlcikgPT4gKFxuICAvLyAgICAgICAgICAgICA8UmVhY3QuRnJhZ21lbnQga2V5PXtpbmRleH0+XG4gIC8vICAgICAgICAgICAgICAgPGR0PjxCdXR0b24gdmFyaWFudD1cImxpbmtcIiBvbkNsaWNrPXsoKSA9PiBmb2N1c0VsZW1lbnQocmVkby5pZCl9IGlzSW5saW5lPntyZWRvLmlkfTwvQnV0dG9uPjwvZHQ+XG4gIC8vICAgICAgICAgICAgICAgPGRkPntyZWRvLnZhbHVlfTwvZGQ+XG4gIC8vICAgICAgICAgICAgIDwvUmVhY3QuRnJhZ21lbnQ+XG4gIC8vICAgICAgICAgICApKX1cbiAgLy8gICAgICAgICA8L2RsPlxuICAvLyAgICAgICA8L2Rpdj5cbiAgLy8gICAgIDwvRXhwYW5kYWJsZT5cbiAgLy8gICApO1xuICAvLyB9XG5cbiAgcmV0dXJuIChcbiAgICA8VG9vbGJhckl0ZW0+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInBmLWMtaW5wdXQtZ3JvdXBcIj5cbiAgICAgICAgPEJ1dHRvbiBvbkNsaWNrPXtvblVuZG99IHZhcmlhbnQ9XCJjb250cm9sXCIgaXNEaXNhYmxlZD17c3RhdGVGcm9tUHJvcHMudW5kb1JlZG8udW5kb0xpc3QubGVuZ3RoID09PSAwfT5cbiAgICAgICAgICA8VW5kb0ljb24gLz5cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICAgIHtjaGFuZ2VUcmFja2VyKCl9XG4gICAgICAgIHsvKiB7cmVkb1RyYWNrZXIoKX0gKi99XG4gICAgICAgIDxCdXR0b24gb25DbGljaz17b25SZWRvfSB2YXJpYW50PVwiY29udHJvbFwiIGlzRGlzYWJsZWQ9e3N0YXRlRnJvbVByb3BzLnVuZG9SZWRvLnJlZG9MaXN0Lmxlbmd0aCA9PT0gMH0+XG4gICAgICAgICAgPFJlZG9JY29uIC8+XG4gICAgICAgIDwvQnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgPC9Ub29sYmFySXRlbT5cbiAgKTtcbn0sIChwcmV2UHJvcHMsIG5leHRQcm9wcykgPT4ge1xuICBpZiAocHJldlByb3BzLnVuZG9SZWRvLnVuZG9MaXN0Lmxlbmd0aCAhPT0gbmV4dFByb3BzLnVuZG9SZWRvLnVuZG9MaXN0Lmxlbmd0aCB8fCBKU09OLnN0cmluZ2lmeShwcmV2UHJvcHMudW5kb1JlZG8udW5kb0xpc3QpICE9PSBKU09OLnN0cmluZ2lmeShuZXh0UHJvcHMudW5kb1JlZG8udW5kb0xpc3QpKSB7XG4gICAgLy8gbGFzdCBjaGFuZ2VkIGNlbGwgaGFzIGNoYW5nZWQsIHJlLXJlbmRlclxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAocHJldlByb3BzLnVuZG9SZWRvLnJlZG9MaXN0Lmxlbmd0aCAhPT0gbmV4dFByb3BzLnVuZG9SZWRvLnJlZG9MaXN0Lmxlbmd0aCB8fCBKU09OLnN0cmluZ2lmeShwcmV2UHJvcHMudW5kb1JlZG8ucmVkb0xpc3QpICE9PSBKU09OLnN0cmluZ2lmeShuZXh0UHJvcHMudW5kb1JlZG8ucmVkb0xpc3QpKSB7XG4gICAgLy8gbGFzdCBjaGFuZ2VkIGNlbGwgaGFzIGNoYW5nZWQsIHJlLXJlbmRlclxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn0pO1xuXG4vLyBAdHMtaWdub3JlXG5DaGFuZ2VUcmFja2VyLndoeURpZFlvdVJlbmRlciA9IHtcbiAgY3VzdG9tTmFtZTogJ0NoYW5nZVRyYWNrZXInXG59O1xuXG5leHBvcnQgeyBDaGFuZ2VUcmFja2VyIH07Il19