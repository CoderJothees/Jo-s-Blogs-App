import React, { useContext, useEffect } from 'react';
import '../Styles/navbarStyling.scss';
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext';
import Swal from 'sweetalert2';

function NavBar() {
    const { userInfo, setUserInfo } = useContext(UserContext);

    useEffect(() => {
        fetch('http://localhost:4000/profile', {
            credentials: 'include'
        }).then(res => res.json())
            .then(dt => {
                // setUserInfo(dt.userInfo);
                // console.log(dt.userInfo);
            })
            .catch((e) => {
                console.log(e);
            })
    }, []);

    const username = userInfo?.username;

    return (
        <div className='NavigationBar'>
            <nav>
                <label className="logo">JO's Blogs</label>
                <ul>

                    {
                        username && (
                            <>
                                <li><Link to={'/NewPost'}>New Post</Link></li>
                                <li><Link to={'/ProfilePage'}>Profile</Link></li>
                            </>)
                    }
                    {
                        !username && (
                            <>
                                <li><Link to={'/LoginPage'}>Login</Link></li>
                                <li><Link to={'/SignUpPage'}>SignUp</Link></li>
                            </>
                        )
                    }
                </ul>
            </nav>
        </div>
    )
}

export default NavBar