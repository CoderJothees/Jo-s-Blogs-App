import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import PopUpNotification from './PopUpNotification';

//importing styles
import '../Styles/formStyling.scss'


function SignUpPage() {

    const [showPass, setShowPass] = useState(false);

    const navigate = useNavigate();

    //For Error Message
    const [err, setErr] = useState(false);
    const [passLengthErr, setPassLengthErr] = useState(false);
    const [incorrectPass, setIncorrectPass] = useState(false);

    const ErrMsg = [
        "Email Already Exist",
        "Password length must be greater then 6",
        "Password and confirm password must be same",
        "Sign up Success"
    ]
    const ErrType = ["red", "green"];

    //For Signup success
    const [success, setSucces] = useState(false);

    //User Datas
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

    //sign Up Function
    const SignUpUser = (ev) => {
        ev.preventDefault();

        if (password != confirmPass) {
            setIncorrectPass(true);
            setPassLengthErr(false);
            setSucces(false);
            setErr(false);

        } else if (password.length < 6) {
            setPassLengthErr(true);
            setIncorrectPass(false);
            setSucces(false);
            setErr(false);
        } else {
            //Back-end Method calling
            fetch('http://localhost:4000/signup', {
                method: 'POST',
                body: JSON.stringify({ username, email, password }),
                headers: { 'Content-Type': 'application/json' },
            }).then(res => res.json())
                .then(async dt => {
                    if (dt == "ok") {
                        setSucces(true);



                        //Auto Login After SignUp Success

                        await fetch('http://localhost:4000/login', {
                            method: 'POST',
                            body: JSON.stringify({ email, password }),
                            headers: { 'content-type': 'application/json' },
                            credentials: 'include'
                        })



                        setErr(false);
                        setPassLengthErr(false);
                        setIncorrectPass(false);

                        setTimeout(() => {
                            navigate('/');
                        }, 2000);

                    } else {
                        setErr(true);
                        setSucces(false);
                        setPassLengthErr(false);
                        setIncorrectPass(false);

                    }
                });
        }

    }

    return (
        <div className='formElements'>
            <div className="container">
                <div className="registration form">
                    <header>Signup</header>
                    <form onSubmit={SignUpUser}>
                        <input className='input' type="text" placeholder="Enter your username" value={username} onChange={ev => setUsername(ev.target.value)} />
                        <input className='input' type="email" placeholder="Enter your email" value={email} onChange={ev => setEmail(ev.target.value)} />
                        <input className='input' type={showPass ? "text" : "password"} placeholder="Create a password" value={password} onChange={ev => setPassword(ev.target.value)} />
                        <input className='input' type={showPass ? "text" : "password"} placeholder="Confirm your password" value={confirmPass} onChange={ev => setConfirmPass(ev.target.value)} />
                        <div className='inputCheckBoxContainer'>
                            <input className='inputCheckBox' type="checkbox" name="" id="" onChange={() => setShowPass(!showPass)} />
                            <span> Show Password</span>
                        </div>
                        <input type="submit" className="button input" value="Signup" />
                    </form>
                    <div className="signup">
                        <span className="signup">Already have an account?
                            <Link to={'/LoginPage'}>
                                <label >Login</label>
                            </Link>
                        </span> <br />
                        <span className="signup">Back to
                            <Link to={'/'}>
                                Home
                            </Link>
                        </span>
                    </div>
                </div>
            </div>
            {/* Error Message  */}

            <div className='ErrMsg'>
                {
                    (err) ? (
                        <PopUpNotification ErrType={ErrType[0]} ErrMsg={ErrMsg[0]} setErrNotification={setErr} />
                    ) : ""
                }
                {
                    (passLengthErr) ? (
                        <PopUpNotification ErrType={ErrType[0]} ErrMsg={ErrMsg[1]} setErrNotification={setPassLengthErr} />

                    ) : ""
                }

                {
                    (incorrectPass) ? (
                        <PopUpNotification ErrType={ErrType[0]} ErrMsg={ErrMsg[2]} setErrNotification={setIncorrectPass} />
                    ) : ""
                }

                {
                    (success) ? (
                        <PopUpNotification ErrType={ErrType[1]} ErrMsg={ErrMsg[3]} setErrNotification={setSucces} />
                    ) : ""
                }
            </div>

        </div>
    )
}

export default SignUpPage