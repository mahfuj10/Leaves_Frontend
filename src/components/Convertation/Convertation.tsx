import React, { useEffect, useState } from 'react'
import CovertationUser from './convertionalUser';
import { useFirebase } from '../hooks/useFirebase';
import { useAppDispatch, useAppSelector } from '../Redux/hooks';
import { getAllUsers, myConvertations, selectUser } from '../Redux/counterSlice';
import { Box, Button, Skeleton, Typography } from '@mui/material';

function Covertation({ socket, roomId, uid, addConverationRoute, handleDrawerOpen, selectChatBox }: any) {

    const [newUsers, setNewUsers] = useState<object>({});

    socket?.current?.on('addedUser', function (data: any) {
        dispatch(getAllUsers())
        setNewUsers(data);
    })
    // const { user } = useFirebase();
    const dispatch = useAppDispatch();
    const { allUsers, convertationUsers, usersDataLoading, selectedUser, searchText, loginUser } = useAppSelector(state => state.data);
    const currentUser = allUsers.find(current => current.uid === loginUser.uid);




    // data load
    useEffect(() => {

        // dispatch(getAllUsers());
        const contractAllUsers = [];

        if (currentUser?.contracts?.length === 0 || currentUser?.contracts?.length == null) return;

        for (let i = 0; i < currentUser?.contracts?.length; i++) {
            const contract = currentUser?.contracts[i];
            const contractsUsers = allUsers.find(user => user.uid === contract);
            contractAllUsers.push(contractsUsers);
        }
        dispatch(myConvertations(contractAllUsers));

    }, [loginUser, usersDataLoading, newUsers]);

    // match user by serach name
    const matchUsers = convertationUsers.filter(user => user.displayName?.toLowerCase()?.includes(searchText?.toLowerCase()));

    // stylesheet
    const textStyle = {
        mb: 2,
        textAlign: 'center',
        color: 'whitesmoke',
        letterSpacing: 2,
        fontSize: { xs: '0.5rem', md: '1rem', lg: '1.5rem' },
    }

    return (

        <Box sx={{ p: 2, height: 550, overflowY: 'scroll' }}>

            {
                convertationUsers?.length === 0 && !usersDataLoading && <Box sx={{ width: '100%' }}>

                    <Typography variant='h5' sx={textStyle}>
                        Please add people on your contracts
                    </Typography>

                    <Button id="addContactBtn" onClick={addConverationRoute} sx={{ display: { xs: 'none', lg: 'block' } }}>Make friends</Button>

                    <Button onClick={handleDrawerOpen} id="addContactBtn" sx={{ display: { xs: 'block', lg: 'none' } }}>Add People</Button>


                </Box>
            }

            {
                usersDataLoading && convertationUsers.length === 0 && <>
                    {
                        [...new Array(4)].map((ske, index) => <Skeleton key={index} height={90} animation="wave" />)
                    }
                </>
            }

            {
                matchUsers.map((convertionalUser, index) => <CovertationUser
                    key={loginUser._id}
                    convertionalUser={convertionalUser}
                    uid={uid}
                    socket={socket}
                    selectChatBox={selectChatBox}
                    roomId={roomId}
                />
                )
            }
        </Box>
    )
}

export default Covertation;