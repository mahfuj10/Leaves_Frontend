import React from 'react';
import { Avatar, Fade, IconButton, Paper, Skeleton, Stack, Typography } from '@mui/material';
import { AiOutlineMail } from 'react-icons/ai';
import { FiSmartphone } from 'react-icons/fi';
import { Box } from '@mui/system';
import { useAppSelector } from '../Redux/hooks';

const UserDetails = ({ user }: any) => {

    const { messages, messageDataLoading, openDetailsSection } = useAppSelector(state => state?.data);
    const images = messages.filter(image => image?.picture);

    return (

        <>



            <Paper elevation={0} sx={{
                p: 3,
                borderRadius: 0,
                background: "#4E426D",
            }}>

                <Avatar src={user?.photoURL} alt={user?.email} sx={{ width: 70, height: 70, m: '0 auto' }} />

                <Typography variant='h6' sx={{ fontSize: 18, textAlign: 'center', mt: 1, color: "#fff" }}>{user?.displayName}</Typography>

                {
                    user?.profession && <Typography variant='h6' sx={{ fontSize: 14, textAlign: 'center', mt: 1, color: "whitesmoke" }}>
                        {user.profession}
                    </Typography>
                }

                {
                    user?.adress && <Typography variant='h6' sx={{ fontSize: 13, textAlign: 'center', mt: 1, color: "whitesmoke" }}>
                        {user.adress}
                    </Typography>
                }

                <Typography variant='h6' sx={{ fontSize: 16, mt: 3, borderBottom: '2px solid #5C4F81', pb: 1, mb: 2, color: "whitesmoke" }}>Contact Information</Typography>

                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    my: 1,
                }}>

                    <IconButton sx={{ fontSize: 18, color: 'whitesmoke', background: '#5C4F81' }}>
                        <AiOutlineMail />
                    </IconButton>


                    <Typography variant='h6' sx={{ fontSize: 13, color: "whitesmoke" }}>
                        {user?.email}
                    </Typography>


                </Box>


                {
                    user?.phone && <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        my: 2
                    }}>

                        <IconButton sx={{ fontSize: 18, color: 'whitesmoke', background: '#5C4F81' }}>
                            <FiSmartphone />
                        </IconButton>


                        <Typography variant='h6' sx={{ fontSize: 13, color: "whitesmoke" }}>
                            {user?.phone}
                        </Typography>


                    </Box>
                }

                <p style={{ borderBottom: '2px solid #5C4F81', }} />

                <Typography variant='h6'
                    sx={{
                        fontSize: 14,
                        letterSpacing: 1,
                        color: 'whitesmoke'
                    }}
                >
                    Attachment ({images.length})
                </Typography>


                {
                    messageDataLoading &&
                    <Box className="attachment">
                        {[...new Array(3)].map((ske, index) => <Stack key={index} spacing={1} >
                            <Skeleton
                                variant="rectangular"
                                sx={{
                                    height: 60,
                                    width: 70,
                                    borderRadius: 2,
                                }}
                            />
                        </Stack>
                        )}
                    </Box>
                }

                {
                    !messageDataLoading &&

                    <Box className="attachment">
                        {
                            messages.map(message => message.picture !== '' && <Avatar
                                src={message?.picture}
                                key={message._id}
                                sx={{
                                    height: 60,
                                    width: 70,
                                    borderRadius: 2,
                                    mb: 2,
                                    boxShadow: 1
                                }}
                            />)
                        }
                    </Box>
                }

            </Paper>

        </>
    )
};

export default UserDetails;