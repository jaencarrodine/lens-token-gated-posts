import React from 'react';
import Link from 'next/link';
export default function  PostCard({publication}){

    return(

        <Link href={`/publication/${publication.id}`}>
            <div className='shadow-md w-full h-40 bg-base-100 rounded-lg p-3 transition duration-100 hover:cursor-pointer hover:shadow-xl hover:scale-105'>
               
                    <h1 className='font-semibold text-xl'>{publication.metadata.name}</h1>
                    <p className='text-lg'>{publication.metadata.description}</p>
                    <p className='truncate'>{publication.metadata.content}</p>
           
            </div>
        </Link>

    )

}