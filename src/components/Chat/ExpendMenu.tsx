import React from 'react'
import { Box, IconButton } from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import DeleteIcon from '@mui/icons-material/Delete';
import Menu from '@mui/material/Menu';
import Drawer from '@mui/material/Drawer';
import MenuItem from '@mui/material/MenuItem';
import CloseIcon from '@mui/icons-material/Close';
import { useAppDispatch, useAppSelector } from '../Redux/hooks';
import { closeOpenDetailsSection, deleteAllRoomMessage, setOpenDetailsSection } from '../Redux/counterSlice';
import UserDetails from '../UserDetails/UserDetails';
import '../../App.css';
import GroupDetails from '../GroupDetails/GroupDetails';

const drawerWidth = { xs: '100%', sm: '60%', md: 350 };


export const ExpendMenu = ({ roomId, group, openSidebar }: any) => {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const { openDetailsSection, selectedUser } = useAppSelector(state => state?.data);
    // const theme = useTheme();
    const [openDrawer, setOpenDrawer] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpenDrawer(true);
    };

    const handleDrawerClose = () => {
        setOpenDrawer(false);
    };

    const dispatch = useAppDispatch();

    const handleClick = (event: React.MouseEvent<any>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const deleteMessages = () => {
        dispatch(deleteAllRoomMessage(roomId));
    };

    const handleOpenDetailsDrawer = () => {
        dispatch(setOpenDetailsSection());
        localStorage.setItem('openDrawer', 'true');
    };

    const handleCloseDetailsDrawer = () => {
        dispatch(closeOpenDetailsSection());
        localStorage.setItem('openDrawer', 'false');
    };



    // stylesheet
    const iconsStyle = {
        fontSize: 16,
        color: "#fff"
    };

    const iconButton = {
        mr: 7,
        background: "#5C4F81",
    };

    return (

        <>
            {
                !group && <IconButton sx={iconButton}>
                    <MoreHorizIcon
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        sx={iconsStyle}
                    />
                </IconButton>

            }

            <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerOpen}
                sx={{
                    ...(open && { display: 'none' }),
                    display: { lg: "none" },
                    color: "#fff",
                    background: "#5C4F81",
                }}
            >
                <AspectRatioIcon
                    sx={iconsStyle}
                />
            </IconButton>

            <Drawer
                onClose={handleDrawerClose}
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
                anchor="right"
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
                    openSidebar !== 11 && <UserDetails user={selectedUser} />
                }

                {
                    openSidebar === 11 && <GroupDetails />
                }


            </Drawer>

            {
                openDetailsSection ?
                    <IconButton
                        id="expand_icon"
                        onKeyPress={(event) => {
                            event.key === "f" && dispatch(setOpenDetailsSection());
                        }}
                        onClick={handleOpenDetailsDrawer}
                        sx={iconButton}
                    >
                        <AspectRatioIcon
                            sx={iconsStyle}
                        />
                    </IconButton>
                    :
                    <IconButton
                        id="expand_icon"
                        onKeyPress={(event) => {
                            event.key === "f" && dispatch(closeOpenDetailsSection());
                        }}
                        onClick={handleCloseDetailsDrawer}
                        sx={{
                            mr: 7,
                            background: "#5C4F81",
                        }}
                    >
                        <AspectRatioIcon
                            sx={iconsStyle}
                        />
                    </IconButton>
            }

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                sx={{
                    "& .MuiPaper-root": {
                        backgroundColor: "#5C4F81",
                        color: "#fff",

                    }
                }}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >

                <MenuItem sx={{
                    letterSpacing: 1,
                    fontSize: 14
                }}
                    onClick={deleteMessages}
                >
                    <DeleteIcon
                        sx={{
                            fontSize: 16,
                            mr: 0.5
                        }}
                    />
                    DELETE ALL DATA
                </MenuItem>

            </Menu>
        </>

    )
}