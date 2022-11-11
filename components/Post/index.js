import React from 'react';
import EditPost from './EditPost';
import GatePost from './GatePost';
import SendPost from './SendPost';


export default function Post(){

    return(

        <div className='h-full w-full flex flex-col px-32'>
            
            {/* post header */}

            {/* edit post content  */}
            <EditPost />
            <div className='flex  space-x-2 w-full justify-items-end pt-3'>
                <div className='ml-auto'><GatePost /></div>
                <div><SendPost /></div>
            </div>



        </div>

    )

}