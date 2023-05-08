import {React, useEffect, useState} from 'react';
import {db} from '../Firebase/firebase.js';
import { doc, setDoc, collection, getDocs } from "firebase/firestore"; 
import MultipleSelect from './MultipleSelect.js';
import SingleSelect from './SingleSelect.js';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import setHours from "date-fns/setHours";
import setMinutes from "date-fns/setMinutes";
import './CreateSessions.css'

function CreateSessions() {
    const [lessons, setLessons] = useState([])
    const [lessonName, setLessonName] = useState([]);
    const [startDate, setStartDate] = useState(setHours(setMinutes(new Date(), 0), 9));
    const [sessionId, setSessionId] = useState('');
    const [students, setStudents] = useState([]);
    const [studentId, setStudentId] = useState('');
    const [tutors, setTutors] = useState([]);
    const [tutorId, setTutorId] = useState('');
    const [epoch, setEpoch] = useState()

    const filterPassedTime = (time) => {
      const currentDate = new Date();
      const selectedDate = new Date(time);
  
      return currentDate.getTime() < selectedDate.getTime();
    };

    async function handleSubmit(e) {
      e.preventDefault();
      let string_date = startDate.toLocaleDateString();
      let string_time = startDate.toLocaleTimeString();
      const sessionInfo = {
        Date: string_date,
        Time : string_time,
        Status: 'Pending',
        epochTime: epoch,
        Lessons: lessonName,
        StudentId : studentId,
        TutorId : tutorId
      };

      const res = await setDoc(doc(db, 'Sessions',`${sessionId}`), sessionInfo);
      // console.log(sessionInfo)
    }

    useEffect(async ()=>{
        
        const allLessons = await getDocs(collection(db, "Lessons"));
        let lesson_titles = [];
        allLessons.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          lesson_titles.push(doc.id)
        });
        setLessons(lesson_titles)
          
        // console.log(lesson_titles)
        const allStudents = await getDocs(collection(db, "Students"));
        let student_list = [];
        allStudents.forEach((student) => {
          student_list.push(student.id)
        });
        setStudents(student_list);
        
        const allTutors = await getDocs(collection(db, "Tutors"));
        let tutor_list = [];
        allTutors.forEach((tutor) => {
          tutor_list.push(tutor.id)
        })
        setTutors(tutor_list);
        
    },[])
    
  if(lessons.length != 0 && students.length != 0) {
    return (
      <form onSubmit={handleSubmit} className="create-sessions-form">
        <MultipleSelect  lessons = {lessons} selectLesson = {setLessonName}/>
        <DatePicker
          selected={startDate}
          onChange={(date) => {setStartDate(date); setEpoch(Math.floor(date.getTime()/ 1000))}}
          showTimeSelect
          filterTime={filterPassedTime}
          minDate = {new Date()}
          dateFormat="MM/dd/yyyy HH:mm"
        />
        <label>SessionId:
        <input
          type="text" 
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
        />
      </label>
        <SingleSelect list = {students} selectItem = {setStudentId} label = 'Student ID'/>
        <SingleSelect list = {tutors} selectItem = {setTutorId} label = 'Tutor ID'/>
        <input type="submit" value="SUBMIT"/>
      </form>
    )
  }
  else{
    return (
      <p>Welcome to create sessiosn</p>
    )
  }
}

export default CreateSessions