import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { BiLogOutCircle } from 'react-icons/bi'
import { useNavigate } from 'react-router'
import { Score } from './Score';
import { API_URL } from '../../Constants';
import { isBrowser, isMobile, isTablet } from 'react-device-detect';
import { GameUIMobile } from './GameUIMobile';
import { GameUIDesktop } from './GameUIDesktop';
import { GridLoader } from 'react-spinners'
import Globe from './Globe';



export function Home() {

  let navigate = useNavigate();

  const [user, setUser] = useState({ name: 'Akib Ali' })
  const [data, setData] = useState([])
  const [quizData, setQuizData] = useState({})
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(false)


  const [currentQuestion, setCurrentQuestion] = useState(0)

  const [gameOver, setGameOver] = useState('init')

  useEffect(() => {
    const loggedIn = localStorage.getItem('loggedIn')


    if (loggedIn == "true") {
      setUser({ name: localStorage.getItem('user') })

      fetApiData()
    } else {
      navigate('/')
    }

  }, [])

  async function fetApiData() {
    setLoading(true)
    await axios
      .get(`${API_URL}/get-questions`)
      .then(response => {
        setLoading(false)
        if (response.status == 200 && response.data?.success) {
          setData(response.data?.questions)
        }
      }).catch(err=>{
        setLoading(false)
      })
  }

  function restart() {
    setCurrentQuestion(0)
    setScore(0)
    setGameOver('init')
    fetApiData()
  }

  useEffect(() => {

    setQuizData(data[currentQuestion])

    if (data.length > 0) {
      if (currentQuestion >= data.length) {
        setGameOver('over')
      } else {
        setGameOver('running')
      }
    }


  }, [score, currentQuestion, data])

  return (
    <>
      <div className="game-ui-wrapper" id="game_ui">
        <Globe />
        <div className="logout-container" onClick={() => {
          navigate("/")
          localStorage.clear()
        }}>
          <BiLogOutCircle />
        </div>
        <div className="container-fluid position-relative top-0 left-0" style={{zIndex:20}}>
          <div className="welcome-wrapper">
            <div className="text-center text-white ">
              <h2 className=" my-3">
                <span className="border-bottom" style={{letterSpacing:2}}>
                  Hello, {user?.name}
                </span>
              </h2>
              <h3 className="text-info">Welcome to this amazing quiz.</h3>
            </div>
          </div>
          {
            !loading && gameOver === 'running' && (
              <>
                {
                  (isMobile || isTablet) && (
                    <GameUIMobile quizData={quizData} setScore={setScore} score={score} setCurrentQuestion={setCurrentQuestion} currentQuestion={currentQuestion} />
                  )

                }
                {
                  isBrowser && <GameUIDesktop quizData={quizData} setScore={setScore} score={score} setCurrentQuestion={setCurrentQuestion} currentQuestion={currentQuestion} />
                }
              </>
            )
          }

{
            loading && <div className="mt-5 text-center">
              <GridLoader color="#ffffff" />
            </div>

}

          {
            !loading && gameOver === 'over' && (
              <Score score={score} attempted={data.length} restart={restart} />
            )
          }
        </div>
      </div>
    </>
  )
}