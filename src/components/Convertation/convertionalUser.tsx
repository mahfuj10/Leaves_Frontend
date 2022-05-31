import React, { useEffect, useState } from 'react'
import { Avatar, Box, Typography } from '@mui/material';
import { MdReply } from 'react-icons/md';
import { useAppDispatch, useAppSelector } from '../Redux/hooks';
import { selectUser } from '../Redux/counterSlice';
import { ActiveBadge } from '../ActiveBadge/ActiveBadge';


function CovertationUser({ convertionalUser, socket, uid, selectChatBox }: any) {


    const dispatch = useAppDispatch();
    const [activeUsers, setActiveUsers] = useState<any[]>([])
    const { convertationUsers, allUsers, loginUser } = useAppSelector(state => state.data);
    const [matchUser, setMatchUser] = useState<any>({});

    // useEffect(() => {
    //     if (loginUser.uid === null) return;
    //     socket?.current?.emit('login', { loginUser });
    // }, [loginUser, allUsers, socket?.current]);
    //         const activeUsers = allUsers.filter(user => user.uid === id.userId);
    //         const activeUser = activeUsers.find(user => user.uid === convertionalUser.uid)
    //         console.log(activeUser);
    //     }

    // });

    // check user active or disactive




    useEffect(() => {
        // socket?.current?.on('user-connected', (data: any) => {
        //     // setActiveUsers([...activeUsers, data]);
        //     if (loginUser?.email !== data?.email) {
        //         setActiveUsers([...activeUsers, data])
        //         // setActiveUsers([...activeUsers, data]);
        //     }
        // });
        // const user = activeUsers?.find((user: any) => user?.email === convertionalUser?.email);
        // setMatchUser(user);

        // socket?.current?.on('user-disconnected', (data: any) => {

        // });
        // if (user === undefined || user === null) {
        //     const again = activeUsers.find((user: any) => user?.email === convertionalUser?.email);
        //     setMatchUser(again);
        // }

    }, [])


    return (

        <>


            <Box
                onClick={() => {
                    dispatch(selectUser(convertionalUser))
                    selectChatBox()
                }}
                sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: 'center',
                    mb: 3,
                    p: 1,
                    borderRadius: uid === convertionalUser.uid ? 0 : 2,
                    background: uid === convertionalUser.uid ? 'none' : '#5C4F81',
                    borderRight: uid === convertionalUser.uid ? '3px solid #5C4F81' : ''
                }}>

                {/* ActiveBadge */}

                {
                    matchUser?.email === convertionalUser?.email ?
                        <ActiveBadge photoURL={matchUser?.photoURL} />
                        :
                        <Avatar
                            alt="user photo"
                            sx={{
                                width: { xs: 30, md: 50 },
                                height: { xs: 30, md: 50 },
                            }}
                            src={convertionalUser.photoURL}
                        />

                }

                <Box sx={{ display: { xs: 'none', md: 'block' } }}>


                    <Typography variant='h6' sx={{ fontSize: 16, color: "whitesmoke" }}>
                        {convertionalUser.displayName}
                    </Typography>

                    <Typography variant='h6' sx={{ fontSize: 11, color: '#9881d6' }}>

                        {
                            uid === convertionalUser.uid && <MdReply className='reply_icon'
                            />
                        }

                        {convertionalUser.email}

                    </Typography>

                </Box>

            </Box>
        </>
    )
}

export default CovertationUser;