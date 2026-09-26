import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from 'react'
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const Protected = ({children}) => {
    const { loading, user} = useAuth()

    if(loading){
        return <LoadingSpinner message="Authenticating..." />
    }
    if(!user)
    {
        return <Navigate to={'/login'} />
    }
  return children
}

export default Protected
