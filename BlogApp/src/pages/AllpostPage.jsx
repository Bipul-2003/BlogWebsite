import React, { useEffect, useState } from 'react'
import { Container, Postcard } from '../components'
import appwriteService from '../appwrite/conf'

const AllpostPage = () => {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        appwriteService.getPosts([])
            .then((posts) => {
                // console.log(posts.documents)
                if (posts) {
                    setPosts(posts.documents)
                }
            })



    },)

    return (
        <div className='w-full py-8'>
            <Container>
                {
                    <div className="flex flex-wrap">
                        {
                            posts.map((post) => (
                                <div className="p-2 w-1/4" key={post.$id}>
                                    <Postcard {...post} />
                                </div>
                            ))
                        }
                    </div>
                }
            </Container>
        </div>
    )
}

export default AllpostPage