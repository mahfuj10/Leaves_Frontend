import React, { useRef, useState } from 'react'
import { Box, Button, Paper, Typography } from '@mui/material'
import { FcGoogle } from 'react-icons/fc';
import { IoChatboxEllipsesOutline } from 'react-icons/io5';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFirebase } from '../../components/hooks/useFirebase'
import { useAppSelector } from '../../components/Redux/hooks';
import '../../App.css'


type Inputs = {
    example: string,
    exampleRequired: string,
};

const Login = () => {

    const { handleGoogleSign, signUpWithEmail, processing, logInWithEmail } = useFirebase();
    const location = useLocation();
    const [registerStatus, setRegister] = useState<boolean>(false);
    const nameRef = useRef<any>(null);
    const emailRef = useRef<any>(null);
    const navigate = useNavigate();
    const passwordRef = useRef<any>(null);


    // google sign
    const googleSign = () => {
        handleGoogleSign(location);
    };
    const { loginUser } = useAppSelector(state => state?.data);

    // register and login function
    const handleAccountSign = (e: any) => {
        if (registerStatus) {
            signUpWithEmail(nameRef?.current?.value, emailRef?.current?.value, passwordRef?.current?.value);
        } else if (!registerStatus) {
            logInWithEmail(emailRef?.current?.value, passwordRef?.current?.value);
        }
        e.preventDefault();
    }



    // sstyle sheet
    const googleButton = {
        borderColor: '#453A61',
        p: 1,
        py: 1.5,
        fontSize: 17,
        '&:hover': {
            borderColor: '#453A61',
        },
        margin: '0 auto'
    }

    return (

        <Box
            sx={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundImage: 'linear-gradient(to right, #4E426D, #3b3153)'
            }}
        >


            <Paper elevation={3} sx={{ width: { xs: 300, md: 350 }, p: 3, background: "#5C4F81" }} className='login_form'>

                <Box className='logo_container'>
                    <span className='logo'>
                        <IoChatboxEllipsesOutline className='icon' />
                    </span>
                </Box>

                <Typography variant='h6'>
                    {
                        registerStatus ? 'Sign Up' : 'LOGIN'
                    }
                </Typography>

                <form onSubmit={handleAccountSign}>


                    {registerStatus && <input ref={nameRef} required placeholder='Name' type="text" />}

                    <input ref={emailRef} required placeholder='Email' type="email" />

                    <input ref={passwordRef} required placeholder='Password' type="password" />

                    {
                        !registerStatus && <span
                            onClick={() => navigate('/reseatpass')}
                            className='login_link'
                        >
                            Forget password ?
                        </span>
                    }

                    {
                        processing ?
                            <button id='login_button' type="submit">
                                Loading...
                            </button>
                            :
                            <button id='login_button' type="submit">
                                {
                                    registerStatus ? 'REGISTER' : 'LOGIN'
                                }
                            </button>
                    }





                </form>

                {!registerStatus &&
                    <span className='login_link' onClick={() => setRegister(true)}>Create an account ?</span>}

                {registerStatus && <span className='login_link' onClick={() => setRegister(false)}>Have an account ? Login </span>
                }

                <span style={{ display: "flex", justifyContent: 'center' }}>
                    <Button onClick={googleSign} variant='outlined' sx={googleButton}>
                        <FcGoogle />
                    </Button>
                </span>

            </Paper>

        </Box>

    )
}

export default Login;