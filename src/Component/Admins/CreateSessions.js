import {React, useEffect, useState} from 'react';
import db from '../Firebase/firebase.js';
import MultipleSelect from './MultipleSelect.js';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";

function CreateSessions() {
    const [lessons, setLessons] = useState([])
    const [startDate, setStartDate] = useState(setHours(setMinutes(new Date(), 0), 9))

    const filterPassedTime = (time) => {
      const currentDate = new Date();
      const selectedDate = new Date(time);
  
      return currentDate.getTime() < selectedDate.getTime();
    };

    useEffect(()=>{
        
        db.collection("Lessons").get().then((querySnapshot) => {
            let lesson_titles = [];
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                lesson_titles.push(doc.id)
            });
            setLessons(lesson_titles)
        });
        // console.log(lesson_titles)
       
        
    },[])
    
  if(lessons.length != 0) {
    return (
      <div>
      <p>Welcome to create sessiosn</p>
      <MultipleSelect lessons = {lessons}/>
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        showTimeSelect
        filterTime={filterPassedTime}
        minDate = {new Date()}
        dateFormat="dd/MM/yyyy, h:mm aa"
      /> 
      </div>
    )
  }
  else{
    return (
      <p>Welcome to create sessiosn</p>
    )
  }
}

export default CreateSessions