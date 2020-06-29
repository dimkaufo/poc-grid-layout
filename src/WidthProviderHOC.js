import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import {findDOMNode} from "react-dom";

/*
 * A simple HOC that provides facility for listening to container resize.
 * (Refactored + added onWindowResize callback. Origin - github.com/STRML/react-layout)
 */
export const WidthProviderHOC =
  (ComposedComponent) =>
    class WidthProvider extends PureComponent {
      static defaultProps = {
        measureBeforeMount: false
      };

      static propTypes = {
        className: PropTypes.string,
        // If true, will not render children until mounted. Useful for getting the exact width before
        // rendering, to prevent any unsightly resizing.
        measureBeforeMount: PropTypes.bool,
        onWindowResize: PropTypes.func,
        style: PropTypes.object
      };

      state = {
        width: 1280
      };

      debounceTimeout = null;
      mounted = false;

      componentDidMount() {
        this.mounted = true;

        window.addEventListener("resize", this.onWindowResize);
        // Call to properly set the breakpoint and resize the elements.
        // Note that if you"re doing a full-width element, this can get a little wonky if a scrollbar
        // appears because of the grid. In that case, fire your own resize event,
        // or set `overflow: scroll` on your body.
        this.resizeHandler();
      }

      componentWillUnmount() {
        this.mounted = false;
        window.removeEventListener("resize", this.onWindowResize);
      }

      onWindowResize = () => {
        clearTimeout(this.debounceTimeout);
        this.debounceTimeout = setTimeout(this.resizeHandler, 100);
      };

      resizeHandler = () => {
        const {onWindowResize} = this.props;
        if (!this.mounted) {
          return;
        }
        const node = findDOMNode(this); // eslint-disable-line react/no-find-dom-node
        if (node instanceof HTMLElement) {
          this.setState({width: node.scrollWidth});
        }
        onWindowResize && onWindowResize();
      };

      render() {
        const {measureBeforeMount, className, style} = this.props;
        if (measureBeforeMount && !this.mounted) {
          return (
            <div
              className={className}
              style={style}
            />
          );
        }
        return (
          <ComposedComponent {...this.props} {...this.state} />
        );
      }
    };

