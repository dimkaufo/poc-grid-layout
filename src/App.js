import React, {useEffect, useState} from 'react';
import _ from "lodash";
import cn from "classnames";
import Responsive from "react-grid-layout/build/ResponsiveReactGridLayout";

import {WidthProviderHOC} from "./WidthProviderHOC";
import './App.scss';

const ResponsiveGridLayout = WidthProviderHOC(Responsive);

let breakpoint = "md"

function App() {
  const [layouts, setLayouts] = useState({lg: [], md: [], sm: [], xs: [], xxs: []});

  useEffect(() => {
    handleNewLayout();
  }, [])

  const handleLayoutChange = (currentLayout, allLayouts) => {
    setLayouts({...layouts, [breakpoint]: currentLayout});
  };

  const handleBreakpointChange = (newBreakpoint, newCols) => {
    breakpoint = newBreakpoint;
  };

  const handleNewLayout = () => {
    const l = generateLayout();
    setLayouts({lg: l, md: l, sm: l, xs: l, xxs: l});
  };

  // Generation from example https://github.com/STRML/react-grid-layout/blob/master/test/examples/0-showcase.jsx
  const generateLayout = () => {
    return _.map(_.range(0, 10), (item, i) => {
      const y = Math.ceil(Math.random() * 4) + 1;
      const isStatic = Math.random() < 0.1;
      return {
        x: Math.round(Math.random() * 5) * 2,
        y: Math.floor(i / 6) * y,
        w: 2,
        h: y,
        i: i.toString(),
        static: isStatic,
        isResizable: !isStatic
      };
    });
  }

  return (
    <div className="app">
      <div className="app-grid">
        <ResponsiveGridLayout
          className="layout"
          draggableHandle=".react-grid-item"
          breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
          cols={{lg: 12, md: 10, sm: 6, xs: 4, xxs: 2}}
          layouts={layouts}
          onBreakpointChange={handleBreakpointChange}
          onLayoutChange={handleLayoutChange}
          compactType={null}
          rowHeight={20}
          margin={[5, 5]}
          containerPadding={[5, 5]}
          preventCollision
        >
          {layouts[breakpoint].map((layoutItem) => (
            <div
              className={cn("react-grid-item", {
                "static": layoutItem.static,
                "resizable": layoutItem.isResizable,
              })}
              key={layoutItem.i}
            >
              {layoutItem.i}
            </div>
          ))}
        </ResponsiveGridLayout>
      </div>
      <div className="app-toolbar">
        <button
          onClick={handleNewLayout}>
          Generate new layout
        </button>
      </div>
    </div>
  );
}

export default App;
