import React, { forwardRef } from 'react'

const notes = ({ style, handleChange, ref, name, label }) => {
    return (
        <div className={`${style} mt-4 grid grid-cols-5`}>
            {[1, 2, 3, 4, 5].map((note) => (
                <div className="flex items-center mb-4" key={note}>
                    <input
                        type="radio"
                        ref={ref}
                        id={`${label}_${note}`}
                        name={name}
                        value={note}
                        className="w-4 h-4 mr-2 bg-white border-2 border-gray-300 rounded-md inline-block cursor-pointer checked:bg-brown-500"
                        onChange={handleChange}
                    />
                    <label htmlFor={`${label}_${note}`} className="text-gray-700">
                        {note}
                    </label>
                </div>
            ))}
        </div>
    )
}

export default notes;