import React, { useState } from 'react'
import '../Styles/NewPostStyling.scss'
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import {useNavigate} from 'react-router-dom'
import PopUpNotification from '../components/PopUpNotification';




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

function NewPost() {

    //For Navigation
    const navigate = useNavigate()

    //For Success and Error msg
    const [postSuccess, setPostSuccess] = useState(false);
    const [titleLenErr, setTitleLenErr] = useState(false);
    const [summaryLenErr, setSummaryLenErr] = useState(false);


    //Post Datas
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');

    async function CreatePost(ev) {
        ev.preventDefault();

        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('file', files[0]);

        const base =files[0];

        if ((data.get('title').length<=20) && (data.get('summary').length <= 150)) {
            
            try {
                const res = await fetch('http://localhost:4000/post', {
                    method: 'POST',
                    body: data,
                    credentials: 'include'
    
                });
    
                if(res.ok){
                    res.json().then(dt =>{
                        setPostSuccess(true);
    
                        setTimeout(()=>{
                            navigate('/');
                        },2000)
    
                    }).catch((e)=>{
                        console.log(e);
                    })
                }
            } catch (error) {
                console.log(error);
            }

        } else if(data.get('title').length>20){
            setTitleLenErr(true);
        } else {
            setSummaryLenErr(true);
        }
        


    }

    function backButton(){  
        navigate('/');
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
                            <h1>New Post</h1>
                        </div>
                    </header>
                    <form onSubmit={CreatePost}>
                        <input type="text" placeholder="Enter Title of the Blog" value={title} onChange={ev => setTitle(ev.target.value)} />
                        <input type="text" placeholder="Enter Summary of Blog" value={summary} onChange={ev => setSummary(ev.target.value)} />
                        <input type='file' onChange={ev => setFiles(ev.target.files)} />
                        <ReactQuill className='ContentTextArea' value={content} onChange={newValue => setContent(newValue)} modules={modules} formats={formats} />
                        <input type="submit" className="button" value="Post" />
                    </form>
                </div>
            </div>
            <div className='ErrMsg'>
                {
                    (postSuccess)?(
                        <PopUpNotification ErrType={"Green"} ErrMsg={"Post Created Successfully"} setErrNotification={setPostSuccess}/>
                    ):""
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

export default NewPost

function ConvertImgToBase64(file) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
            resolve(fileReader.result);
        };
        fileReader.onerror = (err) => {
            reject(err);
        }
    })
}