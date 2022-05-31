import { Avatar, Box, ListItem, Typography } from '@mui/material'
import React from 'react'
import { useAppSelector } from '../Redux/hooks';


export default function UserTypeing({ typeingUser, roomId }: any) {

    const { loginUser } = useAppSelector(state => state.data);

    return (

        <>
            <Box>
                {
                    typeingUser?.name && typeingUser?.uid !== loginUser.uid && roomId === typeingUser?.roomId &&

                    <Box id="typeing_user">

                        <ListItem id="list_item">

                            <Avatar sx={{ width: 18, height: 18 }} src={typeingUser?.photo} alt={typeingUser?.name} />

                            <Typography sx={{ color: '#fff' }} variant='caption'>{typeingUser?.name} is typeing...</Typography>

                        </ListItem>

                    </Box>
                }
            </Box>

        </>
    )
}