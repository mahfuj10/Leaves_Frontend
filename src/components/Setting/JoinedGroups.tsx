import { Avatar, Box, Button, Pagination, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import ScrollToBottom from "react-scroll-to-bottom";
import { getJoinedGroups } from '../Redux/counterSlice';
import { useAppDispatch, useAppSelector } from '../Redux/hooks'


export const JoinedGroups = () => {


    const groups: any[] = [];
    const { loginUser, allUsers, allGroups, groupsDataLoading, joinedGroups } = useAppSelector(state => state?.data);
    const currentUser = allUsers?.find(user => user?.uid === loginUser?.uid);
    const dispatch = useAppDispatch();



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
                    joinedGroups?.map(group => <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 2,
                        background: '#4E426D',
                        p: 1,
                        borderRadius: 1
                    }}
                        key={group._id}
                    >
                        <Avatar
                            src={group?.coverPhoto}
                            alt={group?.groupName}
                            sx={{ borderRadius: 1 }}
                        />

                        <Typography variant='body1'>{group?.groupName}</Typography>

                        <Button variant='outlined' sx={buttonStyle}>LEAVE</Button>


                    </Box>

                    )
                }
            </ScrollToBottom>

        </Box>

    )
}