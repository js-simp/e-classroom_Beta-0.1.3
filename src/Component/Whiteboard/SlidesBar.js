import {React} from 'react'

function SlidesBar(props) {
    // ----------- slide selector for pages-----------------------
    return (
        <div className = 'slides-container'>
        {
          props.slidesArr.map((user, index) => {
              return(
            <button className = {(props.selected.active === index && props.selected.title === props.lessonTitle) ? 'active' : ''} 
            onClick={() => { props.getSlide(props.lessonTitle ,index) }} style={{ display: "inline", width: "40px", border: "2px solid black", height: "40px" }}>
             <p style={{fontSize:"15px"}}>{index + 1}</p>
             <div className = "slide-popover">
              <img id = {`${props.lessonTitle}${index}`} src = {user} alt = "" 
              style={
                { display: "inline", 
                width: "40px", 
                border: "none", 
                height: "40px" }}>
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
