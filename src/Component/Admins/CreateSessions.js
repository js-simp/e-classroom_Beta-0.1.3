import {React, useEffect, useState} from 'react';
import db from '../Firebase/firebase.js';
import MultipleSelect from './MultipleSelect.js';

function CreateSessions() {
    const [lessons, setLessons] = useState([])
    const [students, setStudents] = useState([])
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