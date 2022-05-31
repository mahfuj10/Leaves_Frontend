import { Button, TextField } from '@mui/material';
import React, { useRef } from 'react'
import { ImCross } from 'react-icons/im';
import { useFirebase } from '../hooks/useFirebase';
import { updateUserAddress, updateUserName, updateUserNumber, updateUserProfession } from '../Redux/counterSlice';
import { useAppDispatch, useAppSelector } from '../Redux/hooks';

const ContractInfo = ({ user }: any) => {

    const { updatePhotoAndName } = useFirebase();
    const nameRef = useRef<any>(null);
    const numberRef = useRef<any>(null);
    const addressRef = useRef<any>(null);
    const workRef = useRef<any>(null);
    const { loginUser, updateUserInfo } = useAppSelector(state => state.data);
    const dispatch = useAppDispatch();





    // update function
    const updateFunction = () => {
        const updatedName = nameRef.current.value;
        if (updatedName === loginUser.displayName) return;
        const data = { uid: user.uid, name: updatedName };
        dispatch(updateUserName(data));
        updatePhotoAndName(updatedName, loginUser.photoURL);
    };

    // updateMobile
    const updateMobile = () => {
        const data = { uid: user.uid, phone: numberRef.current.value };
        dispatch(updateUserNumber(data));
    };

    // updateMobile
    const updateAddress = () => {
        const data = { uid: user.uid, adress: addressRef.current.value };
        dispatch(updateUserAddress(data));
    };

    // update profession
    const updateProfession = () => {
        const data = { uid: user.uid, profession: workRef.current.value };
        dispatch(updateUserProfession(data))
    }


    // style sheet
    const buttonStyle = {
        borderColor: "#beb8b8",
        color: "whitesmoke",
        '&:hover': {
            borderColor: "#beb8b8",
        }
    };

    return (

        <>

            <span style={{ display: 'flex', marginBottom: 30 }}>
                <input
                    className='setting_input'
                    type="text"
                    ref={nameRef}
                    defaultValue={user?.displayName}
                />

                <Button
                    onClick={updateFunction}
                    variant='outlined'
                    sx={buttonStyle}>
                    SAVE
                </Button>



            </span>

            <span style={{ display: 'flex', marginBottom: 30 }}>
                <input
                    placeholder='Phone number'
                    className='setting_input'
                    type="number"
                    ref={numberRef}
                    defaultValue={user?.phone}
                />

                <Button
                    onClick={updateMobile}
                    variant='outlined'
                    sx={buttonStyle}>
                    SAVE
                </Button>

            </span>

            <span style={{ display: 'flex', marginBottom: 30 }}>

                <input
                    ref={workRef}
                    placeholder='Your profession'
                    className='setting_input'
                    type="text"
                    defaultValue={user?.profession}
                />

                <Button
                    onClick={updateProfession}
                    variant='outlined'
                    sx={buttonStyle}>
                    SAVE
                </Button>

            </span>

            <span style={{ display: 'flex', marginBottom: 30 }}>

                <input
                    placeholder='Your address'
                    ref={addressRef}
                    className='setting_input'
                    type="text"
                    defaultValue={user?.adress}
                />

                <Button
                    onClick={updateAddress}
                    variant='outlined'
                    sx={buttonStyle}>
                    SAVE
                </Button>

            </span>

            <span style={{ display: 'flex', marginBottom: 0 }}>
                <input
                    className='setting_input'
                    type="text"
                    disabled
                    defaultValue={user?.email}
                />
                <Button variant='outlined' disabled><ImCross /></Button>
            </span>




        </>
    )
}

export default ContractInfo;