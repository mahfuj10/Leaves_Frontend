import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Avatar } from '@mui/material';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    bgcolor: 'background.paper',
    boxShadow: 24,
};

export default function ImageModal({ openModal, handleOpenModal, handleCloseModal, image }: any) {


    return (

        <>
            <Modal
                keepMounted
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box sx={style}>

                    <Avatar
                        src={image}
                        sx={{ width: '100%', height: '100%', borderRadius: 0 }}
                        alt="sender image"
                    />

                </Box>
            </Modal>

        </>
    );
}
