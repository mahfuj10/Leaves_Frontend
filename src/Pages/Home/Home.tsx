import { Avatar, Box, Fade, Grid, IconButton, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { BiConversation } from 'react-icons/bi';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import DeleteIcon from '@mui/icons-material/Delete';
import Menu from '@mui/material/Menu';
import Drawer from '@mui/material/Drawer';
import MenuItem from '@mui/material/MenuItem';
import CloseIcon from '@mui/icons-material/Close';
import { IoPersonAddOutline } from 'react-icons/io5';
import { MdOutlineGroupAdd } from 'react-icons/md';
import { FiMail, FiSettings } from 'react-icons/fi';
import Covertation from '../../components/Convertation/Convertation';
import Chat from '../../components/Chat/Chat';
import io from 'socket.io-client';
import { useAppDispatch, useAppSelector } from '../../components/Redux/hooks';
import { getAllMessages, saveSearchName, selectUser } from '../../components/Redux/counterSlice';
import UserDetails from '../../components/UserDetails/UserDetails';
import AddContracts from '../../components/AddContracts/AddContracts';
import { useNavigate } from 'react-router-dom';
import Groups from '../../components/Groups/Groups';
import { GroupChat } from '../../components/GroupChat/GroupChat';
import { useFirebase } from '../../components/hooks/useFirebase';
import GroupDetails from '../../components/GroupDetails/GroupDetails';
import '../../App.css';
import { Navigation } from '../../components/Navigation/Navigation';
import UserSetting from '../UserSetting/UserSetting';

const drawerWidth = { xs: '80%', sm: '60%', md: 350 };

function Home() {

    const { convertationUsers, joinedGroups, selectedUser, loginUser, openDetailsSection, usersDataLoading } = useAppSelector(state => state.data);
    const drawerCondition = localStorage.getItem('openDrawer');
    const dispatch = useAppDispatch();
    const [activeNum, setActiveNum] = useState<Number>(1);
    const socketClient = useRef<SocketIOClient.Socket>();
    const [groupId, setGroupId] = useState<Number>(0);
    const [roomId, setRoomId] = useState<any>();
    const [openSidebar, setOpenSidebar] = useState<any>(1);
    const navigate = useNavigate();
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);


    const handleDrawerOpen = () => {
        setOpenDrawer(true);
        setOpenSidebar(10);
    };

    const handleDrawerClose = () => {
        setOpenDrawer(false);
    };


    // connect io connect server
    useEffect(() => {
        socketClient.current = io.connect("https://enigmatic-garden-12643.herokuapp.com");
        socketClient.current.removeAllListeners();
    }, []);



    // set inital user
    if (Object?.keys(selectedUser).length === 0) {
        for (const converUser of convertationUsers) {
            dispatch(selectUser(converUser))
        }
    };


    let socket: any = socketClient;


    useEffect(() => {
        if (activeNum === 3) {
            return;
        }
        else {
            const id = parseFloat(loginUser.createdAt) + parseFloat(selectedUser.createdAt);
            if (isNaN(roomId) === true) {
                setRoomId(id);
            } else {
                setRoomId(id);
                dispatch(getAllMessages(id));
                if (id === roomId) {
                    socket.current.emit('join_room', roomId);
                }
            }
        }
    }, [selectedUser, roomId]);


    // handle add group roomId
    const handleAddRoomId = (id: number) => {
        setGroupId(id);
    };


    // add convertation user route
    const addConverationRoute = () => {
        setActiveNum(2);
    };

    const handleSetActiveNav = () => {
        handleDrawerOpen();
        setOpenSidebar(11)
    }

    const selectChatBox = () => {
        setActiveNum(1);
        setOpenSidebar(10)
    };

    // StyleSheet
    const iconsContainer = {
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between ',
        mt: 1,
        mb: 4,
        background: "#5C4F81",
    };



    return (

        <>


            {/* drawer */}
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        background: '#4E426D'
                    },
                    display: { xs: 'block', lg: 'none' }
                }}
                variant="persistent"
                anchor="left"
                open={openDrawer}
            >
                <CloseIcon
                    onClick={handleDrawerClose}
                    sx={{
                        mt: 3,
                        color: "#fff",
                        ml: 1
                    }}
                />

                {
                    openSidebar === 10 && <AddContracts
                        socket={socketClient}
                    />
                }



                {
                    openSidebar === 11 && <Groups
                        socket={socketClient}
                        handleAddRoomId={handleAddRoomId}
                    />
                }

            </Drawer>


            <Grid container id="home">

                <Grid item xs={3} md={4} lg={3} xl={2.5} id="sidebar">

                    <Navigation />


                    <Box sx={{ px: 2, pb: 1 }}>

                        <input
                            onChange={e => dispatch(saveSearchName(e.target.value))}
                            placeholder='Search People for Messages'
                            className='search_input'
                            type="search"
                        />
                    </Box>

                    <Box sx={iconsContainer}>


                        <span
                            onClick={() => {
                                setActiveNum(1);
                                setOpenSidebar(10)
                            }}
                            className={activeNum === 1 ? 'page_active' : 'top_nav'}
                        >
                            <BiConversation />
                        </span>

                        <span
                            id="mobile_icon"
                            onClick={handleDrawerOpen}
                            className='top_nav'
                        >
                            <IoPersonAddOutline />
                        </span>

                        <span
                            id="mobile_icon"
                            onClick={handleSetActiveNav}
                            className='top_nav'
                        >
                            <MdOutlineGroupAdd />
                        </span>


                        <span
                            id="visible_icon"
                            onClick={() => setActiveNum(2)}
                            className={activeNum === 2 ? 'page_active' : 'top_nav'}
                        >
                            <IoPersonAddOutline />
                        </span>

                        <span
                            id="visible_icon"
                            onClick={() => setActiveNum(3)}
                            className={activeNum === 3 ? 'page_active' : 'top_nav'}
                        >
                            <MdOutlineGroupAdd />
                        </span>

                        <span className="top_nav">
                            <FiSettings onClick={() => navigate(`/setting/${loginUser.uid}`)} />
                            {/* <FiSettings  /> */}
                        </span>



                    </Box>

                    {/* convettation components */}
                    {
                        activeNum === 1 && <Covertation
                            selectChatBox={selectChatBox}
                            handleDrawerOpen={handleDrawerOpen}
                            addConverationRoute={addConverationRoute}
                            socket={socketClient}
                            roomId={roomId}
                            uid={selectedUser?.uid}
                        />
                    }

                    {/* add contracts route */}
                    {
                        activeNum === 2 && <AddContracts
                            socket={socketClient}
                        />
                    }

                    {/* groups route */}
                    {
                        activeNum === 3 && <Groups
                            socket={socketClient}
                            handleAddRoomId={handleAddRoomId}
                        />
                    }


                </Grid>

                {
                    convertationUsers?.length === 0 && activeNum !== 3 &&

                    <Grid item xs={9} md={8} lg={9} xl={9.5} sx={{ backgroundColor: "#5C4F81", width: '100%', transition: '1s', height: '100vh' }}>

                        {
                            !usersDataLoading &&
                            <Typography id="emtyContactText" variant='h5'>Your contact is emty to chat other people please add people in your contact. Happy chating !</Typography>
                        }


                    </Grid>

                }

                {
                    joinedGroups?.length === 0 && activeNum === 3 && !usersDataLoading &&

                    <Grid item xs={9} md={8} lg={9} xl={9.5} sx={{ backgroundColor: "#5C4F81", width: '100%', transition: '1s', height: '100vh' }}>

                        {
                            !usersDataLoading &&
                            <Typography id="emtyContactText" variant='h5'>You've not joined any group yet. Create a group or wait for anyone to join any group.</Typography>
                        }

                    </Grid>

                }
                {
                    convertationUsers?.length === 0 && joinedGroups.length !== 0 && !usersDataLoading &&

                    <Grid item xs={9} md={8} lg={openDetailsSection ? 6 : 9} xl={!openDetailsSection ? 9.5 : 7} sx={{ backgroundColor: "#5C4F81", width: '100%', transition: '1s' }}>

                        {
                            activeNum === 3 && <GroupChat
                                groupId={groupId}
                                socket={socketClient}
                                openSidebar={openSidebar}
                            />
                        }

                    </Grid>
                }

                {
                    convertationUsers?.length > 0 &&

                    <Grid item xs={9} md={8} lg={openDetailsSection ? 6 : 9} xl={!openDetailsSection ? 9.5 : 7} sx={{ backgroundColor: "#5C4F81", width: '100%', transition: '1s' }}>




                        {activeNum !== 3 && openSidebar !== 11 && <Chat
                            socket={socketClient}
                            selectedUser={selectedUser}
                            roomId={roomId}
                        />}

                        {
                            activeNum === 3 && <GroupChat
                                groupId={groupId}
                                socket={socketClient}
                                openSidebar={openSidebar}
                            />
                        }


                        {
                            openSidebar === 11 && <GroupChat
                                groupId={groupId}
                                socket={socketClient}
                                openSidebar={openSidebar}
                            />
                        }



                    </Grid>

                }

                {
                    openDetailsSection && convertationUsers.length > 0 && !usersDataLoading && <Fade in={openDetailsSection}>

                        <Grid item md={3} xs={6} lg={3} xl={2.5} sx={{ background: "#4E426D", display: { xs: 'none', lg: 'block' } }}>

                            {activeNum !== 3 && <UserDetails user={selectedUser} />}

                            {activeNum === 3 && <GroupDetails />}

                        </Grid>
                    </Fade>
                }

                {
                    convertationUsers?.length === 0 && joinedGroups.length !== 0 && !usersDataLoading && <Fade in={openDetailsSection}>

                        <Grid item md={3} xs={6} lg={3} xl={2.5} sx={{ background: "#4E426D", display: { xs: 'none', lg: 'block' } }}>

                            {activeNum === 3 && <GroupDetails />}

                        </Grid>
                    </Fade>
                }


            </Grid >

        </>
    )
}

export default Home