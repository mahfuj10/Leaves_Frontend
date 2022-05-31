import React, { useState } from 'react';
import { Avatar, Box, CircularProgress, IconButton, Typography } from '@mui/material';
import { format } from 'timeago.js';
import ImageModal from '../ImageModal/ImageModal';
import { AiOutlineDelete } from 'react-icons/ai';
import { useAppDispatch, useAppSelector } from '../Redux/hooks';
import { deleteChatMessage } from '../Redux/counterSlice';
import { GoCircleSlash } from 'react-icons/go';
import '../../App.css';

const Message = ({ messageContent, user, textLoading, socket, roomId, deletedMessage }: any) => {


    // image modal open function
    const [openModal, setOpenModal] = React.useState<boolean>(false);
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);
    const disptach = useAppDispatch();
    const { deleteTextLoading } = useAppSelector(state => state.data);
    const [selectedMessage, setSelecteMessage] = useState<any>({});


    // handleDleteMessage
    const handleDleteMessage = (message: any) => {
        disptach(deleteChatMessage(messageContent?._id));
        const data = { ...message, roomId };
        socket?.current?.emit("deleteMessage", data);
    };

    // stylesheet
    const loader = {
        background: "#4E426D",
        color: "#fff",
        ml: 3,
        '&:hover': { background: "#4E426D" }
    }



    return (

        <>


            {
                messageContent?.deleted ?
                    <Box sx={{ display: 'grid', justifyContent: messageContent.userId === user.uid ? 'flex-end' : 'flex-start' }}>
                        <Typography
                            className='message_text'
                            sx={{
                                background: "#4E426D",
                                p: 1.5,
                                color: "#ddd6d6",
                                borderRadius: 2,
                                mb: 2,
                            }}
                            variant='body2'
                        >
                            <GoCircleSlash /> This message was deleted
                        </Typography>

                    </Box>
                    :
                    <Box
                        id={messageContent.userId === user.uid ? "myMessage" : "yourMessage"}
                        key={messageContent._id}
                        sx={{ mb: 2 }}
                    >



                        {/* delete text button */}
                        {
                            messageContent.userId === user.uid &&
                            <IconButton
                                onClick={() => {
                                    handleDleteMessage(messageContent);
                                    setSelecteMessage(messageContent);
                                }}
                                className='delete_button'
                            >
                                <AiOutlineDelete style={{ fontSize: 16 }} />
                            </IconButton>

                        }

                        {/* {
                            messageContent.userId === user.uid && messageContent._id === selectedMessage._id && deleteTextLoading &&
                            <IconButton className='delete_button' sx={loader}>
                                <CircularProgress size={14} sx={{ color: "#fff" }} />
                            </IconButton>
                        } */}

                        {
                            messageContent.userId !== user.uid &&
                            <Avatar
                                sx={{ width: 25, height: 25, objectFit: "cover", mt: 3, mr: 0.5, background: "#fff" }}
                                src={messageContent?.image}
                                alt="senderImage"
                            />
                        }


                        <span>

                            {
                                messageContent.picture && <>

                                    <Avatar
                                        onClick={handleOpenModal}
                                        sx={{ width: { xs: 120, md: 200 }, height: { xs: 100, md: 150 }, borderRadius: 2, boxShadow: 3, mb: 1 }}
                                        src={messageContent?.picture}
                                        alt="sendpicture"
                                    />

                                </>
                            }

                            {
                                messageContent.message !== '' &&

                                <Typography
                                    className='message_text'
                                    sx={{
                                        background: "#4E426D",
                                        p: 1.5,
                                        color: "whitesmoke",
                                        lineHeight: 1.5,
                                        borderRadius: 2
                                    }}
                                    variant='body2'
                                >
                                    {messageContent.message}
                                </Typography>
                            }


                            <Typography variant='caption' sx={{ fontSize: 10, color: "#e5dada" }}>
                                {format(messageContent.time)}
                            </Typography>

                        </span>


                    </Box>
            }
            <ImageModal
                image={messageContent.picture}
                openModal={openModal}
                handleOpenModal={handleOpenModal}
                handleCloseModal={handleCloseModal}
            />

        </>

    )
}

export default Message;