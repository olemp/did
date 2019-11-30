
import * as moment from 'moment';
import * as React from 'react';
require('moment/locale/en-gb');

export const DateColumn = ({ dateStr, dateFormat = 'dddd HH:mm' }) => <span>{moment(new Date(dateStr)).format(dateFormat)}</span>;