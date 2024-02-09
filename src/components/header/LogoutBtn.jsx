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
    <button type="button" onClick={logouthandeler} className="inline-bock px-6 py-2 duration-200 bg-slate-400 hover:bg-red-400 hover:text-white rounded-full">Logout</button>
    )
}

export default LogoutBtn