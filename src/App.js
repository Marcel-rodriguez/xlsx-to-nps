import { useEffect, useState } from 'react';
import './App.css';
let XLSX = require('xlsx')

function App() {
  const [promoters, setPromoters] = useState([])
  const [neutral, setNeutral] = useState([])
  const [detractors, setDetractors] = useState([])
  const [npsScore, setNpsScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [data, setData] = useState([])

  useEffect(() => {
    const totalSurveys = promoters.length + neutral.length + detractors.length || 0
    setNpsScore((promoters.length - detractors.length) / totalSurveys * 100 || 0) 
  },[showScore])

  const showNPSPercentages = (data) => {
    console.log(data)
    for(let i = 0; i < data.length; i++){
      const actualValue = data[i].actual_value
      if(actualValue >= 9){
        setPromoters(arr => [...arr, data[i]])
      } else if(actualValue < 9 && actualValue >= 7){
        setNeutral(arr => [...arr, data[i]])
      } else {
        setDetractors(arr => [...arr, data[i]])
      }
    }
    setShowScore(!showScore)

  }

  const readExcel = (file) => {
    resetScore()
    const promise = new Promise( (resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file)

      fileReader.onload = (e) => {
        const bufferArray = e.target.result;

        const wb = XLSX.read(bufferArray, {type: 'buffer'})

        const wsname = wb.SheetNames[0]

        const ws= wb.Sheets[wsname]

        console.log(ws)

        const data = XLSX.utils.sheet_to_json(ws)

        console.log(data)

        resolve(data)
      }

      fileReader.onerror = ((error) => {
        reject(error)
      })
    })

    promise.then((d) => {
      setData(d)
    })
  }

  const resetScore = () => {
    setDetractors([])
    setNeutral([])
    setPromoters([])
    setNpsScore(0)
  }


  return (
    <div className="App">
      <h1>Excel NPS Sheet to NPS Score Converter!</h1>

      <input type='file' onChange={(e) => {
        const file = e.target.files[0]
        readExcel(file)
      }}/>

      {npsScore > 0 && <div className='result'>
      <p>{`There are ${promoters.length} promoters, ${neutral.length} neutral, and ${detractors.length} detractors. The NPS Score is ${npsScore.toFixed(2)}%`}</p>
      <p>{`with a total of ${promoters.length + detractors.length + neutral.length} Surveys!`}</p>
      </div>}
      {npsScore === 0 && <div className='result'>
        <p>Please insert a file and click show NPS Score</p>
        <br />
        </div>}
        <button disabled={npsScore > 0} onClick={() => showNPSPercentages(data)}> Show NPS Score</button>
      <button onClick={() => resetScore()}>Clear Score</button>
    </div>
  );
}

export default App;
