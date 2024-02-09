import React, { useEffect, useState } from 'react'
import appwriteService from '../appwrite/conf'
import { Container, Button, Postcard } from '../components'
import { useSelector } from 'react-redux'

const HomePage = () => {
    const [posts, setPosts] = useState([])

    const user = useSelector((state) => state.auth.userData)


    useEffect(() => {
        if (user) {
            appwriteService.getUserPosts(user.$id)
                .then((posts) => {
                    if (posts) {
                        setPosts(posts.documents)
                    }
                })
                .catch((error) => console.log('ERROR: ', error))
        }

    }, [])

    if (!user) {
        return (<p className='h-[540px] text-center font-semibold text-xl'>Please Login</p>)
    }
    if (posts.length === 0) {
        return (<p className='h-[540px] text-center font-semibold text-xl'>Please! Create your first Article </p>)
    }

    return (<div className='w-full min-h-screen py-8'>
        <Container>
            <div className='grid grid-cols-3 space-x-1'>
                {posts.map((post) => (
                    <div key={post.$id} className='p-2 transform hover:scale-105 ease-in-out transition-all'>
                        <Postcard {...post} />
                    </div>
                ))}
            </div>
        </Container>
    </div>)
}

export default HomePage