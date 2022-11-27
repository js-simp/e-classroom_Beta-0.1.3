import {React, useEffect, useState} from 'react';
import db from '../Firebase/firebase.js';

function CreateSessions() {
    const [lessons, setLessons] = useState([])
    useEffect(()=>{
        
        db.collection("Lessons").get().then((querySnapshot) => {
            let lesson_titles = [];
            querySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id)
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
    <select multiple={true}> 
      <option value="⬇️ Select a Lesson ⬇️"> -- Select a Lesson -- </option>
            {/* Mapping through each fruit object in our fruits array
          and returning an option element with the appropriate attributes / values.
         */}
      {lessons.map((lesson) => <option value={lesson}>{lesson}</option>)}
    </select>
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