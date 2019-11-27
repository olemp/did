var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as React from 'react';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import * as DummyConfig from './DummyConfig';
export var SectionHeader = function (_a) {
    var text = _a.text;
    return (React.createElement("span", { style: { display: 'block', fontSize: 12, letterSpacing: 3, paddingBottom: 3, textTransform: 'uppercase', marginBottom: 10 } }, text));
};
var Charts = /** @class */ (function (_super) {
    __extends(Charts, _super);
    function Charts() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Charts.prototype.render = function () {
        return (React.createElement("div", { className: "row", style: { marginTop: 35 } },
            React.createElement("div", { className: "col-sm" },
                React.createElement(SectionHeader, { text: 'Client Totals' }),
                React.createElement("ul", { style: { listStyleType: 'none', margin: '20px 0 0 0', padding: 0 } },
                    React.createElement("li", null,
                        React.createElement("span", { style: { width: 180, display: 'inline-block' } }, "Orkla"),
                        " ",
                        React.createElement("b", null, "38h")),
                    React.createElement("li", null,
                        React.createElement("span", { style: { width: 180, display: 'inline-block' } }, "B\u00E6rum kommune"),
                        " ",
                        React.createElement("b", null, "8h")),
                    React.createElement("li", null,
                        React.createElement("span", { style: { width: 180, display: 'inline-block' } }, "Internal"),
                        " ",
                        React.createElement("b", null, "5h")))),
            React.createElement("div", { className: "col-sm" },
                React.createElement(SectionHeader, { text: 'Project Allocation' }),
                React.createElement(HighchartsReact, { highcharts: Highcharts, options: DummyConfig.ProjectAllocation })),
            React.createElement("div", { className: "col-sm" },
                React.createElement(SectionHeader, { text: 'Appointment Status' }),
                React.createElement(HighchartsReact, { highcharts: Highcharts, options: DummyConfig.AppointmentStatus }))));
    };
    return Charts;
}(React.Component));
export { Charts };
//# sourceMappingURL=index.js.map