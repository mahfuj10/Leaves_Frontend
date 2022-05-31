import { CircularProgress, Skeleton, Typography } from '@mui/material';
import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useFirebase } from '../hooks/useFirebase';
import { useAppSelector } from '../Redux/hooks';

const PrivateRoute = ({ children }: any) => {

    const { user, loading } = useFirebase();
    const { loginUser } = useAppSelector(state => state.data);
    let location = useLocation();

    if (loading) {
        return <Skeleton
            animation="wave"
            variant="rectangular"
            sx={{
                width: '100vw',
                height: '100vh'
            }}
        />

    };

    if (!loginUser.uid) {
        return <Navigate to="/login" state={{ from: location }} />;
    };

    return (
        <>
            {children}
        </>
    );
};

export default PrivateRoute;