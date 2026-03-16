import React from 'react'

const Section = ({ children, section, style, name }) => {
    return (
        <section id={section}>
            <div className='space'>
                <br />
            </div>
            <div className={`${style} mx-auto w-[330px] bg-brown-500 rounded-sm text-center`}>
                <h2 className='text-white text-xl uppercase'>{name}</h2>
            </div>
            {children}
        </section>
    )
}

export default Section