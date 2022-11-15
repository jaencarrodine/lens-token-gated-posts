import React from 'react';
import { urqlQuery } from '../../api';
import {useEffect, useState} from 'react';
import {getPublication} from '../../api/queries/getPublication';

import Publication from '../../components/Publication';



function PublicationPage({publicationId,}){
    return <Publication publicationId={publicationId}/>

}

export default PublicationPage;

export async function getServerSideProps({ params }) {
    //fetch publication data form the lens api
 
    return {
        props: {
            publicationId: params.id,
            theme: 'light'
        },
    };
}