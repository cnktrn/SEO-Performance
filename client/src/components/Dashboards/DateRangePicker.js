import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';



const DateRangePicker = ({ onDateRangeChange }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
  
    const handleStartDateChange = (date) => {
        setStartDate(date);
        onDateRangeChange(date, endDate);
      };
    
      const handleEndDateChange = (date) => {
        setEndDate(date);
        onDateRangeChange(startDate, date);
      };
  
    return (
      <div>
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          placeholderText="Start Date"
        />
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          placeholderText="End Date"
        />
      </div>
    );
  };
  
  export default DateRangePicker;
  