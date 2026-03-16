import React, { forwardRef } from 'react'

const Reponse = forwardRef(({ style, checked, disabled, onClick, onChange, value, name, option, id }, ref) => {
    return (
            <div className={`${style} flex gap-x-3 p-2 bg-gray-200 rounded`}>
                <div className="flex h-6 items-center">
                    <input
                        ref={ref}
                        checked={checked}
                        onClick={onClick}
                        onChange={onChange}
                        disabled={disabled}
                        id={id}
                        value={value}
                        name={name}
                        type="checkbox"
                        className={"h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-red-600"}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    />
                </div>
                <div className="text-sm leading-6">
                    <label htmlFor={id} className="font-medium text-gray-900">
                       {option}
                    </label>
                </div>
            </div>
    )
})

export default Reponse