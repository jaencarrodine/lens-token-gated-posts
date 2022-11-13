import React from 'react';
import GatePostModal from './GatePostModal';
import {useState} from 'react';

export default function (){
    const [modalOpen, setModalOpen] = useState(false);
    return(
        <>
            <button class="btn btn-outline btn-primary" onClick={()=>setModalOpen(true)}>
                🔒 Access Controls
                
            </button>
            <GatePostModal open = {modalOpen} setOpen = {setModalOpen}/>
        </>

    )

}