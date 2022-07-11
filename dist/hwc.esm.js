import React, { useMemo, useState, useCallback, useRef, Fragment } from 'react';
import useIsomorphicLayoutEffect from 'use-isomorphic-layout-effect';
import ResizeObserver from 'resize-observer-polyfill';

var HwcContext = /*#__PURE__*/React.createContext(null);
var HwcProvider = HwcContext.Provider;
var useHwcContext = function useHwcContext() {
  var ctx = React.useContext(HwcContext);
  if (ctx === null) throw new Error('No WeekPicker Context found. Please Wrap Hwc components in <HwcProvider />');
  return ctx;
};

var MINUTE_IN_MILLIS = 60 * 1000;
var HOUR_IN_MILLIS = 60 * MINUTE_IN_MILLIS;
var DAY_IN_MILLIS = 24 * HOUR_IN_MILLIS;

var posToDate = function posToDate(pos, width, startDay, hourHeight) {
  var minuteHeight = 60 / hourHeight;
  var minutesDay = pos.y * minuteHeight;
  var dayInGrid = Math.trunc(pos.x / (width || 1) * 7);
  return new Date(startDay.getTime() + dayInGrid * DAY_IN_MILLIS + minutesDay * MINUTE_IN_MILLIS);
};

var roundToQuarterHour = function roundToQuarterHour(date) {
  var rounded = startOfMinute(date);
  var minutes = rounded.getMinutes() + rounded.getHours() * 60;
  var roundedMinute = Math.round(minutes / 60 * 4) * 60 / 4;
  var d = startOfDay(date);
  d.setMinutes(roundedMinute);
  return d;
};
var startOfDay = function startOfDay(input) {
  var d = new Date(input);
  d.setHours(0, 0, 0, 0);
  return d;
};
var startOfMinute = function startOfMinute(input) {
  var d = new Date(input);
  d.setSeconds(0, 0);
  return d;
};

var useHwc = function useHwc(props) {
  if (props === void 0) {
    props = {};
  }

  var _props = props,
      _props$startDay = _props.startDay,
      startDay = _props$startDay === void 0 ? new Date() : _props$startDay,
      _props$cellHeight = _props.cellHeight,
      cellHeight = _props$cellHeight === void 0 ? 50 : _props$cellHeight,
      _props$daysCount = _props.daysCount,
      daysCount = _props$daysCount === void 0 ? 7 : _props$daysCount,
      _props$events = _props.events,
      events = _props$events === void 0 ? [] : _props$events,
      _props$onAddEventRequ = _props.onAddEventRequest,
      onAddEventRequest = _props$onAddEventRequ === void 0 ? function () {} : _props$onAddEventRequ;
  var normalizedStartDay = useMemo(function () {
    return startOfDay(startDay);
  }, [startDay]); // column witdh

  var _useState = useState(0),
      width = _useState[0],
      setWidth = _useState[1];

  var cellWidth = useMemo(function () {
    return width / daysCount;
  }, [width, daysCount]); // mouse position and date

  var _useState2 = useState({
    x: 0,
    y: 0
  }),
      pos = _useState2[0],
      setPos = _useState2[1];

  var date = useMemo(function () {
    return posToDate(pos, width, normalizedStartDay, cellHeight);
  }, [pos, width, normalizedStartDay, cellHeight]); // shadow event

  var _useState3 = useState(),
      startDragDate = _useState3[0],
      setStartDragDate = _useState3[1];

  var shadowEvent = useMemo(function () {
    if (!startDragDate) return undefined;
    var dates = [roundToQuarterHour(startDragDate), roundToQuarterHour(date)].sort(function (a, b) {
      return a.getTime() - b.getTime();
    });
    return {
      startDate: dates[0],
      endDate: dates[1]
    };
  }, [startDragDate, date]);
  var requestAddEventHandler = useCallback(function (ev) {
    onAddEventRequest(ev);
  }, [onAddEventRequest]);
  return {
    pos: pos,
    date: date,
    cellWidth: cellWidth,
    cellHeight: cellHeight,
    startDay: normalizedStartDay,
    daysCount: daysCount,
    events: events,
    setPos: setPos,
    setWidth: setWidth,
    shadowEvent: shadowEvent,
    setStartDragDate: setStartDragDate,
    requestAddEventHandler: requestAddEventHandler
  };
};

function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };
  return _extends.apply(this, arguments);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var _excluded = ["onMouseMove", "onMouseDown", "style", "children"];
