import { Button, LinearProgress } from '@material-ui/core';
import { PinDropSharp } from '@material-ui/icons';
import { render } from '@testing-library/react';
import {React, useState, useEffect, Component} from 'react'
import db from '../Firebase/firebase'
import CountDown from '../Timer/timer';
import Whiteboard from '../Whiteboard/Whiteboard';
import Classroom from '../Classroom/Classroom.js';
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
    //var today = Math.round((new Date()).getTime() / 1000);
    //const ref = db.collection('Tutors').doc('000423');
    <Whiteboard textn="thevan"/>
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
    },[])

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
                        <Button id="buttonses" className="button button--small button--rewards-board button--hard-disable" variant="contained" color="primary"
                        data-session-start="1625488200"
                        onClick ={
                            () =>         
                        {
                            props.setLaunched({
                                'sessionId' : props.SessionId, 
                                'lessons' : props.Lessons,
                                'startTime' : props.epoch
                        });
                        //console.log(today);
                        //console.log(props.epoch);
                        //let final = today - props.epoch
                        //const final2 = final - (2*final)
                        //const final3 = final2/60
                        
                        //console.log(final);
                        //console.log(final2);
                        //console.log(final3);
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
