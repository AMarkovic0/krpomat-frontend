import * as React from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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

  const month = today.getMonth();
  const year = today.getFullYear();
  const date = today.getDate();

  return `${date}.${month}.${year}.`;
}

function toDotDateFormat(date) {
  if(typeof date === 'string' || date instanceof String) {
    return date
  }

  return date.format("DD.MM.YYYY.");
}

export function BasicDatePicker({ name, onSet }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['DatePicker']}>
        <DatePicker label={name} format="DD.MM.YYYY" onChange={(newValue) => {onSet(newValue)}}/>
      </DemoContainer>
    </LocalizationProvider>
  );
}

export default function DateSelector({ setData, getData }) {
  const [startDate, setStartDate] = React.useState(getDefaultStartDate());
  const [endDate, setEndDate] = React.useState(getToday());

  function getSalesData() {
    getData({
      start_date : toDotDateFormat(startDate),
      end_date : toDotDateFormat(endDate),
    }).then((resp) => {
      setData(resp)
    });
  }

  React.useEffect(() => {
    getData({
      start_date : toDotDateFormat(startDate),
      end_date : toDotDateFormat(endDate),
    }).then((resp) => {
      setData(resp);
    })
  }, []);

  return (
    <Grid container justify="center"  direction="row" spacing={3} alignItems="center">
      <Grid item>
        <BasicDatePicker name="Start Date" onSet={setStartDate}/>
      </Grid>
      <Grid item>
        <BasicDatePicker name="End Date" onSet={setEndDate}/>
      </Grid>
      <Grid item>
        <Button variant="contained" onClick={getSalesData}>CONFIRM</Button>
      </Grid>
    </Grid>
  );
}
