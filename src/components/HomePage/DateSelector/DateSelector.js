import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PickersShortcutsItem } from '@mui/x-date-pickers/PickersShortcuts';
import dayjs, { Dayjs } from 'dayjs';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

function getToday() {
  const today = new Date();

  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();

  return `${date}.${month}.${year}.`;
}

function getDefaultStartDate() {
  const today = new Date();

  let month = today.getMonth();
  let year = today.getFullYear();
  const date = today.getDate();

  if (month == 0) {
    month = 12;
    year = year - 1;
  }

  return `${date}.${month}.${year}.`;
}

function toDotDateFormat(date) {
  if(typeof date === 'string' || date instanceof String) {
    return date
  }

  return date.format("DD.MM.YYYY.");
}

export function BasicDatePicker({ name, onSet, items }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker
	  label={name}
	  format="DD.MM.YYYY"
	  onChange={(newValue) => {onSet(newValue)}} slotProps={{
            shortcuts: {
              items: items,
            },
            actionBar: { actions: [] },
	  }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

export default function DateSelector({ setData, getData }) {
  const [startDate, setStartDate] = React.useState(getDefaultStartDate());
  const [endDate, setEndDate] = React.useState(getToday());

  const shortcutsItemsFrom: PickersShortcutsItem<Dayjs | null>[] = [
    {
      label: 'Last Year',
      getValue: () => {
        return dayjs().subtract(1, 'year');
      },
    },
    {
      label: 'Last Month',
      getValue: () => {
        return dayjs().subtract(1, 'month');
      },
    },
    {
      label: 'Reset',
      getValue: () => {
        return null;
      }
    },
  ];

  const shortcutsItemsTo: PickersShortcutsItem<Dayjs | null>[] = [
    {
      label: 'Today',
      getValue: () => {
        return dayjs();
      },
    },
    {
      label: 'Reset',
      getValue: () => {
        return null;
      }
    },
  ];

  function getSalesData() {
    getData({
      start_date : toDotDateFormat(startDate ? startDate : getDefaultStartDate()),
      end_date : toDotDateFormat(endDate ? endDate : getToday()),
    }).then((resp) => {
      setData(resp)
    });
  }

  React.useEffect(() => {
    getData({
      start_date : toDotDateFormat(startDate ? startDate : getDefaultStartDate()),
      end_date : toDotDateFormat(endDate ? endDate : getToday()),
    }).then((resp) => {
      setData(resp);
    })
  }, []);

  return (
    <Grid container justify="center"  direction="row" spacing={3} alignItems="center">
      <Grid item>
        <BasicDatePicker name="From" onSet={setStartDate} items={shortcutsItemsFrom}/>
      </Grid>
      <Grid item>
        <BasicDatePicker name="To" onSet={setEndDate} items={shortcutsItemsTo}/>
      </Grid>
      <Grid item>
        <Button variant="contained" onClick={getSalesData}>CONFIRM</Button>
      </Grid>
    </Grid>
  );
}
