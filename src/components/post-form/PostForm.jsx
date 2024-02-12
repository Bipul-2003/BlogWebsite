import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input, RTE, Select } from '../index'
import appwriteService from '../../appwrite/conf.js'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { GoogleGenerativeAI } from '@google/generative-ai'
import config from '../../config/config.js'



const PostForm = ({ post }) => {

    const [prompt, setPrompt] = useState("")
    const [result, setResult] = useState("")
    const [loader, setLoader] = useState(false)

    //gen ai integrated
    const genAI = new GoogleGenerativeAI(config.googlegenaiapikey);
    const generation_config = {
        "max_output_tokens": 10,
    }

    const run = async (prompt, generation_config, genAI, setResult) => {
        setLoader(true)
        // For text-only input, use the gemini-pro model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // const prompt = "Write a story about a magic backpack."

        const result = await model.generateContent(prompt, generation_config)
        const response = await result.response;
        const text = response.text();
        setResult(text)
        setLoader(false)
    }


    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || '',
            slug: post?.$id || '',
            content: post?.content || '',
            status: post?.status || 'active',

        }
    })

    const navigate = useNavigate()
    const userData = useSelector(state => state.auth.userData)
    const submit = async (data) => {
        if (post) {
            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;

            if (file) {
                appwriteService.deleteFile(post.featuredImage);
            }

            const dbPost = await appwriteService.updatePost(post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined,
            });

            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
            }
        } else {
            const file = await appwriteService.uploadFile(data.image[0]);

            if (file) {
                const fileId = file.$id;
                data.featuredImage = fileId;
                const dbPost = await appwriteService.createPost({ ...data, userId: userData.$id });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            }
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === 'string') {
            return value.trim().toLowerCase().replace(/[^a-zA-Z\d\s]+/g, "-").replace(/\s/g, "-");
        }
        return ''

    }, [])

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === 'title') {
                setValue('slug', slugTransform(value.title, { shouldValidate: true }))
            }
        })
        return () => {
            subscription.unsubscribe()
        }

    }, [watch, slugTransform, setValue])

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getfilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg h-20"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>

                <div className="w-full mt-12" >
                    <div className="relative min-w-[200px]">
                        <Input type="text" label="AI Suggestion: " value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder='Enter your topic' onKeyDown={(e) => {

                            if (e.key === 'Enter') {
                                run(prompt, generation_config, genAI, setResult);
                                setResult("")
                            }
                        }} />
                        <div className="parent relative">
                            {loader && <div className="absolute-div absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div className='flex space-x-2 justify-center items-center bg-transparent dark:invert'>
                                    <span className='sr-only'>Loading...</span>
                                    <div className='h-4 w-4 bg-black rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                                    <div className='h-4 w-4 bg-black rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                                    <div className='h-4 w-4 bg-black rounded-full animate-bounce'></div>
                                </div>
                            </div>}

                            <textarea disabled
                                className="peer h-full my-4 min-h-[300px] w-full text-slate-100 resize-none rounded-[7px] border border-blue-gray-200 border-t-transparent  bg-slate-500 px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
                                placeholder="" value={result}></textarea>
                        </div>

                        <Button onClick={() => {
                            run(prompt, generation_config, genAI, setResult);
                            setResult("")
                        }}>Generate</Button>
                    </div>
                </div>

                {/* <input type="text" /> */}
            </div>
        </form>
    )
}

export default PostForm
