import { Avatar, Box, Button, Typography } from '@mui/material';
import React from 'react'
import ScrollToBottom from 'react-scroll-to-bottom';
import { useAppSelector } from '../Redux/hooks'


const MyContacts = () => {

    const { convertationUsers } = useAppSelector(state => state.data);

    // stylesheet
    const buttonStyle = {
        color: "whitesmoke",
        borderColor: 'whitesmoke',
        '&:hover': {
            borderColor: '#5C4F81'
        }
    };

    return (

        <Box sx={{ height: 370, overflowY: 'scroll' }}>

            <ScrollToBottom>

                {
                    convertationUsers.map(user => <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 2,
                        background: '#4E426D',
                        p: 1,
                        borderRadius: 4
                    }}
                        key={user._id}
                    >

                        <Avatar
                            src={user?.photoURL}
                            alt={user?.displayName}
                        />

                        <Typography variant='body1'>{user?.displayName}</Typography>

                        <Button variant='outlined' sx={buttonStyle}>REMOVE FROM CONTACT</Button>

                    </Box>
                    )
                }
            </ScrollToBottom>
        </Box>

    )
}
export default MyContacts;