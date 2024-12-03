import React from 'react'

const progressBar = ({ answeredQuestions, totalQuestions }) => {

    const progressPercentage = (answeredQuestions / totalQuestions) * 100;

    return (
        <div className="flex fil_ariane w-full">
            <div
                style={{ width: `${progressPercentage}%` }}
                className="h-2 w-full bg-brown-500"
            ></div>
        </div>
    )
}

export default progressBar