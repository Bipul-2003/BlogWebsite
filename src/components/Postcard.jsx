import React from 'react'
import appwriteService from '../appwrite/conf'
import { Link } from 'react-router-dom'


const Postcard = ({ $id, title, featuredImage }) => {
  // console.log('featuredImage',featuredImage)
  return (



    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <div className='w-50 h-24 opacity-80'>
        <img src={appwriteService.getfilePreview(featuredImage)} alt={title} className='rounded-t-lg w-full h-full object-cover' />
      </div>
      <div className="p-5">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
        <Link to={`/post/${$id}`} className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-slate-700 rounded-lg hover:bg-slate-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-900 dark:hover:bg-blue-700 dark:focus:ring-blue-500">
          Read more
          <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
          </svg>
        </Link>
      </div>
    </div>


  )
}

export default Postcard