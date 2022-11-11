import React from 'react';
import {useState, useEffect} from 'react';
import {useUserInfo} from '../store/useUserInfo';
import { urqlQuery } from '../api';
import { getPublications } from '../api/queries/getPublications';
import Link from 'next/link';
const Home = () => {
  const [publications, setPublications] = useState([]);

  const profile = useUserInfo(state => state.profile)
  useEffect(() => {
    getUserPublications()
  }, [profile])

  async function getUserPublications(){
    if(profile){
      console.log('profile: ', profile)
      let publications = await urqlQuery(getPublications, { id: profile.id, limit: 50 })
      setPublications(publications.data.publications.items)
    }
    
  }

  return (
    <div>
      {publications.map((pub) => {
        return (
          <Link href={`/publication/${pub.id}`}>
          <div key={pub.id}>
            <h1>{pub.metadata.name}</h1>
            <p>{pub.metadata.description}</p>
            
          </div>
          </Link>
        )
      })}
    </div>
  );
};

export default Home;
