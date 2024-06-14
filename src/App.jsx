import React, { useEffect, useState } from 'react'
import Quiz from "../Components/Quiz"
import ScoredQuiz from '../Components/ScoredQuiz'
import {nanoid} from "nanoid"
import './App.css'


export default function App() {

  const [startQuiz, setStartQuiz] = useState(false)
  const [checkAnswer, setCheckAnswer] = useState(false)
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0)
  const [quizzies, setQuizzies] = useState([])
  
  useEffect(() => {
    fetchQuizData();
  }, []);

  function fetchQuizData() {
    fetch("https://opentdb.com/api.php?amount=5")
      .then(res => res.json())
      .then(data => createQuizzies(data.results))
      .catch(err => console.error("Error fetching quiz data: ", err));
  }

  useEffect(() => {
    const correctAnswers = quizzies.reduce((acc, quiz) => {
      return acc + quiz.answers.reduce((answerAcc, answer) => {
        return answerAcc + (answer.isHeld && answer.isCorrect ? 1 : 0);
      }, 0)
    }, 0)

    setCorrectAnswersCount(correctAnswers)
  }, [quizzies])

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
  }

  function handleStartQuiz() {
    setStartQuiz(true)
  }

  function handleCheckAnswer() {
    setCheckAnswer(true)
    setStartQuiz(false)
  }

  function handleReset() {
    setStartQuiz(false)
    setCheckAnswer(false)
    setQuizzies([])
    fetchQuizData();
  }

  const quizElement = quizzies.map((quiz, index) => (
    <Quiz 
      key={index} 
      question={quiz.question} 
      answers={quiz.answers}
      holdAnswer={holdAnswer} 
      selectedAnswer={quiz.selectedAnswer} />
  ))

  const scoredQuizElement = quizzies.map((quiz, index) => (
    <ScoredQuiz 
      key={index}
      question={quiz.question}
      answers={quiz.answers}
      selectedAnswer={quiz.selectedAnswer}
    />
  ))

  return (
    <main>
      {(!startQuiz && !checkAnswer) &&
        <div className="welcome-container">
          <h1>Welcome to Quizzical</h1>
          <h2>Let's test your knowledge!</h2>
          <button className="nav-button" onClick={handleStartQuiz}>Start</button>
        </div>
      }

      {(startQuiz && !checkAnswer) &&
        <div className="quizzical">
          {quizElement}
          <button className="nav-button" onClick={handleCheckAnswer}>Check Answer</button>
        </div>
      }

      {(!startQuiz && checkAnswer) &&
        <div className="quizzical">
          {scoredQuizElement}
          <div>
            <h2>Your score {correctAnswersCount}/5 correct answers.</h2>
            <button className="nav-button" onClick={handleReset}>Play Again</button>
            </div>
          
        </div>
      }

  </main>
    
  )
}


