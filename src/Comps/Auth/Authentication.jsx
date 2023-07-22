import React, { useState, useRef } from 'react'
import { FaCheckCircle, FaRegEdit } from 'react-icons/fa'
import { MdError } from 'react-icons/md'
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai'
import { API_URL } from '../../Constants'
import axios from 'axios'
import { useNavigate } from 'react-router'

export const Authentication = () => {

  let navigate = useNavigate();

  const passwordRef = useRef('')
  const mailRef = useRef('')
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    password: '',
  })
  const [togPassType, setTogPassType] = useState(false)
  const [nameValid, setNameValid] = useState(false)
  const [emailValid, setEmailValid] = useState(false)
  const [gotoLogin, setGotoLogin] = useState(false)
  const [gotoRegister, setGotoRegister] = useState(false)
  const [responseErr, setResponseErr] = useState({})

  // email id filled & checked for mail validation
  const emailChangeHandler = (e) => {
    setProfileData({ ...profileData, email: e.target.value })

    // check mail validation 
    let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{1,}))$/;
    if (regEmail.test(profileData.email)) {
      setEmailValid(true)
      // console.log('Invalid Email');
    } else {
      setEmailValid(false)
    }
  }

  // when continue to login or register buttonclicked
  const continueClick = async () => {
    // console.log('clicked');

    await axios.post(`${API_URL}/check-user`, {
      email: profileData.email
    }).then(response => {
      console.log(response);
      if (response.data?.isRegister) {
        setGotoLogin(true)
        setGotoRegister(false)
      } else {
        setGotoLogin(false)
        setGotoRegister(true)
      }
    })

  }
  // show or hide password
  const showPassword = () => {
    setTogPassType(true)
    passwordRef.current.type = "text"
  }
  const hidePassword = () => {
    setTogPassType(false)
    passwordRef.current.type = "password"
  }

  // when someone click on edit email in login or register page
  const mailEditHandler = () => {
    setGotoLogin(false)
    setGotoRegister(false)
    setProfileData({
      name: '',
      email: profileData.email,
      password: '',
    })
    mailRef.current.focus()
  }


  const handleLogin = async () => {
    
    await axios.post(`${API_URL}/login`, {email: profileData.email, password: profileData.password})
    .then(response => {
      console.log(response);
      if(response.data?.success) {
        console.log(response.data);
        localStorage.setItem("user", `${response.data?.user?.name}`)
        localStorage.setItem("loggedIn", "true")
        navigate("/quiz")
        setResponseErr({})
      } else {
        console.log('error', response.data)
        setResponseErr(response.data)
      }
    })
  }

  const handleRegister = async() => {
    await axios.post(`${API_URL}/register`, {...profileData})
    .then(response => {
      console.log(response);
      if(response.data?.success) {
        alert("Registration Successfull")
        setGotoLogin(true);
        setGotoRegister(false);
        setResponseErr({})
      } else {
        setResponseErr(response.data)
        console.log('error', response.data)
      }
    })
  }

  return (
    <>
      <div className="" >
        <div className="container authentication">
          <div className="row pt-3">
            <div className="card mx-auto " style={{ minHeight: '75vh' }}>
              <div className="px-3 px-sm-5 py-3 mt-5">
                <h4 className="title mb-5 text-center">
                  {
                    !gotoLogin && !gotoRegister && "Login / Register"
                  }
                  {gotoLogin && "Login"}
                  {gotoRegister && "Register"}
                </h4>
                <h6 className="text-green fs-14 text-center">
                  {gotoLogin && "Glad to See You Again"}
                  {gotoRegister && "We Are Happy 😍 To See You Here"}
                </h6>

                {
                  gotoRegister && <div className="input-field-wrapper mt-3">
                    <div className="input-field">
                      <label htmlFor='name' className={`form-label fs-12 label ${profileData.name.length !== 0 ? 'valid' : ''}`}>
                        Name
                      </label>
                      <input
                        type="text"
                        className={`form-control ${(gotoLogin || gotoRegister) ? '' : nameValid ? 'validEmail' : ''}`}
                        name="name"
                        id="name"
                        autoComplete="off"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prevState => ({ ...prevState, name: e.target.value }))}
                      />
                    </div>
                  </div>
                }
                <div className="input-field-wrapper mt-3">
                  <div className="input-field">
                    <label htmlFor='email' className={`form-label fs-12 label ${profileData.email.length !== 0 ? 'valid' : ''}`}>
                      Email Address
                    </label>
                    <input
                      type="text"
                      ref={mailRef}
                      className={`form-control ${(gotoLogin || gotoRegister) ? '' : emailValid ? 'validEmail' : ''}`}
                      name="email"
                      id="email"
                      disabled={gotoRegister || gotoLogin}
                      placeholder='Enter Email address to continue...'
                      autoComplete="off"
                      value={profileData.email}
                      onChange={emailChangeHandler}
                    />
                    {profileData.email.length !== 0 && !emailValid && <span className="validation"><MdError color="red" size="20px" /></span>}
                    {emailValid && (!gotoLogin && !gotoRegister) && <span className="validation"><FaCheckCircle color="#009724" size="20px" /></span>}
                    {(gotoLogin || gotoRegister) && <span className="validation edit" onClick={mailEditHandler}><FaRegEdit size="20px" /></span>}
                  </div>
                </div>
                {
                  (gotoLogin || gotoRegister) && <>
                    <div className="input-field-wrapper mt-3 mb-2">
                      <div className="input-field">
                        <label htmlFor='password' className={`from-label fs-12 label ${profileData.password.length !== 0 ? 'valid' : ''}`}>
                          {gotoLogin && "Password"}
                          {gotoRegister && "Create Password"}
                        </label>
                        <input
                          type="password"
                          ref={passwordRef}
                          className={`form-control`}
                          name="password"
                          id="password"
                          autoComplete="off"
                          value={profileData.password}
                          onChange={(e) => { setProfileData({ ...profileData, password: e.target.value }); }}
                        />
                        {!togPassType && <span className="validation" onClick={showPassword} ><AiFillEye color="black" size="20px" /></span>}
                        {togPassType && <span className="validation" onClick={hidePassword} ><AiFillEyeInvisible color="#000" size="20px" /></span>}
                      </div>
                    </div>
                    {gotoRegister && <p className="mb-4 fs-12 w-md-80 text-muted"><MdError size="14px" /> Password must be between 6 to 20 alphanumeric and special characters.</p>}
                    
                  </>
                }

                {
                  responseErr && <h6 className="text-danger">
                    {responseErr.message}
                  </h6>
                }
                {
                  !gotoLogin && !gotoRegister && <div className="input-field-wrapper mt-3 mt-3">
                    <button className="btn btn-primary w-100" disabled={!emailValid} onClick={continueClick}>CONTINUE</button>
                  </div>
                }
                {
                  gotoRegister && <div className="input-field-wrapper mt-3 ">
                    <button className="btn btn-primary w-100" onClick={handleRegister}>Register</button>
                  </div>
                }
                {gotoLogin && <div className="input-field-wrapper mt-3 ">
                  <button className="btn btn-dark w-100" disabled={!emailValid} onClick={handleLogin}>Login</button>
                </div>}
              </div>
            </div>

          </div>
        </div>
      </div>

    </>
  )
}
