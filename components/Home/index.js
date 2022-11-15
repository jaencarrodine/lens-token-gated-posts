import React from 'react';
import {useState, useEffect} from 'react';
import {useUserInfo} from '../../store/useUserInfo';
import { urqlQuery } from '../../api';
import { getPublications } from '../../api/queries/getPublications';
import PostCard from './PostCard';
import NewPostCard from './NewPostCard';
const Home = () => {
  const [publications, setPublications] = useState([]);

  const profile = useUserInfo(state => state.profile)
  useEffect(() => {
    getUserPublications()
  }, [profile])

  async function getUserPublications(){
    if(profile){
      console.log('profile: ', profile)
      let publications = await urqlQuery(getPublications, { id: profile.id, limit: 5 })
      setPublications(publications.data.publications.items)
    }
    
  }

  return (
    <>
        <h1 className='font-bold text-3xl mb-2'>Your Posts</h1>
        <div className='grid grid-cols-3 gap-4'>
            <NewPostCard />
            {publications.map((pub, i) => {
                return (
                <PostCard key = {i} publication={pub}/>
                )
            })}
        </div>
    </>
   
  );
};

export default Home;
