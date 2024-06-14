import React from "react"
import he from "he"

export default function ScoredQuiz(props) {
    const {question, answers, selectedAnswer, correctAmount} = props

    const answersMap = answers.map((answer) => {
        let answerColor = "transparent"
        let border = "solid"

        if(answer.id === selectedAnswer) {
            answerColor = answer.isCorrect ? "#94D7A2" : "#F8BCBC"
            border = "none";
        } else if (answer.isCorrect) {
            answerColor = "#94D7A2"
            border ="none";
        }

        return (
            <button 
                key={answer.id}
                style={{
                    border: border,
                    backgroundColor: answerColor
                }}
                className="quiz-answer"
            >
                {he.decode(answer.text)}
            </button>
        )
    })

    return (
        <div className="quiz-container">
            <h1>{he.decode(question)}</h1>
            <div className="answer-container">
                {answersMap}
            </div>
        </div>
    )
}