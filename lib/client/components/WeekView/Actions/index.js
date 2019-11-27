var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { DefaultButton, PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';
var CONFIRM_WEEK = gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    mutation($entries:[TimeEntryInput!], $weekNumber: Int!) {\n        confirmWeek(entries: $entries, weekNumber: $weekNumber)\n    }\n"], ["\n    mutation($entries:[TimeEntryInput!], $weekNumber: Int!) {\n        confirmWeek(entries: $entries, weekNumber: $weekNumber)\n    }\n"])));
var UNCONFIRM_WEEK = gql(templateObject_2 || (templateObject_2 = __makeTemplateObject(["\n    mutation($weekNumber: Int!) { \n        unconfirmWeek(weekNumber: $weekNumber)\n    }\n"], ["\n    mutation($weekNumber: Int!) { \n        unconfirmWeek(weekNumber: $weekNumber)\n    }\n"])));
export var Actions = function (_a) {
    var weekView = _a.weekView, weekNumber = _a.weekNumber, onConfirmWeekEnabled = _a.onConfirmWeekEnabled, onUnconfirmWeekEnabled = _a.onUnconfirmWeekEnabled, onSetConfirmedHours = _a.onSetConfirmedHours;
    var _b = [useMutation(CONFIRM_WEEK), useMutation(UNCONFIRM_WEEK)], confirmWeek = _b[0][0], unconfirmWeek = _b[1][0];
    var onConfirmWeek = function () { return __awaiter(_this, void 0, void 0, function () {
        var entries, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    entries = weekView.events
                        .filter(function (e) { return e.project; })
                        .map(function (e) { return ({ id: e.id, projectKey: e.project.key }); });
                    return [4 /*yield*/, confirmWeek({ variables: { weekNumber: weekNumber, entries: entries } })];
                case 1:
                    data = (_a.sent()).data;
                    onSetConfirmedHours(data.confirmWeek);
                    return [2 /*return*/];
            }
        });
    }); };
    var onUnconfirmWeek = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, unconfirmWeek({ variables: { weekNumber: weekNumber } })];
                case 1:
                    _a.sent();
                    onSetConfirmedHours(0);
                    return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement("div", { style: { marginTop: 10, marginBottom: 10 } },
        React.createElement(PrimaryButton, { text: 'Confirm week', iconProps: { iconName: 'CheckMark' }, onClick: onConfirmWeek, disabled: !onConfirmWeekEnabled }),
        React.createElement(DefaultButton, { style: { marginLeft: 8 }, text: 'Unconfirm week', iconProps: { iconName: 'ErrorBadge' }, onClick: onUnconfirmWeek, disabled: !onUnconfirmWeekEnabled })));
};
var templateObject_1, templateObject_2;
//# sourceMappingURL=index.js.map