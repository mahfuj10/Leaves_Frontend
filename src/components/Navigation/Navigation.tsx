import { Avatar, Box, IconButton, Typography } from '@mui/material'
import React from 'react'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { BiMenuAltRight } from 'react-icons/bi';
import { useAppSelector } from '../Redux/hooks';
import { useFirebase } from '../hooks/useFirebase';
import SignalWifiStatusbarConnectedNoInternet4Icon from '@mui/icons-material/SignalWifiStatusbarConnectedNoInternet4';

export const Navigation = () => {

    const { loginUser } = useAppSelector(state => state.data);
    const { logOut } = useFirebase();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // style sheet
    const menuList = {
        display: 'flex',
        justifyContent: 'center'
    };

    const disconnectBox = {
        display: 'flex',
        alignItems: 'center',
        boxShadow: 2,
        width: 120,
        borderRadius: 5,
        pl: 1,
        color: "white",
        background: 'red',
    };

    return (

        <>

            <Box>

                <IconButton id="basic-button"
                    sx={{ float: 'right', background: "#5C4F81", color: 'white', m: 1 }}
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}>
                    <BiMenuAltRight />
                </IconButton>

                <Box>

                    {
                        !window.navigator.onLine && <Box sx={disconnectBox}>
                            <SignalWifiStatusbarConnectedNoInternet4Icon sx={{ fontSize: 16 }} />
                            <Typography variant='caption'>You're offline</Typography>
                        </Box>
                    }

                </Box>


            </Box>

            <Menu
                sx={{
                    "& .MuiPaper-root": {
                        backgroundColor: "#5C4F81",
                        color: "#fff",

                    }
                }}
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Avatar src={loginUser?.photoURL} alt="" />
                </MenuItem>
                <MenuItem sx={menuList}>{loginUser?.displayName}</MenuItem>
                <MenuItem sx={menuList}>{loginUser?.email}</MenuItem>
                <MenuItem onClick={logOut} sx={menuList} style={{ background: '#463a63' }}>Log out</MenuItem>
            </Menu>

        </>

    )
}