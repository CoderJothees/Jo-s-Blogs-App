import React, { useContext, useEffect, useState } from 'react'
import '../Styles/ProfileStyling.scss';
import { UserContext } from '../UserContext';
import Post from '../post/Post';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function ProfilePage() {

    const { userInfo, setUserInfo } = useContext(UserContext);

    // console.log(userInfo.username);  

    const nav = useNavigate();




    useEffect(() => {

        if (userInfo.username == undefined) {
            nav('/LoginPage');
        } else {
            fetch('http://localhost:4000/profile', {
                credentials: 'include',
            }).then(res => {
                res.json().then(dt => {
                    setUserInfo(dt.userInfo);
                    setPostInfo(dt.PostInfo)
                    setPostCount(dt.PostCount);
                });
            });
        }
    }, []);


    const [postInfo, setPostInfo] = useState([]);
    const [postCount, setPostCount] = useState('');

    //For reset password Function
    const [resetPass, setResetPass] = useState('');



    //Reset Password Function
    const ResetPassword = () => {

        try {
            Swal.fire({
                title: 'Enter Current Password',
                input: 'text',
                inputAttributes: {
                    autocapitalize: "off"
                },
                showConfirmButton: true,
                confirmButtonColor: '#009579',
                showCancelButton: true,
                preConfirm: async (oldPass) => {

                    fetch('http://localhost:4000/ResetPassword', {
                        method: 'post',
                        body: JSON.stringify({ pass: oldPass, email: userInfo.email }),
                        headers: { 'content-type': 'application/json' },
                        credentials: 'include',
                    }).then(response => response.json()).then((res => {
                        if (res == "Password Matched") {
                            Swal.fire({
                                title: "Enter New Password",
                                input: 'text',
                                confirmButtonColor: '#009579',
                                preConfirm: async (newPass) => {
                                    if (oldPass != newPass) {
                                        const PassRes = await fetch('http://localhost:4000/ResetPassword', {
                                            method: 'put',
                                            body: JSON.stringify({ pass: newPass, email: userInfo.email }),
                                            headers: { 'content-type': 'application/json' },
                                            credentials: 'include',
                                        });
                                        if (PassRes.ok) {
                                            Swal.fire({
                                                text: 'Password Updated',
                                                confirmButtonColor: '#009579'
                                            });
                                        } else {
                                            Swal.fire({
                                                text: 'Something went Wrong, please Try again',
                                                confirmButtonColor: '#009579'
                                            })
                                        }
                                    } else {
                                        Swal.fire({
                                            text: 'New password should not be same as old password',
                                            confirmButtonColor: '#009579'
                                        });
                                    }
                                }
                            });
                        } else {
                            Swal.fire({
                                text: 'Password Mismatched Try again',
                                confirmButtonColor: '#009579'
                            });
                        }
                    }))

                }
            })
        } catch (error) {
            console.log(error);
        }
    }


    //Logout function 
    function logoutUser(){
        Swal.fire({
            title: "Are you sure?",
            text: "You want to logout",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, logout!"
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: "Logged out!",
                text: "Press ok to redirect to Home page",
                icon: "success"
              }).then((res)=>{
                if(res.isConfirmed){
                    fetch("http://localhost:4000/logout", {
                        method: 'POST',
                        credentials: 'include'
                    });
            
                    setUserInfo(null);
                    nav('/');
                }
              })
            }
          });
    }


    return (


        <div className='ProfilePage'>
            <div className="ProfileContainer">
                <header>
                    <div className='backButtonContainer'>
                        <Link to={'/'} className='ProfileBackBtn'>Back</Link>
                    </div>
                    <div className='title'>
                        <h1 className='ProfileTitle'>Profile Page</h1>
                    </div>
                </header>
                <div className="blog-details">
                    <h2 className='blog-details-h2'>User Details</h2>
                    <ul className='userDetailsUl'>
                        <li className='userDetailsLi'><span className='hoverBG'>Username : {userInfo.username}</span></li>
                        <li className='userDetailsLi'><span className='hoverBG'>Email : {userInfo.email}</span></li>
                        <li className='userDetailsLi'><span className='hoverBG'>Total Blogs Posted: {postCount}</span></li>
                        <li className='userDetailsLi'><span><button className='ProfileBTN' onClick={ResetPassword}>Reset Password</button></span></li>
                        <li className='userDetailsLi'><span><button className='ProfileBTN' onClick={logoutUser}>Logout</button></span></li>

                    </ul>
                </div>
                <div className="blog-details">
                    <div>
                        <h2 className='blog-details-h2'>Blogs Details</h2>
                        <Link className='LinkTag' to={'/NewPost'}>Add New Post</Link>
                    </div>

                    <ul className='postList'>
                        {
                            postInfo.length > 0 && postInfo.map(
                                (dt, index) => (
                                    <li className='post' key={index}><Post {...dt} /></li>
                                )
                            )
                        }
                    </ul>

                </div>
            </div>
        </div>
    )
}

export default ProfilePage