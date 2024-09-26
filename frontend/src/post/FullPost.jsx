import React, { useContext, useEffect, useState } from 'react'
import '../Styles/FullPostPageStyling.scss'
import { useNavigate, useParams, Link } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { MdDeleteForever } from "react-icons/md";
import { MdEditSquare } from "react-icons/md";
import { Tooltip } from 'react-tooltip'
import Swal from 'sweetalert2'
function FullPost() {

    try {

        //Post ID
        const { id } = useParams();

        //To Navaigate
        const navigate = useNavigate();

        //Logged In User Details
        const { userInfo, setUserInfo } = useContext(UserContext);

        // to store post details
        const [postdocs, setPostdocs] = useState([]);

        //To Set UserId from postdetails
        const [userID, setUserID] = useState('');

        //Fetching Post detalis and User Details
        useEffect(() => {
            fetch(`http://localhost:4000/FullPost/${id}`).then(res => {
                res.json().then(async (dt) => {
                    setPostdocs(dt);
                    setUserID(dt.author._id)
                }).catch((e) => console.log(e))
            });

            fetch('http://localhost:4000/profile', {
                credentials: 'include',
            }).then(res => {
                res.json().then(dt => {
                    setUserInfo(dt.userInfo);
                    // console.log(userInfo);
                });
            });
        }, []);


        //Edit Post
        const Edit = ()=>{
            navigate(`/EditPost/${id}`);
        }
        //Delete Post
        const DeletePost = () => {

            Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#009579",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, delete it!"
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your post has been deleted.",
                        icon: "success"
                    }).then((res => {
                        if (res.isConfirmed) {
                            navigate('/');
                        }
                    }));

                    fetch(`http://localhost:4000/delete/${id}`, {
                        method: 'delete',
                    });

                }
            });
        }



        return (
            <div className='FullPost'>
                <div className="ProfileContainer">
                    <header>
                        <span className='backButtonContainter'>
                            <Link className='backButton' to="/" >Back</Link>
                        </span>
                        <div className='title'>
                            <h1>{postdocs.title}</h1>
                            <i>By {postdocs.author.username}</i>
                        </div>

                        {
                            (userInfo.id == userID) ? (
                                <div className='HeaderButtons'>
                                    <span>
                                        <button className='btn' data-tooltip-id='Edit' data-tooltip-content='Edit' onClick={Edit}><MdEditSquare className='Icons' /></button>
                                    </span>
                                    <span>
                                        <button className='btn' data-tooltip-id='Edit' data-tooltip-content='Delete' onClick={DeletePost}><MdDeleteForever className='Icons' /></button>
                                    </span>
                                </div>
                            ) : ""
                        }

                    </header>


                    <div className="blog-details">
                        <h2>Summary</h2>
                        <p>{postdocs.summary}</p>
                    </div>
                    <div className="blog-details">
                        <div>
                            <h2>Content</h2>
                        </div>

                        <div dangerouslySetInnerHTML={{ __html: postdocs.content }} className='BlogContent' />

                    </div>

                </div>
                <Tooltip id="Edit"/>
            </div>
        )
    } catch (error) {
        console.log(error);
    }
}

export default FullPost