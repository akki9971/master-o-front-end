import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BiLogOutCircle } from 'react-icons/bi'
import { useNavigate } from 'react-router'
import GameUI from './GameUI';
import Score from './Score';
import { API_URL } from '../../Constants';


export function Home() {

  let navigate = useNavigate();

  const [user, setUser] = useState({ name: 'Akib Ali' })
  const [data, setData] = useState([])
  const [quizData, setQuizData] = useState({})
  const [score, setScore] = useState(0)

  const [currentQuestion, setCurrentQuestion] = useState(0)

  const [gameOver, setGameOver] = useState('init')


  useEffect( ()=>{
    const loggedIn = localStorage.getItem('loggedIn')


    if(loggedIn == "true"){
      setUser({name:localStorage.getItem('user')})

      fetApiData()
    }

  },[])

  async function fetApiData (){
          await axios
        .get(`${API_URL}/get-questions`)
        .then(response => {
          if(response.status == 200 && response.data?.success){
            setData(response.data?.questions)
          }
        })
  } 

  function restart(){
    setCurrentQuestion(0)
    setScore(0)
    setGameOver('init')
    fetApiData()
  }

  useEffect(()=>{

    setQuizData(data[currentQuestion ])

    if(currentQuestion >= data.length) {
      setGameOver('over')
    } else {
      setGameOver('running')
    }
    
  }, [score, currentQuestion, data])

  return (
    <>
      <div className="game-ui-wrapper">
        <div className="logout-container" onClick={()=>{
          navigate("/")
          localStorage.clear()
        }}>
            <BiLogOutCircle />
        </div>
        <div className="container-fluid">
          <div className="welcome-wrapper">
            <div className="text-center text-white ">
              <h2 className=" my-3">
                <span className="border-bottom">
                  Hello, {user?.name}
                </span>
              </h2>
              <h3 className="text-info">Welcome to this amazing quiz.</h3>
            </div>
          </div>
          {
            gameOver != 'over' && (
              <GameUI quizData={quizData} setScore={setScore} score={score} setCurrentQuestion={setCurrentQuestion} currentQuestion={currentQuestion} />
            )
          }
          {
            gameOver == 'over' && (
              <Score score={score} attempted={data.length} restart={restart} />
            )
          }
        </div>
      </div>
    </>
  )
}