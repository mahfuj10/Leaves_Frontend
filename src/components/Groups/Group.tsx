import { Avatar, AvatarGroup, Box, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { selectGroup, selectUser } from '../Redux/counterSlice';
import { useAppDispatch, useAppSelector } from '../Redux/hooks';
// groupId: number,
// groupMembers: string[],
//     _id: string,
//         groupName: string,
type Props = {

    group: any
}

function Group({ group, handleAddRoomId, socket, mygroups }: any) {




    const members: any[] = [];
    const { groupName, groupId, coverPhoto } = group;
    const { allUsers, allGroups, selectedGroup } = useAppSelector(state => state.data);
    const dispatch = useAppDispatch();

    // get group my user id
    for (const userID of group?.groupMembers) {
        let groupMember = allUsers.find((user: any) => user.uid === userID)
        members.push(groupMember);
    };


    // set iniitial group
    if (Object?.keys(selectedGroup)?.length === 0) {
        dispatch(selectGroup(mygroups[0]));
    };

    let roomID: any = 0;

    const handleSelectGroup = () => {

        dispatch(selectGroup(group));

        for (let i = 0; i < members.length; i++) {
            const member = members[i];
            const createdAt = member?.createdAt
            roomID += parseFloat(createdAt);
        }

        handleAddRoomId(roomID);
        socket.current.emit('join_room', roomID);
    };



    return (

        <>
            {
                groupName && <Box
                    sx={{
                        display: 'flex',
                        gap: 1.5,
                        mb: 2,
                        p: 1,
                        background: group.groupId === selectedGroup?.groupId ? '#5C4F81' : '',
                        borderBottom: '2px solid #5C4F81'

                    }}
                    onClick={handleSelectGroup}

                >

                    <Avatar src={coverPhoto} alt={groupName} sx={{ borderRadius: 1, width: 50, height: 50, my: 0.3 }} />

                    <Box>

                        <Typography variant='h6' sx={{ fontSize: 17, letterSpacing: 1, color: 'whitesmoke' }}>{groupName}</Typography>

                        <AvatarGroup className='avatar_container' max={5} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {
                                members.map(member => <Avatar
                                    sx={{
                                        width: 17,
                                        height: 17
                                    }}
                                    key={member._id}
                                    alt={member?.displayName}
                                    src={member?.photoURL}
                                />
                                )
                            }
                        </AvatarGroup>

                    </Box>

                </Box>
            }
        </>

    )
}

export default Group;