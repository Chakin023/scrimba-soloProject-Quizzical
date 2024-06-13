import React from "react"
import he from 'he';

export default function Quiz(props) {
    const {question, answers, holdAnswer, selectedAnswer} = props

    const answersMap = answers.map(answer => (
            <button 
                key={answer.id}
                className="quiz-answer"
                onClick={() => {
                    if(!selectedAnswer || selectedAnswer === answer.id) 
                        holdAnswer(answer.id)}}
                >
                    {he.decode(answer.text)}
            </button>
        
    ))
    
    return (
        <div className="quiz-container">
            <h1>{he.decode(question)}</h1>
            <div className="answer-container">
                {answersMap}
            </div>
        </div>
    )
}