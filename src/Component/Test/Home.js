import {React, useEffect, useState} from 'react'
import {db} from '../Firebase/firebase.js';
import { doc, getDoc, getDocs, query, where,collection } from "firebase/firestore"; 
import Classroom from '../Classroom/Classroom.js';

function Home(props) {
    const name = 'testUser';
    const testSessionId = 100100;
    const [launched, setLaunched] = useState();
    // const testFeatures = {'wb' : false, 'chat' : false, 'call' : false};

    const userId = props.user;


    return(
        <Classroom
            sessionId = {testSessionId}
            username = {name}
            role = 'test'
            features = {{'wb' : true, 'chat' : false, 'call' : false}}
        />
    )
    
}

export default Home