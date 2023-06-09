import { useEffect, useState } from 'react';
import Mapcontainer from "./Mapcontainer";
import Header from "./Header";
import Results from "./Results";
import '../styles/Home.css';
// import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import logo from './../images/car.png'
// import mapStyles from '../styles/Mapcontainer.css'
import { Button } from "@mui/material";


export default function Home() {
  const [isStart, setisStart] = useState(true);
  const [startPos, setStartPos] = useState({ lat: 0, lng: 0 });
  const [endPos, setEndPos] = useState({ lat: 0, lng: 0 });
  const [models, setModels] = useState([]);
  const [results, setResults] = useState(undefined);
  const [stats, setStats] = useState(undefined);
  const [route, setRoute] = useState({});
  const [selectModel, setChoice] = useState('');

  const handleButton = () => {
      let ljson = JSON.stringify(startPos)
      let rjson = JSON.stringify(endPos)
      fetch(`/rankData?model=${selectModel}&start=${ljson}&end=${rjson}`)
      .then(res => res.json())
      .then(data => {
          setRoute({method: data.best_method});
          setStats(data.stats);
          setResults(data.scores);
      });
  }
  /* fetch list of car models */
  useEffect(() => {
    fetch('http://localhost:3001/models')
      .then(res => res.json())
      .then(data => {
        setModels(data.models);
      });
  }, []);

  const handleClick = (clickEvent) => {
    setisStart((prevIsStart) => {
      const newIsStart = !prevIsStart;
      let lat = clickEvent.latLng.lat();
      let lng = clickEvent.latLng.lng();
  
      if (newIsStart) {
        setStartPos({ lat: lat, lng: lng });
      } else {
        setEndPos({ lat: lat, lng: lng });
      }
  
      return newIsStart;
    });
  };
  

  return (
    <div className="home">
      <Header />
      <div className="car">
        <h className="car-title">
          Vehicle model
          <Autocomplete
          disablePortal
          id="model-selector"
          options={models}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} model='model' />}
          onChange={(e) => {setChoice(e.target.innerText);}}
        />
        </h>
        <img className="image" src={logo} alt="Logo" />
      </div>
      <div className='map'>
        <h className="mapChild">Select a route</h>
        <h className="mapChild">(click endpoints)</h>
        <Mapcontainer className="mapChild" handleClick={handleClick} startPos={startPos} endPos={endPos} route = {route}/>
        {/* <br/> */}
        <Button className="mapButton" onClick={handleButton} variant="contained" color="primary">
            SUBMIT
        </Button>
      </div>

      {results != undefined && <Results results={results} stats={stats} />}
      {/* <div className="bot"></div> */}
    </div>
  )
}