import {React, useState} from 'react'
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

        return (
    <div className =  "card-block card-block--box-shadow-tiny card-block--padding-20-20">
    
        {/* ----------------------------------------This is is the title bar section ----------------------------------------------------------------------------------- */}
        <div className="card-block__title-bar">
            <div className="card-block__title-main">
                    <div className="card-block__timestamp">
                        <div className="card-block__time-box">
                        <div className="card-block__time">
                            {props.Time}
                        </div>
                        </div>
                    </div>
                    <div className="card-block__name">
                        <a className="card-block__title card-block__title--link" href="/students/102588#profile">{props.Name}  {props.StudentId}</a>
                            {props.Year}
                        <div className="card-block__title-pill-section">
                        </div>
                    </div>
                    <div className="card-block__school-name">
                        School {props.SchoolId}
                    </div>
            </div>
        </div>  
        {/* ---------------------------------------------------Start of card content-------------------------------------------------------------------------------    */}
        <div className="card-block__content">
            <div className="card-block__table">
                <div className="card-block__section-row">
                        <div className="card-block__section-title">
                        Now:
                        </div>
                        <div className="card-block__section-content ">
                            <a className="overlay customOverlayEvent card-block__section-link" data-href="/curriculum/990/lesson_overlay" data-lesson="990" href="#">
                            {props.Lessons[0]}
                            </a><br/><a className="overlay customOverlayEvent card-block__section-link" data-href="/curriculum/651/lesson_overlay" data-lesson="651" href="#">
                            {props.Lessons[1]}
                            </a><br/><a className="overlay customOverlayEvent card-block__section-link" data-href="/curriculum/668/lesson_overlay" data-lesson="668" href="#">
                            {props.Lessons[2]}
                            </a>
                        </div>
                </div>
            </div>
     {/*--------------------------------------------------- The buttons section------------------------------------------------------------------------------------- */}
            <div className="card-block__button-section">
            <div className="card-block__button-wrapper">
                <div id="learning-session-1857904-button" className="with-tooltip" title="You are currently not able to launch this session as no student has been assigned
                    yet or the session is not within 10 minutes of the start time">
                <button className="button button--small button--rewards-board button--hard-disable" 
                data-session-start="1625488200"
                onClick ={
                    () =>         
                {
                    props.setLaunched({
                        'sessionId' : props.SessionId, 
                        'username' : props.username, 
                        'studentId': props.StudentId, 
                        'schoolId' : props.SchoolId, 
                        'lessons' : props.Lessons
                });
                }
                }
                    
                >Start Session</button>
                {/* <div class="meeting-number" style="clear: both;">
                <!-- Meeting number: <br/><strong></strong> -->
                </div> */}
                </div>
            </div>
            <div className="card-block__button-wrapper">
                <button className="button button--small button--rewards-board" href="#">Add feedback</button>
            </div>
            <div className="card-block__button-wrapper">
                <button href="#" className="button button--small button--rewards-board overlay" data-href="/learning_sessions/1857904/cancel_session">Cancel</button>
            </div>
            </div>
        </div>
     
    </div>
        )
    }

    

export default Sessions
