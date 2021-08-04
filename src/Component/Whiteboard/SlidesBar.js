import {React} from 'react'

function SlidesBar(props) {
    // ----------- slide selector for pages-----------------------
    return (
        <div>
        {
          props.slidesArr.map((user, index) => {
              return(
            <button className = {(props.selected.active === index && props.selected.title === props.lessonTitle) ? 'active' : ''} 
            onClick={() => { props.getSlide(props.lessonTitle ,index) }} style={{ display: "inline", width: "50px", border: "none", height: "50px" }}>
             📒<p style={{fontSize:"15px"}}>{index + 1}</p>
             <div className = "slide-popover">
              <img id = {`${props.lessonTitle}${index}`} src = {user} alt = "" 
              style={
                { display: "inline", 
                width: "50px", 
                border: "none", 
                height: "50px" }}>
                </img>
             </div>
            </button>
              )
          })
        }
        </div>
    );
}

export default SlidesBar
