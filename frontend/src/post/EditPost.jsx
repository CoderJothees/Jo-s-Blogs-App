import React, { useEffect, useState } from 'react'
import '../Styles/NewPostStyling.scss'
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { useNavigate, useParams, Link } from 'react-router-dom'
import PopUpNotification from '../components/PopUpNotification';
import Swal from 'sweetalert2'


//This is for react Quill
const modules = {
    toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image'],
        ['clean']
    ],
};

const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
];



function EditPost() {

    //To get Current post id 
    const { id } = useParams();

    //For Navigation
    const navigate = useNavigate();

    //For Success msg
    const [postSuccess, setPostSuccess] = useState(false);
    const [titleLenErr, setTitleLenErr] = useState(false);
    const [summaryLenErr, setSummaryLenErr] = useState(false);


    //To store Post Data Recieved from Api
    const [postDocs, setPostDocs] = useState();

    //Post Datas
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');

    const data = new FormData();
    data.set('id', id)
    data.set('title', title);
    data.set('summary', summary);
    data.set('content', content);
    data.set('file', files[0]);

    useEffect(() => {
        fetch(`http://localhost:4000/FullPost/${id}`).then(res => res.json())
            .then(postData => {
                setPostDocs(postData);
                setTitle(postData.title);
                setSummary(postData.summary);
                setContent(postData.content);
                console.log(postData);
            })
    }, []);

    //Back Button Function
    const backButton = () => {

        try {

            if ((postDocs.title != data.get('title')) || (postDocs.summary != data.get('summary')) || (postDocs.content != data.get('content'))) {
                Swal.fire({
                    title: "Do you want to save the changes?",
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Save",
                    denyButtonText: `Don't save`
                }).then(async (result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {

                        if ((data.get('title').length <= 20) && (data.get('summary').length <= 150)) {

                            await fetch('http://localhost:4000/EditPost', {
                                method: 'PUT',
                                body: data,
                                credentials: 'include'
                            });

                            Swal.fire("Saved!", "", "success")
                            .then(res => {
                                navigate(`/FullPost/${id}`);
                            })

                        } else if (data.get('title').length > 20) {
                            setTitleLenErr(true);
                        } else {
                            setSummaryLenErr(true);
                        }
                    } else if (result.isDenied) {
                        Swal.fire("Changes are not saved", "", "info")
                            .then(res => {
                                if (res.isConfirmed) {
                                    navigate(`/FullPost/${id}`);
                                }
                            });
                    }
                });
            } else {
                navigate(`/FullPost/${id}`);
            }

        } catch (error) {
            console.log(error);
        }
    }


    //Edit Post Function
    async function PostEdit(ev) {
        ev.preventDefault();

        if ((data.get('title').length <= 20) && (data.get('summary').length <= 150)) {

            try {
                const res = await fetch('http://localhost:4000/EditPost', {
                    method: 'PUT',
                    body: data,
                    credentials: 'include'

                });
                Swal.fire("Saved!", "", "success").then(
                    result => {
                        if (result.isConfirmed) {
                            navigate(`/FullPost/${id}`);
                        }
                    }
                )
            } catch (error) {
                console.log(error);
            }

        } else if (data.get('title').length > 20) {
            setTitleLenErr(true);
        } else {
            setSummaryLenErr(true);
        }



    }
    return (
        <div className='NewPost'>
            <div className="container">
                <div className="registration form">
                    <header>
                        <div className='backButtonContainer'>
                            <button className='btn' onClick={backButton}> &lt;- Back</button>
                        </div>
                        <div className='title'>
                            <h1>Edit Post</h1>
                        </div>
                    </header>
                    <form onSubmit={PostEdit}>
                        <input type="text" placeholder="Enter Title of the Blog" value={title} onChange={ev => setTitle(ev.target.value)} />
                        <input type="text" placeholder="Enter Summary of Blog" value={summary} onChange={ev => setSummary(ev.target.value)} />
                        <input type='file' onChange={ev => setFiles(ev.target.files)} />
                        <ReactQuill className='ContentTextArea' value={content} onChange={newValue => setContent(newValue)} modules={modules} formats={formats} />
                        <input type="submit" className="button" value="Save" />
                    </form>
                </div>
            </div>
            <div className='ErrMsg'>
                {
                    (postSuccess) ? (
                        <PopUpNotification ErrType={"Green"} ErrMsg={"Post Edited Successfully"} setErrNotification={setPostSuccess} />
                    ) : ""
                }
                {
                    (titleLenErr)?(
                        <PopUpNotification ErrType={"red"} ErrMsg={"Title Length Should be less then 20"} setErrNotification={setTitleLenErr}/>
                    ):""
                }
                {
                    (summaryLenErr)?(
                        <PopUpNotification ErrType={"red"} ErrMsg={"Summary Length Should be less then 150"} setErrNotification={setSummaryLenErr}/>
                    ):""
                }
            </div>
        </div>
    )
}

export default EditPost