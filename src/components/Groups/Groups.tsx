import React, { useEffect, useState } from 'react';
import { Box, Button, Skeleton, Typography } from '@mui/material';
import GroupsModal from './GroupsModal';
import { useAppDispatch, useAppSelector } from '../Redux/hooks';
import Group from './Group';
import './Groups.css';
import { gellAllGroups, getJoinedGroups, saveCreatedGroup } from '../Redux/counterSlice';

const Groups = ({ socket, handleAddRoomId }: any) => {

    const [open, setOpen] = React.useState<boolean>(false);
    const [myGroups, setMyGroups] = useState<any[]>([]);
    const dispatch = useAppDispatch();
    const { loginUser, allUsers, allGroups, createdGroup, groupsDataLoading } = useAppSelector(state => state?.data);
    const currentUser = allUsers?.find(user => user?.uid === loginUser?.uid);
    const [joinedGroup, setJoingroup] = useState({});
    const groups: any[] = [];

    useEffect(() => {
        if (groupsDataLoading) return;
    }, []);





    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => setOpen(false);

    // handle Reload Group
    const handleReloadGroup = (loading: boolean) => {
        dispatch(gellAllGroups());
    };



    // useEffect(() => {
    //     if (currentUser?.groups?.length === 0) {
    //         return;
    //     }
    // }, [loginUser])

    // match group user
    useEffect(() => {

        if (!currentUser?.groups) return;

        for (let groupID of currentUser?.groups) {
            const matchGroup = allGroups?.find(group => group.groupId === groupID);
            groups.push(matchGroup);
        };

        if (createdGroup?.groupName) {
            groups.push(createdGroup);
        }

        setMyGroups(groups);
        dispatch(getJoinedGroups(groups));
    }, [joinedGroup, allGroups, createdGroup]);



    useEffect(() => {
        socket.current.on('joinedgroup', function (data: any) {
            setJoingroup(data);
            dispatch(gellAllGroups());
            dispatch(saveCreatedGroup(data));
        });
    }, [socket])

    // stylesheet
    const textStyle = {
        mb: 2,
        textAlign: 'center',
        color: 'whitesmoke',
        letterSpacing: 2,
        fontSize: '1.5rem',
    }


    return (

        <>
            {
                myGroups?.length !== 0 && !groupsDataLoading && <Box sx={{ height: 550, overflowY: 'scroll' }}>


                    {
                        myGroups.map((group: any) => <Group
                            key={group?._id}
                            group={group}
                            mygroups={myGroups}
                            socket={socket}
                            handleAddRoomId={handleAddRoomId}
                        />
                        )
                    }


                </Box>
            }

            {
                groupsDataLoading && <Box>

                    {
                        [...new Array(5)].map((ske, index) => <Skeleton
                            sx={{ height: 90 }}
                            key={index}
                        />)
                    }

                </Box>
            }

            {
                !groupsDataLoading && myGroups.length === 0 &&
                <Typography sx={textStyle} variant="h5">
                    You've not joined any group yet.
                </Typography>
            }

            <span style={{ display: 'flex', justifyContent: 'center' }}>
                <button type='button' onClick={handleOpen} className='creatGroupBtn'>CREATE GROUP</button>
            </span>


            <GroupsModal
                socket={socket}
                handleOpen={handleOpen}
                open={open}
                handleReloadGroup={handleReloadGroup}
                handleClose={handleClose}
            />
        </>
    )
}

export default Groups;