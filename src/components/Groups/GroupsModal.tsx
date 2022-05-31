import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import LoadingButton from '@mui/lab/LoadingButton';
import AvatarGroup from '@mui/material/AvatarGroup';
import { Backdrop, Box, Modal, Fade, Button, Typography, TextField, Alert, } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../Redux/hooks';
import { addGroupMembers, removeFromSelectedPeople, reseatGroupMembers, saveCreatedGroup } from '../Redux/counterSlice';
import axios from 'axios';
import { CSSTransition } from 'react-transition-group';
import { userInfo } from 'os';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 430,
    bgcolor: '#5C4F81',
    boxShadow: 24,
    p: 3,
    borderRadius: 2,
    zIndex: 90909090
};



export default function GroupsModal({ socket, handleOpen, open, handleClose, handleReloadGroup }: any) {

    // const classes = useStyles();


    const [activeStep, setActiveStep] = useState(0);
    const [skipped, setSkipped] = useState(new Set<number>());
    const [groupName, setGroupName] = useState<string>('');
    const { allUsers, selectedGroupMembers, loginUser } = useAppSelector(state => state.data);
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState<boolean>(false);


    const isStepSkipped = (step: number) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
    };

    // handleCreateGroup
    const handleCreateGroup = async () => {

        if (groupName === '') {
            return alert('Please give the group name..')
        }
        setLoading(true);

        const groupMembers = [loginUser.uid];
        const groupId = Math.floor(Math.random() * 2029832302300000) + 1;

        const data: object = {
            groupId,
            groupName,
            groupMembers,
            coverPhoto: 'https://i.postimg.cc/t4SCnxv4/ethan-dow-d-Wa-Bk-AWCxs-A-unsplash-1.jpg'
        };

        for (let member of selectedGroupMembers) {
            groupMembers.push(member.uid);
            // console.log(member);
        };





        // socket.current.emit('joinedgroup', { ...data, createdAt: loginUser.createdAt });


        try {
            await axios.post('https://enigmatic-garden-12643.herokuapp.com/group', data).then(res => {
                setLoading(false);
                dispatch(reseatGroupMembers(0));
                handleClose();
                setActiveStep(0);
                // dispatch(saveCreatedGroup(data));
                socket.current.emit('joinedgroup', data);
            });
            for (let member of selectedGroupMembers) {
                await axios.post(`https://enigmatic-garden-12643.herokuapp.com/group/saveinuserdata/${member.uid}`, { groupId });
            };
            // for currernt user
            await axios.post(`https://enigmatic-garden-12643.herokuapp.com/group/saveinuserdata/${loginUser.uid}`, { groupId });
        }
        catch (err: any) {
            console.error(err.message);
        }
    };

    // handle select group member
    const handleSelectMember = (user: object) => {
        dispatch(addGroupMembers(user));
    };

    // hanlde remove member
    const handleRemoveMemver = (uid: string) => {
        dispatch(removeFromSelectedPeople(uid));
    };


    const handleCloseModal = () => {
        handleClose();
        setTimeout(() => {
            dispatch(reseatGroupMembers(0))
            setActiveStep(0);
        }, 1000);
    };


    // stylesheet
    const btnStyle = {
        borderRadius: 2,
        p: 0.5,
        mr: 2,
        borderColor: "#fff",
        color: "#fff",
        '&:hover': {
            borderColor: "#fff"
        }
    }

    const title = {
        fontSize: 17,
        letterSpacing: 1,
        textAlign: 'center',
        mb: 2,
        color: "#fff"
    }

    return (

        <>

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleCloseModal}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={open}>

                    <Box sx={style}>

                        {
                            activeStep === 0 &&

                            <Box>

                                <Typography variant='h6' sx={title}>Create a group</Typography>

                                <input
                                    placeholder='Search people'
                                    id="search_field"
                                    type="text"
                                />


                                <Box sx={{ height: 250, overflowY: 'scroll' }}>

                                    {
                                        allUsers.map((user, index) => loginUser?.uid !== user?.uid && <Box
                                            sx={{
                                                display: 'flex',
                                                gap: 1,
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                mb: 3,
                                                background: "#4E426D",
                                                p: 1,
                                                borderRadius: 3
                                            }}
                                        >

                                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                <Avatar
                                                    src={user.photoURL}
                                                    alt={user.displayName}
                                                />

                                                <Typography sx={{ fontSize: 16, color: "#fff" }} variant='h6'>{user.displayName}</Typography>

                                            </Box>

                                            {
                                                selectedGroupMembers[index]?.uid === user?.uid ?
                                                    <Button sx={btnStyle}
                                                        onClick={() => handleRemoveMemver(user.uid)}
                                                        variant="outlined"
                                                    >
                                                        REMOVE
                                                    </Button>
                                                    :
                                                    <Button onClick={
                                                        () => handleSelectMember(user)}
                                                        sx={btnStyle}
                                                        variant="outlined"
                                                    >
                                                        Add
                                                    </Button>
                                            }
                                        </Box>
                                        )
                                    }


                                </Box>

                            </Box>
                        }

                        {
                            activeStep === 1 && <Box>



                                <Typography
                                    variant='h6'
                                    sx={title}
                                >
                                    Create a group with
                                </Typography>

                                <AvatarGroup max={4} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                    {
                                        selectedGroupMembers.map(member => <Avatar alt={member?.displayName} src={member?.photoURL} />)
                                    }
                                </AvatarGroup>


                                <input
                                    style={{
                                        padding: 17,
                                        width: '90%',
                                        borderRadius: 5
                                    }}
                                    placeholder='Group Name'
                                    id="search_field"
                                    type="text"
                                    onChange={(e: any) => setGroupName(e.target.value)}
                                />

                            </Box>
                        }

                        {
                            selectedGroupMembers.length > 0 && activeStep === 0 && <Button
                                variant='contained'
                                sx={{
                                    width: '100%',
                                    borderRadius: 25,
                                    position: 'relative',
                                    background: "#4E426D",
                                    '&:hover': {
                                        background: "#4E426D"
                                    }
                                }}
                                onClick={handleNext}
                            >
                                NEXT
                            </Button>
                        }

                        {
                            activeStep === 1 && <>
                                {
                                    loading ?
                                        <LoadingButton sx={{
                                            width: '100%',
                                            borderRadius: 25,
                                            position: 'relative'
                                        }}
                                            loading variant="outlined"
                                        >
                                            Submit
                                        </LoadingButton>
                                        :
                                        <Button
                                            variant='contained'
                                            sx={{
                                                width: '100%',
                                                borderRadius: 25,
                                                position: 'relative',
                                                background: "#4E426D",
                                                '&:hover': {
                                                    background: "#4E426D"
                                                }
                                            }}
                                            onClick={handleCreateGroup}
                                        >
                                            CREATE GROUP
                                        </Button>
                                }
                            </>
                        }

                    </Box>
                </Fade>
            </Modal>
        </>
    );
}
