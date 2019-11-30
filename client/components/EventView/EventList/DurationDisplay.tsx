
import { getDurationDisplay } from 'helpers';
import * as React from 'react';
require('moment/locale/en-gb');

export const DurationDisplay = ({ minutes }) => <span>{getDurationDisplay(minutes)}</span>;
