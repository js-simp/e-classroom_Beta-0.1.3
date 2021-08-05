import React from 'react'
import './Sessions.css';


// the props will be:
// props.Name : students name
// props.StudentId : students id
//props.SessionId : session Id for the call
// props.SchoolId : School Id
// props.Year : Students school year
// props.Time : Time the session is booked for
// ;
function Sessions(props) {
    return (
<div>
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
                        {props.Date}
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
                });
                }
            }
            >
                Join Session!!</button>
            {/* <div class="meeting-number" style="clear: both;">
            <!-- Meeting number: <br/><strong></strong> -->
            </div> */}
            </div>
        </div>
        </div>
    </div>

</div>
</div>
    )
}

export default Sessions
