import { Skeleton } from '@mui/material'
import React from 'react'


export default function MessageLoading() {

    return (

        <>

            {
                [...new Array(8)].map((ske: any, index: number) => <Skeleton
                    variant="rectangular"
                    width={'100%'}
                    height={65}
                    className='message_loading'
                    sx={{ mb: 2, borderRadius: 2 }}
                />

                )
            }



        </>

    )
}