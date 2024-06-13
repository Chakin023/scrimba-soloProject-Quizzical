import React, { useEffect, useState } from 'react'
import Quiz from "../Components/Quiz"
import {nanoid} from "nanoid"
import './App.css'


export default function App() {

  const [quizzies, setQuizzies] = useState([])
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchQuizData() {
      try {
        const res = await fetch("https://opentdb.com/api.php?amount=5");
        if(!res.ok) {
          throw new Error(`HTTP Error! status: ${res.status}`)
        }
        const data = await res.json();
        createQuizzies(data.results)
      } catch(err) {
        setError(err.message);
        console.error("Error fetching quiz data: ", err);
      }
    }
    fetchQuizData();
  }, [])

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

  function createQuizzies(quizziesData) {
    if (!quizziesData) {
      return null;
    }
    const quiz = quizziesData.map(quiz => {
      let answers = quiz.incorrect_answers.map(incorrectAnswer => ({
        id: nanoid(),
        text: incorrectAnswer,
        isHeld: false,
        isCorrect: false
      }));

      answers.push({
        id: nanoid(),
        text: quiz.correct_answer,
        isHeld: false,
        isCorrect: true
      })

      answers = shuffle(answers)
        
      return {
        question: quiz.question,
        answers: answers,
        selectedAnswer: ""
      };
      
    })
    setQuizzies(quiz)
    console.log(quizzies)
  }

  function holdAnswer(answerId) {
    setQuizzies(prevQuizzies => prevQuizzies.map(quiz => {
      let newSelectedAnswer = quiz.selectedAnswer
      const answers = quiz.answers.map(answer => {
        if (answer.id === answerId) {
          const isNowHeld = !answer.isHeld;
          newSelectedAnswer = isNowHeld ? answer.id : (quiz.selectedAnswer === answer.id ? "" : quiz.selectedAnswer);
          return {
            ...answer,
            isHeld: isNowHeld
          };
        }
        return answer;
      });
      return {
        question: quiz.question,
        answers: answers,
        selectedAnswer: newSelectedAnswer
      }
    }));
    console.log(quizzies)
  }

  const quizElement = quizzies.map((quiz, index) => (
    <Quiz 
      key={index} 
      question={quiz.question} 
      answers={quiz.answers}
      holdAnswer={holdAnswer} 
      selectedAnswer={quiz.selectedAnswer} />
  ))

  return (
    <div className="quizzical">
      {quizElement}
      <button>Check Answer</button>
    </div>
  )
}


