import React from 'react'
import { Link } from 'react-router-dom'

const Welcome = () => {
  return (
    <>
        <h1>Welcome</h1>
        <Link to='/dash/notes'>Notes</Link>
        <Link to ='/dash/users'>Users</Link>
    </>
  )
}

export default Welcome