import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';;
import PopUpNotification from './PopUpNotification';


//importing styles
import '../Styles/formStyling.scss'
import '../Styles/alertStyling.scss'
import { UserContext } from '../UserContext';


function LoginPage() {

    const navigate = useNavigate();

    const { setUserInfo } = useContext(UserContext);

    const ErrMsg = [
        "It Seems you didn't registered yet",
        "Incorrect Password. Try again",
        "Login Success"
    ]
    const ErrType = ["red", "green"];

    //For Unidentified User Login
    const [newUser, setNewUser] = useState(false);

    //For IncorrectPassword
    const [incorrectPassword, setIncorrectPassword] = useState(false);

    //For Login Success
    const [success, setSucces] = useState(false);

    //User Entering Data
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //To Show password while typing
    const [showPass, setShowPass] = useState(false);

    async function loginUser(ev) {
        ev.preventDefault();
        try {

            const res = await fetch('http://localhost:4000/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: { 'content-type': 'application/json' },
                credentials: 'include'
            })

            if (res.ok) {
                res.json()
                    .then(dt => {
                        if (dt == "IncorrectPassword") {
                            setNewUser(false);
                            setIncorrectPassword(true);
                            setSucces(false)
                        } else if (dt == null) {
                            setIncorrectPassword(false);
                            setNewUser(true);
                            setSucces(false)
                        } else {
                            setSucces(true);
                            setUserInfo(dt);
                            setNewUser(false);
                            setIncorrectPassword(false);

                            setTimeout(() => {
                                navigate('/', {
                                    state: {
                                        UserLoggedIn: true,
                                    }
                                });
                            }, 2000)
                        }
                    }).catch(e => {
                        console.log(e);
                    })

            }


        } catch (error) {
            console.log(error);
        }

    }

    return (

        <div className='formElements'>
            <div className="container">
                <div className="registration form">
                    <header>Login</header>
                    <form onSubmit={loginUser}>
                        <input className='input' type="email" placeholder="Enter your email" value={email} onChange={ev => setEmail(ev.target.value)} />
                        <input className='input' type={showPass ? "text" : "password"} placeholder="Enter your password" value={password} onChange={ev => setPassword(ev.target.value)} />
                        <div className='inputCheckBoxContainer'>
                            <input className='inputCheckBox' type="checkbox" name="" id="" onChange={() => setShowPass(!showPass)} />
                            <span> Show Password</span>
                        </div>
                        <input type="submit" className="button input" />
                    </form>
                    <div className="signup">
                        <span className="signup">New User..?
                            <Link to={'/SignUpPage'}>
                                Create an Account
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
            {/* Unidentifed User Login */}
            <div className='ErrMsg'>
                {
                    (newUser) ? (
                        <PopUpNotification ErrType={ErrType[0]} ErrMsg={ErrMsg[0]} setErrNotification={setNewUser} />
                    ) : ""
                }
                {
                    (incorrectPassword) ? (
                        <PopUpNotification ErrType={ErrType[0]} ErrMsg={ErrMsg[1]} setErrNotification={setIncorrectPassword} />
                    ) : ""
                }

                {
                    (success) ? (
                        <PopUpNotification ErrType={ErrType[1]} ErrMsg={ErrMsg[2]} setErrNotification={setSucces} />
                    ) : ""
                }
            </div>
        </div>


    )
}

export default LoginPage