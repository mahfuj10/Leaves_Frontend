import { Box, Typography } from '@mui/material'
import React, { useRef } from 'react'
import { useFirebase } from '../hooks/useFirebase';


export const ForgetPass = () => {

    const emailRef = useRef<any>(null);
    const { reseatPassword, processing } = useFirebase();

    const sendResetPassEmail = (e: any) => {
        e.preventDefault();

        reseatPassword(emailRef.current.value);
    };

    return (

        <>

            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>

                <Box sx={{ width: { md: 300 }, boxShadow: 2 }}>

                    <form className='resetpass_field' onSubmit={sendResetPassEmail}>

                        <Typography sx={{ mb: 1, color: 'whitesmoke' }} variant='body2'>
                            Note:- Please give this email which you used on login and now you dunno this password. Otherwise passworld will be not change.
                        </Typography>

                        <input
                            placeholder='Enter email *'
                            ref={emailRef}
                            required
                            type="email"
                        />

                        {
                            processing ?
                                <button disabled>Loading...</button>
                                :
                                <button type='submit'>  SEND</button>
                        }
                    </form>

                </Box>

            </Box>

        </>

    )
}