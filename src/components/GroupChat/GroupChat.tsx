import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../Redux/hooks';
import { Box, IconButton, CircularProgress, Avatar, Typography, ListItem } from '@mui/material';
import { IoMdSend } from 'react-icons/io';
import ScrollToBottom from "react-scroll-to-bottom";
import { MdCameraAlt } from 'react-icons/md';
import { useForm } from 'react-hook-form';
import { FacebookCircularProgress } from '../Loader/Loader';
import Message from '../Message/Message';
import { getGroupChat } from '../Redux/counterSlice';
import { ExpendMenu } from '../Chat/ExpendMenu';
import UserTypeing from '../UserTypeing/UserTypeing';

type Props = {
    groupId: any,
    socket: any,
    openSidebar: number
}

export const GroupChat = (props: Props) => {

    const { groupId, socket, openSidebar } = props;
    const { loginUser, selectedGroup, deleteTextLoading, allMessageDeleteLoading } = useAppSelector(state => state.data);
    const [currentMessage, setCurrentMessage] = useState<any>('');
    const [photoUrl, setPhotoUrl] = useState<string>('');
    const [imgLoading, setImgLoading] = useState<Boolean>(false);
    const { register, watch, setValue } = useForm();
    const [messageList, setMessageList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [typeingUser, setTypeingUser] = useState<any[]>([]);
    const dispatch = useAppDispatch();
    const chatWidth = useRef<any>();

    useEffect(() => {
        // setLoading(true);
        axios.get(`https://enigmatic-garden-12643.herokuapp.com/group/groupchat/${selectedGroup.groupId}`)
            .then(res => {
                setLoading(false);
                dispatch(getGroupChat(res.data));
                setMessageList(res.data);
            });
    }, [groupId, selectedGroup, allMessageDeleteLoading, messageList])


    // message data
    const senderMessageData = async () => {
        const messageData = {
            message: currentMessage,
            image: loginUser.photoURL,
            userId: loginUser.uid,
            picture: photoUrl,
            time: Date.now(),
            roomId: groupId,
            groupId: selectedGroup.groupId,

        };
        try {
            await socket.current.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            await axios.post(`https://enigmatic-garden-12643.herokuapp.com/chat`, messageData);
            setPhotoUrl('');
        } catch (err) {
            console.error(err)
        }

        setPhotoUrl('');
        setCurrentMessage("");
    };

    // send message another people 
    const sendMessage = async () => {
        if (photoUrl !== '' && currentMessage === '') {
            senderMessageData();
        };
        if (currentMessage !== "" && photoUrl === '') {
            senderMessageData();
        };
        if (currentMessage !== "" && photoUrl !== '') {
            senderMessageData();
        };
    };


    //image uploading
    useEffect(() => {
        const imgFile = watch('picFile');
        if (imgFile?.length) {
            let body = new FormData();
            body.set('key', '752d2bbd9a2e4d6a5910df9c191e1643')
            body.append('image', imgFile[0])
            setImgLoading(true);
            axios({
                method: 'post',
                url: 'https://api.imgbb.com/1/upload',
                data: body
            }).then(res => {
                setPhotoUrl(res.data.data.url);
                setValue('pic', res.data.data.url);
            }).finally(() => setImgLoading(false))
        }
        else {
        }

    }, [watch('picFile')]);

    useEffect(() => {
        socket.current?.on("recive_message", (data: any) => {
            setMessageList([...messageList, data]);
            // const upcomeingMessages: any[] = [...messageList, data];
            setTypeingUser([]);
            // setMessageList((list) => [...list, data]);
        })
    }, [messageList, socket?.current, selectedGroup])

    // user typeing message function
    const userData = { name: loginUser.displayName, photo: loginUser.photoURL, roomId: groupId, uid: loginUser.uid }

    const userTypeing = async () => {
        try {
            await socket?.current.emit('typing', userData);
        } catch (err: any) {
            console.log(err.message);
        }
    };



    useEffect(() => {
        document?.getElementById("message_field")?.addEventListener('focusout', () => {
            socket?.current.emit('typing', {});
        })
        socket?.current?.on('typing', function (data: any) {
            setTypeingUser([...typeingUser, data]);
        });
        socket?.current?.on("deleteMessage", function (data: any) {
            const filterMessages = messageList?.filter(message => message._id !== data._id);
            setMessageList(filterMessages);
        });
        if (currentMessage === '') {
            socket?.current?.emit('typing', {});
        }
    }, [socket, messageList])


    // stylesheet
    const textArea = {
        width: chatWidth.current?.scrollWidth,
        height: 60,
        background: "#4E426D",
        borderRadius: 10,
        marginBottom: 5,
        color: 'white'
    };

    const chatHeader = {
        boxShadow: 0,
        width: "100%",
        background: "#4E426D",
        ml: { xs: 0, md: 4 },
        mt: { xs: 0, md: 4 },
        mb: 0,
        p: 1.3,
        display: { xs: 'block', md: 'flex' },
        justifyContent: 'space-between'
    };


    return (

        <Box sx={{ height: window.screen.height }}>
            <Box sx={chatHeader}>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar alt="coverimage" src={selectedGroup?.coverPhoto} />
                    <span>
                        <Typography sx={{ fontSize: 15, color: "#fff" }} variant="h6">{selectedGroup?.groupName}</Typography>
                        <small style={{ color: "#ddd6d6" }}>...</small>
                    </span>
                </Box>


                <Box sx={{ mt: 0.5 }}>
                    <ExpendMenu
                        openSidebar={openSidebar}
                        group={true}
                    />
                </Box>


            </Box>


            {/* messages  */}

            <Box sx={{ p: 4, height: { xs: '70%', md: '70%', lg: "70%" } }}>

                {
                    loading && <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%'
                    }}>
                        <FacebookCircularProgress />
                    </Box>
                }



                {
                    messageList?.length === 0 && !loading && <Box sx={{ mt: 5 }}>

                        <Avatar alt="userimage" sx={{ height: 80, width: 80, m: '0 auto' }} src={selectedGroup.coverPhoto} />

                        <Typography sx={{ textAlign: 'center', color: 'whitesmoke' }} variant="h6">{selectedGroup.groupName}</Typography>

                    </Box>
                }


                <Box ref={chatWidth} sx={{ height: '100%', overflowY: 'scroll' }}>
                    {
                        !loading && <ScrollToBottom>
                            {
                                messageList.map((messageContent) => <Message
                                    messageContent={messageContent}
                                    user={loginUser}
                                    key={messageContent._id}
                                />)
                            }
                        </ScrollToBottom>
                    }

                </Box>

            </Box>



            {/* typeing user */}
            <Box>
                {
                    typeingUser?.map((user: any) => <Box key={user._id}>
                        {
                            user?.name && groupId === user?.roomId && <Box id="typeing_user">

                                <ListItem id="list_item">

                                    <Avatar sx={{ width: 18, height: 18 }} src={user?.photo} alt={user?.name} />

                                    <Typography sx={{ color: '#fff' }} variant='caption'>{user?.name} is typing...</Typography>

                                </ListItem>

                            </Box>
                        }
                    </Box>)
                }
            </Box>


            {/* send message section */}
            {!loading &&

                <Box sx={{ px: 4, pb: 1 }} id="bottom_nav">

                    {
                        photoUrl !== '' &&
                        <Box sx={{ position: 'absolute', bottom: 140 }}>
                            <Avatar sx={{ width: 150, height: 100, borderRadius: 2, boxShadow: 2 }} alt="yourselectpicture" src={photoUrl} />
                        </Box>
                    }

                    <textarea
                        onKeyPress={userTypeing}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        placeholder='Enter a Message'
                        value={currentMessage}
                        id="message_field"
                        style={textArea}
                    />
                    <br />

                    <Box sx={{ mt: 0, float: "right" }}>

                        <label htmlFor="icon-button-file">

                            {/* <label htmlFor="files" ></label> */}
                            <input
                                style={{ display: 'none' }}
                                id="icon-button-file"
                                accept='image/*'
                                {...register("picFile")}
                                type="file"
                            />

                            <IconButton sx={{ background: "#4E426D", color: "#fff", fontSize: 18 }} aria-label="upload picture" component="span">
                                <MdCameraAlt />
                            </IconButton>
                        </label>
                        {
                            !imgLoading ?
                                <IconButton onClick={sendMessage} sx={{ background: "#4E426D", color: "#fff", fontSize: 14, ml: 3, '&:hover': { background: "#4E426D" } }} >
                                    <IoMdSend />
                                </IconButton>
                                :
                                <IconButton sx={{ background: "#4E426D", color: "#fff", ml: 3, '&:hover': { background: "#4E426D" } }} >
                                    <CircularProgress size={14} sx={{ color: "#fff" }} />
                                </IconButton>

                        }
                    </Box>

                </Box>

            }
        </Box>
    )
}