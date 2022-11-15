import React from 'react';
import GatePostModal from './GatePostModal';
import {useState} from 'react';
import { LockOpenIcon } from '@heroicons/react/24/outline';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import { useAccessControlData } from '../../store/useAccessControlData';
export default function GatePost(){
    const [modalOpen, setModalOpen] = useState(false);
    const accessControlConditions = useAccessControlData(state => state.accessControlConditions)
    function accessControlsSet(){
        if(accessControlConditions.length > 0){
            return true
        }
        return false
    }
    return(
        <>
            <button class="btn  btn-primary" onClick={()=>setModalOpen(true)}>
                
                <>
                
                {
                    accessControlsSet() ? '🔒 Edit Access Controls' : '🔓 Set Access Controls' 
                }
                </>
               
               
                
            </button>
            <GatePostModal open = {modalOpen} setOpen = {setModalOpen}/>
        </>

    )

}