import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import NavBar from './NavBar'
import { UserContext } from '../UserContext'
import Post from '../post/Post';

import '../Styles/HomeStyling.scss'

function HomePage() {
    // const [userDetails, setUserdetails] = useState("");
    const { userInfo, setUserInfo } = useContext(UserContext);

    const [postDetails, setPostDetails] = useState([])

    useEffect(() => {
        fetch('http://localhost:4000/profile', {
            credentials: 'include',
        }).then(res => {
            res.json().then(dt => {
                setUserInfo(dt.userInfo);
            });
        });
    }, []);

    useEffect(() => {
        fetch('http://localhost:4000/post').then(res => res.json()).then(postInfo => setPostDetails(postInfo));
    }, []);
    const username = userInfo?.username;
    return (
        <div className='HomePage'>
            <NavBar />
            <div className='ToCenter'>
                <div className='SinglePostContainer' >
                    {
                        postDetails.length > 0 && postDetails.map((dt, index) => (<Post key={index} {...dt} />))
                    }
                </div>
            </div>
        </div>

    )
}

export default HomePage