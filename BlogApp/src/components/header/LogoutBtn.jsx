import React from 'react'
import { useDispatch } from 'react-redux'
import { logout } from '../../store/authSlice'
import authService from '../../appwrite/auth'

const LogoutBtn = () => {
    const dispatch = useDispatch()
    const logouthandeler=()=>{
        authService.logout()
        .then(()=>{
            dispatch(logout())
        })
    }
  return (
    <button type="button" className="inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full">Logout</button>
    )
}

export default LogoutBtn