import React from 'react'

const ContentBox = ({ children }) => {
    return (
        <div className='w-[1200px] container mx-auto px-5 my-5'>
            {children}
        </div>
    )
}

export default ContentBox