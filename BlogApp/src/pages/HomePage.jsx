import React, { useEffect, useState } from 'react'
import appwriteService from '../appwrite/conf'
import { Container, Button, Postcard } from '../components'

const HomePage = () => {
    const [posts, setPosts] = useState([])
    useEffect(() => {
        appwriteService.getPosts()
            .then((posts) => {
                if (posts) {
                    setPosts(posts.documents)
                }
            })
            .catch((error) => console.log('ERROR: ', error))

    }, [])

    if (posts.length === 0) {
        return (
            <Container>
                <div className="flex flex-wrap">
                    <div className="p-2 w-full">
                        <h1 className="">
                            Login to Read Post
                        </h1>
                    </div>
                </div>
            </Container>
        )
    }
    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.map((post) => (
                        <div key={post.$id} className='p-2 w-1/4'>
                            <Postcard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default HomePage