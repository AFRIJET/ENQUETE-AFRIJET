import React, { forwardRef } from 'react'
import { useTranslation } from 'react-i18next';

const notesQuestion = forwardRef(({ handleChange, name, question, num, style, label }, ref) => {
    const { t } = useTranslation();
    return (
        <fieldset>
            <legend className="text-sm font-semibold leading-6 text-gray-900">
                {num}. {question} <span className='text-red-500'>*</span>
            </legend>
            <small className='text-xs text-gray-700'>{t('type_satisfaction')}</small><br />
            <small className='text-xs text-gray-700'>{t('critere_note')}</small>
            <div style={style}>
                <div className="mt-4 grid grid-cols-5">
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
            </div>
        </fieldset>

    )
})

export default notesQuestion