var HwcDragPane = /*#__PURE__*/React.forwardRef(function (_ref, ref) {
  var _ref$onMouseMove = _ref.onMouseMove,
      onMouseMove = _ref$onMouseMove === void 0 ? function () {} : _ref$onMouseMove,
      _ref$onMouseDown = _ref.onMouseDown,
      onMouseDown = _ref$onMouseDown === void 0 ? function () {} : _ref$onMouseDown,
      style = _ref.style,
      children = _ref.children,
      props = _objectWithoutPropertiesLoose(_ref, _excluded);

  var _useHwcContext = useHwcContext(),
      setPos = _useHwcContext.setPos,
      date = _useHwcContext.date,
      setWidth = _useHwcContext.setWidth,
      setStartDragDate = _useHwcContext.setStartDragDate,
      requestAddEventHandler = _useHwcContext.requestAddEventHandler,
      shadowEvent = _useHwcContext.shadowEvent,
      cellHeight = _useHwcContext.cellHeight;

  var _useState = useState(null),
      element = _useState[0],
      setRef = _useState[1];

  useIsomorphicLayoutEffect(function () {
    if (!element) return;
    var observer = new ResizeObserver(function (_ref2) {
      var entry = _ref2[0];
      if (entry) setWidth(entry.contentRect.width);
    });
    observer.observe(element);
    return function () {
      observer.disconnect();
    };
  }, [element, setWidth]); // shadow event

  var mouseDownDate = useRef();
  var mouseDownHandler = useCallback(function (ev) {
    if (!(ev.target instanceof Element) || !ev.target.hasAttribute('week-picker-cell')) return; // prevent dnd

    ev.preventDefault();
    mouseDownDate.current = date;
    onMouseDown(ev);
  }, [date, onMouseDown]);
  var mouseMoveHandler = useCallback(function (ev) {
    var offset = ev.currentTarget.getBoundingClientRect();
    var pos = {
      x: ev.clientX - offset.left,
      y: ev.clientY - offset.top
    };
    setPos(pos);
    onMouseMove(ev);

    if (mouseDownDate.current && !shadowEvent && roundToQuarterHour(mouseDownDate.current).getTime() !== roundToQuarterHour(date).getTime()) {
      setStartDragDate(mouseDownDate.current);
    }
  }, [setPos, onMouseMove, shadowEvent, date, setStartDragDate]);
  useIsomorphicLayoutEffect(function () {
    var dragEndHandler = function dragEndHandler() {
      if (mouseDownDate.current) {
        if (shadowEvent) {
          requestAddEventHandler(shadowEvent);
        } else {
          requestAddEventHandler({
            startDate: date,
            endDate: new Date(date.getTime() + 2 * HOUR_IN_MILLIS)
          });
        }
      }

      mouseDownDate.current = undefined;
      setStartDragDate(undefined);
    };

    window.addEventListener('mouseup', dragEndHandler);
    return function () {
      window.removeEventListener('mouseup', dragEndHandler);
    };
  }, [setStartDragDate, requestAddEventHandler, shadowEvent, date]);
  return React.createElement("div", Object.assign({}, props, {
    style: _extends({
      position: 'relative',
      height: cellHeight * 24 + "px"
    }, style),
    onMouseMove: mouseMoveHandler,
    onDrag: function onDrag(ev) {
      return ev.preventDefault();
    },
    onMouseDown: mouseDownHandler,
    ref: ref || setRef
  }), children);
});

var _excluded$1 = ["style", "colStyle", "children"];

var defaultCellRenderer = function defaultCellRenderer(_ref) {
  var style = _ref.style;
  return React.createElement("div", {
    style: style
  });
};

var HwcGrid = /*#__PURE__*/React.forwardRef(function (_ref2, ref) {
  var style = _ref2.style,
      colStyle = _ref2.colStyle,
      children = _ref2.children,
      props = _objectWithoutPropertiesLoose(_ref2, _excluded$1);

  var _useHwcContext = useHwcContext(),
      startDay = _useHwcContext.startDay,
      cellHeight = _useHwcContext.cellHeight,
      cellWidth = _useHwcContext.cellWidth,
      daysCount = _useHwcContext.daysCount;

  var days = new Array(daysCount).fill(0).map(function (_, index) {
    return new Date(startDay.getTime() + index * DAY_IN_MILLIS);
  });
  var lines = new Array(24).fill(0).map(function (_, index) {
    return index;
  });
  return React.createElement("div", Object.assign({}, props, {
    ref: ref,
    style: _extends({
      position: 'absolute',
      width: '100%',
      display: 'flex'
    }, style)
  }), days.map(function (d, dIndex) {
    return React.createElement("div", {
      key: dIndex,
      style: _extends({
        flex: '0 0 1',
        width: '100%'
      }, colStyle)
    }, lines.map(function (l) {
      var x = dIndex === 0 ? 'start' : dIndex === days.length - 1 ? 'end' : undefined;
      var y = l === 0 ? 'start' : l === lines.length - 1 ? 'end' : undefined;
      return React.createElement(Fragment, {
        key: l
      }, React.Children.map((children || defaultCellRenderer)({
        cellHeight: cellHeight,
        cellWidth: cellWidth,
        style: {
          height: cellHeight + "px",
          borderLeft: x === 'start' ? undefined : "#aaa solid 1px",
          borderTop: y === 'start' ? undefined : "#aaa solid 1px",
          boxSizing: 'border-box'
        },
        x: x,
        y: y,
        date: d
      }), function (node) {
        return React.cloneElement(node, {
          'week-picker-cell': ''
        });
      }));
    }));
  }));
});

