import {React, useEffect, useState} from 'react'
import {db} from '../Firebase/firebase.js';
import { doc, getDoc, getDocs, query, where,collection } from "firebase/firestore"; 
import Classroom from '../Classroom/Classroom.js';

function Home(props) {
    const name = 'testUser';
    const testSessionId = 100100;
    const [launched, setLaunched] = useState();
    const feature = props.feature;
    const userId = props.user;

    // console.log(userId)
    return(
        <Classroom
            studentId = {userId}
            lessons = {['Ordering Fractions']}
            sessionId = {testSessionId}
            username = {name}
            role = 'test'
            features = {feature}
        />
    )
    
}

export default Home