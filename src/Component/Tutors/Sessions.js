import { Button, LinearProgress } from '@material-ui/core';
import {React, useState, useEffect} from 'react'
import db from '../Firebase/firebase'
import './Sessions.css';

// the props will be:
// props.Name : students name
// props.StudentId : students id
// props.SchoolId : School Id
// props.Year : Students school year
// props.Lessons: Lesson array (length 3)
// props.Time : Time the session is booked for
// ;

function Sessions(props) {

    const [studentInfo, setStudentInfo] = useState();


    useEffect(() => {
        let docRef = db.collection('Students').doc(`${props.StudentId}`)
        docRef.get().then((doc) => {
            if (doc.exists) {
                // console.log("Document data:", doc.data().Info);
                const info = doc.data().Info;
                setStudentInfo({'Name' : info.Name, 'SchoolId' : info.SchoolId, 'Year' : info.Year})
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });

    }, [])

    if(studentInfo){
        return (
            <div className =  "session-card-block">
            
                {/* ----------------------------------------This is is the title bar section ----------------------------------------------------------------------------------- */}
                <div className="title-bar">
                    <div className="card-block__time">
                        {props.Time}
                    </div>
                    <div className="card-block__name">
                        <a className="student-profile" href="#">{studentInfo.Name}  {props.StudentId}</a>
                        {studentInfo.Year}
                    </div>
                    <div className="card-block__school-name">
                        School {studentInfo.SchoolId}
                    </div>
                </div>  
                {/* ---------------------------------------------------Start of card content-------------------------------------------------------------------------------    */}
                <div className="card-block__content">
                        <div className="card-block__section-row">
                                <div className="card-block__section-title">
                                Now:
                                </div>
                                <div className="card-block__section-content ">
                                    <a className="" data-href="#" data-lesson="990" href="#">
                                    {props.Lessons[0]}
                                    </a>
                                    <a className="#" data-href="" data-lesson="651" href="#">
                                    {props.Lessons[1]}
                                    </a>
                                    <a className="" data-href="/curriculum/668/lesson_overlay" data-lesson="668" href="#">
                                    {props.Lessons[2]}
                                    </a>
                                </div>
                    </div>
             {/*--------------------------------------------------- The buttons section------------------------------------------------------------------------------------- */}
                    <div className="card-block__button-section">
                    <div className="card-block__button-wrapper">
                        <div id="learning-session-1857904-button" className="with-tooltip" title="You are currently not able to launch this session as no student has been assigned
                            yet or the session is not within 10 minutes of the start time">
                        <Button className="button button--small button--rewards-board button--hard-disable" variant="contained" color="primary"
                        data-session-start="1625488200"
                        onClick ={
                            () =>         
                        {
                            props.setLaunched({
                                'sessionId' : props.SessionId, 
                                'lessons' : props.Lessons
                        });
                        }
                        }
                            
                        >Start Session</Button>
                        {/* <div class="meeting-number" style="clear: both;">
                        <!-- Meeting number: <br/><strong></strong> -->
                        </div> */}
                        </div>
                    </div>
                    <div className="card-block__button-wrapper">
                        <Button className="button button--small button--rewards-board" variant="contained" color="primary" href="#">Add feedback</Button>
                    </div>
                    <div className="card-block__button-wrapper">
                        <Button variant="contained" color="primary" href="#" className="button button--small button--rewards-board overlay" data-href="/learning_sessions/1857904/cancel_session">Cancel</Button>
                    </div>
                    </div>
                </div>
             
            </div>
                )
    }
    else{
        return(
            <div>
                <LinearProgress/>
            </div>
        )
    }
        
    }

    

export default Sessions
