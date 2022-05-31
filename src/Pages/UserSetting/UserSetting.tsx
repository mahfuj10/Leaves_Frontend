import { Alert, Avatar, Box, Button, Container, Grid, IconButton, Input, Skeleton, Tab, Tabs, Typography } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import ContractInfo from '../../components/Setting/ContractInfo';
import { JoinedGroups } from '../../components/Setting/JoinedGroups';
import MyContacts from '../../components/Setting/MyContacts';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useAppDispatch, useAppSelector } from '../../components/Redux/hooks';
import { currentLoginUser, gellAllGroups, getJoinedGroups, myConvertations } from '../../components/Redux/counterSlice';
import { useFirebase } from '../../components/hooks/useFirebase';
import { toast, ToastContainer } from 'react-toastify';
import { styled } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import EditIcon from '@mui/icons-material/Edit';
import '../../App.css';
import 'react-toastify/dist/ReactToastify.css';




const style = {
    position: 'absolute' as 'absolute',
    top: '15%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#5C4F81',
    boxShadow: 24,
    p: 3,
};

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}


export default function UserSetting() {

    const [matchUser, setUser] = useState<any>({});
    const [value, setValue] = React.useState<any>(0);
    const groups: any[] = [];
    const { userId } = useParams();
    const { register, watch, } = useForm();
    const [loading, setLoading] = useState<boolean>(true);
    const { user, updatePhotoAndName } = useFirebase();
    const [imgLoading, setImgLoading] = useState<boolean>(false);
    const [photoUrl, setPhotoUrl] = useState<string>('');
    const { loginUser, allUsers, allGroups, groupsDataLoading, updateUserInfo } = useAppSelector(state => state?.data);
    const currentUser = allUsers?.find(user => user?.uid === loginUser?.uid);
    const dispatch = useAppDispatch();
    const [profileUpdateings, setProfileUpdateing] = useState<boolean>(false);
    const [openModal, setOpenModal] = React.useState(false);

    // open and close modal
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => {
        setOpenModal(false);
        setTimeout(() => setPhotoUrl(''), 1000)
    };

    // tab
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    function a11yProps(index: number) {
        return {
            id: `vertical-tab-${index}`,
            'aria-controls': `vertical-tabpanel-${index}`,
        };
    }



    // data load
    useEffect(() => {


        // dispatch(getAllUsers());
        const contractAllUsers = [];

        if (currentUser?.contracts?.length === 0 || currentUser?.contracts?.length == null) return;

        for (let i = 0; i < currentUser?.contracts?.length; i++) {
            const contract = currentUser?.contracts[i];
            const contractsUsers = allUsers.find(user => user.uid === contract);
            contractAllUsers.push(contractsUsers);
        }
        dispatch(myConvertations(contractAllUsers));

    }, [loginUser]);


    // load joind groups
    useEffect(() => {
        const createdDate: any = { createdAt: user?.metadata?.createdAt }
        const userData: object = { photoURL: user.photoURL, displayName: user.displayName, uid: user.uid, createdAt: createdDate?.createdAt, email: user.email, phone: null, adress: null, contracts: [], groups: [], profession: null };
        dispatch(currentLoginUser(userData));
        dispatch(gellAllGroups());

        if (!currentUser?.groups) return;

        for (let groupID of currentUser?.groups) {
            const matchGroup = allGroups?.find(group => group.groupId === groupID);
            groups.push(matchGroup);
        };



        dispatch(getJoinedGroups(groups));
    }, [allGroups]);


    // load user
    useEffect(() => {
        axios.get(`https://enigmatic-garden-12643.herokuapp.com/users/singleuser/${userId}`)
            .then(res => {
                setUser(res.data);
                setLoading(false);
            });

    }, [profileUpdateings, updateUserInfo]);





    //image uploading
    useEffect(() => {
        const imgFile = watch('picFile');
        if (!imgFile?.length) return;
        setImgLoading(true);
        let body = new FormData();
        body.set('key', '752d2bbd9a2e4d6a5910df9c191e1643')
        body.append('image', imgFile[0])
        axios({
            method: 'post',
            url: 'https://api.imgbb.com/1/upload',
            data: body
        }).then(res => {
            setPhotoUrl(res.data.data.url);
            setImgLoading(false);
            // updatePhotoAndName(loginUser.displayName, res.data.data.url);
        });
    }, [watch('picFile')]);


    // .. update photo 
    const handleUpdateProfile = async () => {

        if (photoUrl === null || photoUrl === '') return;
        if (!matchUser.uid) return;

        setProfileUpdateing(true);

        await axios.put(`https://enigmatic-garden-12643.herokuapp.com/users/updateprofile/${matchUser.uid}`, { photoURL: photoUrl })
            .then(() => {
                updatePhotoAndName(loginUser.displayName, photoUrl);
                setProfileUpdateing(false);
            })
    };


    // stylesheet

    const tabStyle = {
        borderBottom: '1px solid #4E426D',
        fontWeight: 500,
        color: "black"
    };

    const textStyle = {
        textAlign: 'center',
        fontSize: 18,
        letterSpacing: 1,
        mt: 1,
        borderBottom: '3px solid #4E426D',
        pb: 1
    };

    const updateButton = {
        background: '#463A63',
        color: '#fff',
        '&:hover': {
            background: '#463A63',
        },
        mt: -3,
        ml: 7
    };

    const uploadButton = {
        background: '#463A63',
        color: '#fff',
        '&:hover': {
            background: '#463A63',
        },
        width: 100,
        height: 100,
        mb: 2
    };

    const button = {
        borderColor: "whitesmoke",
        display: 'block',
        color: "whitesmoke",
        '&:hover': {
            borderColor: "whitesmoke",
        },
    };


    return (

        <Box id="setting_page">


            {
                loading ?

                    <Typography
                        variant='h6'
                        sx={{
                            p: 3,
                            color: "whitesmoke"
                        }}>
                        Loading...
                    </Typography>

                    :

                    <Container sx={{ pt: 15, color: "#fff" }}>

                        <Grid container>


                            <Grid item xs={12} md={4} lg={3} xl={2.5} sm={4} sx={{ boxShadow: 3, background: "#5C4F81" }}>

                                <span style={{
                                    display: 'grid',
                                    justifyContent: 'center'
                                }}>
                                    <Avatar
                                        src={matchUser?.photoURL}
                                        alt={matchUser?.displayName}
                                        sx={{
                                            width: 90,
                                            height: 90,
                                            mt: 2,
                                        }}
                                    />

                                    <IconButton
                                        sx={updateButton}
                                        onClick={handleOpenModal}
                                        component="span">
                                        <PhotoCamera sx={{ fontSize: 15 }} />
                                    </IconButton>

                                </span>

                                <Typography variant='h6' sx={textStyle}>
                                    {matchUser?.displayName}
                                </Typography>

                                <Tabs
                                    orientation="vertical"
                                    variant="scrollable"
                                    value={value}
                                    onChange={handleChange}
                                    aria-label="Vertical tabs example"
                                    sx={{ mt: 1 }}
                                >
                                    <Tab sx={tabStyle} label="Contract Info" {...a11yProps(0)} />
                                    <Tab sx={tabStyle} label="My Contracts" {...a11yProps(1)} />
                                    <Tab sx={tabStyle} label="joined groups" {...a11yProps(2)} />
                                    <Tab sx={tabStyle} label="Account Setting" {...a11yProps(3)} />

                                    {
                                        updateUserInfo &&
                                        <Typography variant="body2" sx={{ m: 1 }}>Loading...</Typography>
                                    }

                                </Tabs>

                            </Grid>

                            <Grid item xs={12} sm={8} md={8} xl={6} sx={{ boxShadow: 3, background: "#5C4F81" }}>

                                <TabPanel value={value} index={0}>
                                    <ContractInfo
                                        user={matchUser}
                                    />
                                </TabPanel>
                                <TabPanel value={value} index={1}>
                                    <MyContacts />
                                </TabPanel>
                                <TabPanel value={value} index={2}>
                                    <JoinedGroups />
                                </TabPanel>
                                <TabPanel value={value} index={3}>
                                    Item Four
                                </TabPanel>


                            </Grid>

                        </Grid>


                    </Container>

            }

            <Modal
                open={openModal}
                // onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>

                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>

                        {
                            photoUrl === '' && !imgLoading &&
                            <label htmlFor="icon-button-file">
                                <input
                                    style={{ display: "none" }}
                                    {...register("picFile")}
                                    accept="image/*"
                                    type="file"
                                    id="icon-button-file"
                                />
                                <IconButton
                                    sx={uploadButton}
                                    color="primary"
                                    aria-label="upload picture"
                                    component="span">
                                    <PhotoCamera sx={{ fontSize: 25 }} />
                                </IconButton>
                            </label>
                        }

                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        {
                            imgLoading && photoUrl === '' &&
                            <Skeleton
                                sx={{ mb: 2 }}
                                variant="circular"
                                width={110}
                                height={110}
                            />
                        }
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        {
                            photoUrl !== '' &&
                            <Avatar
                                sx={{ width: 110, height: 110, mb: 2 }}
                                src={photoUrl}
                                alt="yourImage"
                            />

                        }
                    </Box>

                    <Box id="updateButton_container">

                        {
                            profileUpdateings ?
                                <Button
                                    disabled
                                    variant='outlined'
                                    sx={button}
                                >
                                    Loading...
                                </Button>
                                :
                                <Button
                                    onClick={handleUpdateProfile}
                                    variant='outlined'
                                    sx={button}
                                >
                                    UPDATE
                                </Button>

                        }

                        <Button
                            onClick={() => {
                                setPhotoUrl('');
                                setProfileUpdateing(false);
                                setImgLoading(false);
                            }}
                            disabled={profileUpdateings ? true : false}
                            variant='outlined'
                            sx={button}
                        >
                            CANCEL
                        </Button>

                        <Button
                            onClick={handleCloseModal}
                            sx={button}
                            variant='outlined'
                        >
                            CLOSE
                        </Button>

                    </Box>


                </Box>
            </Modal>

        </Box>
    )
}