var buildIsEventVisibleFilter = function buildIsEventVisibleFilter(startDay, daysCount) {
  var startMillis = startOfDay(startDay).getTime();
  var endMillis = startMillis + daysCount * DAY_IN_MILLIS;
  return function (ev) {
    return ev.startDate.getTime() < endMillis && ev.endDate.getTime() > startMillis;
  };
};
var getCroppedEventsByDay = function getCroppedEventsByDay(ev) {
  var events = [];
  var evEndMillis = ev.endDate.getTime();

  for (var i = 0; i < 20; i++) {
    var lastCroppedEvent = events[events.length - 1];
    var nextDayMillis = lastCroppedEvent ? startOfDay(lastCroppedEvent.startDate).getTime() + 2 * DAY_IN_MILLIS : startOfDay(ev.startDate).getTime() + 1 * DAY_IN_MILLIS;
    var isOverflow = nextDayMillis < evEndMillis;
    events.push({
      startDate: new Date(lastCroppedEvent ? lastCroppedEvent.endDate : ev.startDate),
      endDate: new Date(isOverflow ? nextDayMillis : evEndMillis)
    });
    if (!isOverflow) break;
  }

  return events;
};

var defaultRenderCard = function defaultRenderCard(_ref) {
  var rect = _ref.rect;
  return React.createElement("div", {
    style: {
      position: 'absolute',
      backgroundColor: 'orange',
      border: 'solid orangered 2px',
      boxSizing: 'border-box',
      borderRadius: '3px',
      width: rect.width - 2 + "px",
      height: rect.height - 2 + "px",
      left: rect.left + "px",
      top: rect.top + "px"
    }
  });
};

var HwcEventsRenderer = function HwcEventsRenderer(_ref2) {
  var renderCard = _ref2.renderCard;

  var _useHwcContext = useHwcContext(),
      events = _useHwcContext.events,
      cellWidth = _useHwcContext.cellWidth,
      cellHeight = _useHwcContext.cellHeight,
      startDay = _useHwcContext.startDay,
      daysCount = _useHwcContext.daysCount,
      shadowEvent = _useHwcContext.shadowEvent;

  var cards = useMemo(function () {
    var eventsFilter = buildIsEventVisibleFilter(startDay, daysCount);
    return [].concat(events, shadowEvent ? [shadowEvent] : []).filter(eventsFilter).map(getCroppedEventsByDay).map(function (croppeds) {
      return croppeds.map(function (ev, index) {
        return _extends({}, ev, {
          isFirst: index === 0,
          isLast: index === croppeds.length - 1
        });
      });
    }).flat().filter(eventsFilter).map(function (ev) {
      var day = (startOfDay(ev.startDate).getTime() - startOfDay(startDay).getTime()) / DAY_IN_MILLIS;
      var duration = ev.endDate.getTime() - ev.startDate.getTime();
      var millisFromDayStart = ev.startDate.getTime() - startOfDay(ev.startDate).getTime();
      return {
        event: {
          startDate: ev.startDate,
          endDate: ev.endDate
        },
        rect: {
          width: cellWidth,
          height: duration / HOUR_IN_MILLIS * cellHeight,
          left: day * cellWidth,
          top: millisFromDayStart / HOUR_IN_MILLIS * cellHeight
        },
        isFirst: ev.isFirst,
        isLast: ev.isLast
      };
    });
  }, [events, cellWidth, startDay, daysCount, shadowEvent, cellHeight]);
  return React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, cards.map(function (cardProps, index) {
    return React.createElement(Fragment, {
      key: index
    }, (renderCard || defaultRenderCard)(cardProps));
  }));
};

var HwcHeader = function HwcHeader(_ref) {
  var locale = _ref.locale,
      _ref$dateFormatOption = _ref.dateFormatOptions,
      dateFormatOptions = _ref$dateFormatOption === void 0 ? {
    day: '2-digit',
    weekday: 'short'
  } : _ref$dateFormatOption;

  var _useHwcContext = useHwcContext(),
      startDay = _useHwcContext.startDay,
      daysCount = _useHwcContext.daysCount;

  var days = new Array(daysCount).fill(0).map(function (_, index) {
    return new Date(startDay.getTime() + index * DAY_IN_MILLIS);
  });
  return React.createElement("div", {
    style: {
      display: 'flex'
    }
  }, days.map(function (d, dIndex) {
    return React.createElement("div", {
      key: dIndex,
      style: {
        flex: '0 0 1',
        width: '100%'
      }
    }, d.toLocaleDateString(locale, dateFormatOptions));
  }));
};

export { HwcContext, HwcDragPane, HwcEventsRenderer, HwcGrid, HwcHeader, HwcProvider, useHwc, useHwcContext };
//# sourceMappingURL=hwc.esm.js.map
