import React, { useEffect, useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Avatar, Box, Paper, Typography } from '@mui/material';
import { HiOutlineArrowSmDown } from 'react-icons/hi';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { ExpandLessIcon } from '@mui/icons-material';
import { useAppSelector } from '../Redux/hooks';

type Props = {}

const GroupDetails = (props: Props) => {

    const { selectedGroup, allUsers, groupChat } = useAppSelector(state => state.data);
    const [groupMembers, setGroupMembers] = useState<any[]>([]);
    const images = groupChat.filter(image => image.picture);


    // get  all group members
    useEffect(() => {
        const members = [];
        for (let i = 0; i < selectedGroup?.groupMembers?.length; i++) {
            const member = selectedGroup?.groupMembers[i];
            const matchMember = allUsers.find(user => user.uid === member);
            members.push(matchMember);
        };
        setGroupMembers(members);
    }, [selectedGroup]);


    // stylesheet
    const groupPerson = {
        mb: 2,
        pb: 0.5,
        display: 'flex',
        gap: 4,
        p: 1,
        alignItems: 'center',
        background: "#5C4F81",
        borderRadius: 2
    };

    const textStyle = {
        fontSize: 15,
        letterSpacing: 1,
        fontWeight: 'bold',
        mt: 1.5,
        color: 'whitesmoke'
    };

    const groupTitle = {
        mt: 1,
        fontWeight: 'bold',
        letterSpacing: 1,
        textAlign: 'center',
        color: '#fff'
    }


    return (

        <Paper elevation={3} sx={{ p: 3, borderRadius: 0, background: "#4E426D", boxShadow: 0 }}>

            <Avatar
                src={selectedGroup?.coverPhoto}
                alt="groupImage"
                sx={{
                    width: 150,
                    height: 100,
                    borderRadius: 2,
                    m: '0 auto',
                    boxShadow: 1
                }}
            />

            <Typography variant='h6' sx={groupTitle}>{selectedGroup?.groupName}</Typography>

            <Accordion sx={{ mt: 2, background: "#4E426D" }}>

                <AccordionSummary
                    expandIcon={<HiOutlineArrowSmDown style={{ color: "whitesmoke" }} />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography sx={{ color: "#fff" }}>Group Members</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {
                        groupMembers?.map(member => <Box
                            key={member._id}
                            sx={groupPerson}
                        >
                            <Avatar
                                src={member?.photoURL}
                                alt={member?.displayName}
                                sx={{ border: '1px solid #4E426D' }}
                            />

                            <Typography
                                variant='body2'
                                sx={{ fontSize: 17, color: "whitesmoke" }}
                            >
                                {member?.displayName}
                            </Typography>

                        </Box>
                        )
                    }
                </AccordionDetails>
            </Accordion>

            <Typography variant='h6' sx={textStyle}>Attachment ({images?.length})</Typography>

            <Box className="attachment">
                {
                    groupChat.map(message => message.picture !== '' && <Avatar
                        src={message?.picture}
                        key={message._id}
                        sx={{
                            height: 70,
                            width: 80,
                            borderRadius: 2,
                            mb: 2,
                            boxShadow: 1
                        }}
                    />)
                }
            </Box>

        </Paper >
    )
}

export default GroupDetails;