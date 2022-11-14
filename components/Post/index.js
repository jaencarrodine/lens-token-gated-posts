import React from 'react';
import EditPost from './EditPost';
import GatePost from './GatePost';
import SendPost from './SendPost';
import {usePost} from '../../store/usePost'

export default function Post(){
    const postTitle = usePost(state => state.postTitle)
    const postDescription = usePost(state => state.postDescription)
    const setPostTitle = usePost(state => state.setPostTitle)
    const setPostDescription = usePost(state => state.setPostDescription)
    function handleTitleChange(e){
        setPostTitle(e.target.value)
    }
    function handleDescriptionChange(e){
        setPostDescription(e.target.value)
    }
    return(

        <div className='h-full w-full flex flex-col px-32'>
            {console.log('post title', postTitle)}
            <h1 className='text-4xl font-bold'>New Token Gated Post</h1>
            <h2 className='text-2xl font-semibold mt-2'>Welcome!</h2>
            <p >
                You can edit your post below, set the access controls, and post it to lens.
            </p>
            <p className='mt-1'>
            Anything in the posts content section will be encrypted and only viewable by those who have an NFT of your choice.
            </p>
            <p className='mt-4 text-xs '>*The title and description will not be encrypted</p>
            <input onChange={handleTitleChange} value= {postTitle} type="" placeholder="Post Title" className="input input-lg w-full mt-1 outline-none accent-primary focus:outline-0  focus:border-primary" />

            <textarea onChange={handleDescriptionChange} value = {postDescription} type="" placeholder="Post description" className="textarea mt-4 border-0  outline-none focus:outline-none focus:border focus:border-primary focus:ring-0" ></textarea>
            <EditPost />
            <div className='flex  space-x-2 w-full justify-items-end pt-3'>
                <div className='ml-auto'><GatePost /></div>
                <div><SendPost /></div>
            </div>



        </div>

    )

}