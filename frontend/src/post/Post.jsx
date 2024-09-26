import React, { useContext } from 'react'
import '../Styles/PostStyling.scss'
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import Swal from 'sweetalert2';


function Post({ _id, title, summary, cover, content, createdAt, author }) {

    //User Data
    const { userInfo } = useContext(UserContext);

    //To Navigate
    const navigate = useNavigate();

    const CheckAndRedirect = () => {
        if (userInfo) {
            navigate(`/FullPost/${_id}`);
        } else {
            Swal.fire({
                text: 'It Seem you Didnt login, first Login to see the post',
                confirmButtonColor: '#009579'
            })
        }
    }

    return (
        <div className='SinglePost' onClick={CheckAndRedirect}>
            <div className="articles">
                <figure>
                    <img src={'http://localhost:4000/' + cover} alt={cover} loading='lazy' />
                </figure>
                <div className='articleBody'>
                    <h2 className='title'>{title}</h2>
                    <p>Posted By <span className="authorName">{author.username}</span> <br /> <span className='date'> {format(new Date(createdAt), 'MMM d, yyyy HH:mm')}</span> </p>
                    <p className='summary'>{summary}</p>
                    <p className='read-more'>Read more</p>
                </div>
            </div>
        </div>
    )
}

export default Post