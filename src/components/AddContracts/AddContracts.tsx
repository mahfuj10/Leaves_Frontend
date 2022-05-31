import React, { useEffect, useRef, useState } from 'react';
import { Avatar, Box, Button, Skeleton, Typography } from '@mui/material';
import axios from 'axios';
import { useFirebase } from '../hooks/useFirebase';
import { useAppDispatch, useAppSelector } from '../Redux/hooks';
import LoadingButton from '@mui/lab/LoadingButton';
import { TransitionGroup } from 'react-transition-group';
import { getAllUsers } from '../Redux/counterSlice';

const AddContracts = ({ socket }: any) => {

    const { allUsers, usersDataLoading, searchText, loginUser } = useAppSelector(state => state.data);
    const [loading, setLoading] = useState<Boolean>(false);
    const [loadUser, setLoadUser] = useState<Boolean>(false);
    const [selectedUID, setSelectedUID] = useState<any>('');
    // const [isAdd, setIsAdd] = useState<any[]>([]);
    const dispatch = useAppDispatch();

    const currentUser = allUsers.find(current => current.uid === loginUser?.uid);


    // add contact user function
    const addContract = (selectUser: any) => {
        setLoading(true);
        axios.post(`https://enigmatic-garden-12643.herokuapp.com/users/addcontract/${loginUser?.uid}`, { uid: selectUser.uid }).then(res => {
            socket?.current?.emit('addedUser', { userId: loginUser?.uid });
            setLoading(false);
            setLoadUser(true);
            dispatch(getAllUsers());
        });
    };

    const handleAddContract = (user: any) => {
        setSelectedUID(user.uid);
        addContract(user);
    };


    let contactsUsers: any[] = allUsers.filter(user => user?.uid !== currentUser?.uid);


    // match user by serach name
    const matchUsers = contactsUsers.filter(user => user?.displayName?.toLowerCase()?.includes(searchText?.toLowerCase()));


    // stylesheet
    const btnStyle = {
        borderColor: "#fff",
        color: "#fff",
        '&:hover': {
            borderColor: "#fff",
        }
    };

    const box = {
        display: 'flex',
        alignItems: 'center',
        mb: 2,
        p: 1,
        borderRadius: 2,
        justifyContent: 'space-between',
        borderBottom: '2px solid #5C4F81',
        mr: 2
    };

    let isAdd: any;


    return (

        <>

            {
                usersDataLoading && contactsUsers.length === 0 && <Box>
                    {
                        [...new Array(5)].map((ske, index) => <Skeleton
                            sx={{ height: 80 }}
                        />)
                    }

                </Box>
            }

            {
                matchUsers.map((user, index) => <Box
                    key={user._id}
                    sx={box}>

                    <small style={{ display: "none" }}>
                        {
                            isAdd = currentUser?.contracts?.find((contract: any) => contract === user?.uid)
                        }
                    </small>


                    <br />

                    <Avatar
                        alt="user photo"
                        sx={{
                            width: 45,
                            height: 45,

                        }}
                        src={user.photoURL}
                    />

                    <span>


                        <Typography variant='h6' sx={{ fontSize: 16, color: "#fff" }}>
                            {user.displayName}
                        </Typography>

                        <Typography variant='h6' sx={{ fontSize: 11, color: '#9881d6' }}>
                            {user.email}
                        </Typography>

                    </span>

                    {
                        loading && selectedUID === user?.uid ?
                            <LoadingButton loading variant="outlined">
                                Submit
                            </LoadingButton>
                            :
                            <span>
                                {
                                    isAdd !== user?.uid ?
                                        <Button
                                            sx={btnStyle}
                                            variant='outlined'
                                            onClick={() => handleAddContract(user)}>
                                            ADD+
                                        </Button>
                                        :
                                        <Button sx={btnStyle} disabled variant='outlined' >
                                            ADDED
                                        </Button>
                                }


                            </span>
                    }
                </Box>

                )
            }

        </>
    )
}

export default AddContracts;