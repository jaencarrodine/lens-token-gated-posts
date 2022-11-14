import React from 'react';
import { DocumentPlusIcon } from '@heroicons/react/24/outline'

export default function NewPostCard(){



    return (
        <button
            type="button"
            className="relative flex flex-col items-center justify-center w-full rounded-lg border-2 border-dashed border-gray-300 p-8 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
            <DocumentPlusIcon className='w-10 h-10' />
          
            <span className="mt-2 block text-sm font-medium">Create a new gated post</span>
        </button>
    )

    

}