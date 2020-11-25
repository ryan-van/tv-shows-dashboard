import React, { useState, useEffect } from "react";
import "./index.css"

const APIKEY = '8891d5cefed0da21234ba062e1c9a7d7';
const baseURL = 'https://api.themoviedb.org/3/';
// https://api.themoviedb.org/3/tv/2316/season/{season_number}?api_key=8891d5cefed0da21234ba062e1c9a7d7&language=en-USt
// GET /tv/{tv_id}
// https://api.themoviedb.org/3/tv/2316?api_key=8891d5cefed0da21234ba062e1c9a7d7&language=en-US

// GET /tv/{tv_id}/season/{season_number}
// https://api.themoviedb.org/3/tv/2316/season/1?api_key=8891d5cefed0da21234ba062e1c9a7d7&language=en-US

function SearchBar(props) {
  return (
    <div className='center'>
    <form onSubmit={props.handleSubmit}>
      <label>TV Show: </label>
      <input type="text" name="show" />
      <input type="submit" value="Search Show" />
    </form>
    </div>
  );
}

function RenderTable(props) {
  if (Object.keys(props.data).length === 0 && props.data.constructor === Object) {
    return (<h1>Enter a search query</h1>)
  }
  // TODO: GET RID OF THIS & add error handling for missing stuff
  if (props.data.id == 7089) {
    return (<h1>Enter a search query</h1>)
  }
  console.log(props.data);
  console.log(props.data.seasons);

  let all_seasons = [];
  let season;
  for (let i = 1; i <= props.data.num_seasons; i++) {
    let season_number = 'season' + i;
    season = <tr>
      {props.data.seasons[season_number].map(index => (
       <td> {index} </td>
      ))}
    </tr>
    all_seasons.push(season);
  }

  return (
    <table>
      {all_seasons}
    </table>
  );

}

async function fetchId(query) {
  const url = ''.concat(baseURL, 'search/tv?api_key=', APIKEY, '&query=', encodeURIComponent(query), '&include_adult=false');
  let response = await fetch(url);
  let json_response = await response.json();
  return json_response.results[0].id;
}

async function fetchNumSeasons(id) {
  let url = ''.concat(baseURL, 'tv/', id, '?api_key=', APIKEY, '&language=en-US');
  let response = await fetch(url);
  let json_response = await response.json();
  let numSeasons = 0;
  for (let x = 0; x < json_response.seasons.length; x++) {
    if (json_response.seasons[x].season_number !== 0) {
      numSeasons += 1;
    }
  }
  return numSeasons;
}

async function fetchSeasons(id, numSeasons) {
  var newSeasons = {};
  for (let i = 1; i <= numSeasons; i++) {
    let url = ''.concat(baseURL, 'tv/', id, '/season/', i, '?api_key=', APIKEY, '&language=en-US');
    let response = await fetch(url);
    let json_response = await response.json();
    let episodeRatings = [];
    for (let j = 0; j < json_response.episodes.length; j++) {
      episodeRatings.push(json_response.episodes[j].vote_average);
    }
    newSeasons['season' + String(i)] = episodeRatings;
  }
  return newSeasons;
}

function Page() {
  const [values, setValues] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    let newValues = {};
    newValues.query = event.target.show.value;
    setValues(newValues);
  }

  useEffect (() => {
    async function fetchData() {
      let id = await fetchId(values.query);
      let newValues = JSON.parse(JSON.stringify(values));;
      newValues.id = id;

      let numSeasons = await fetchNumSeasons(id);
      let seasons = await fetchSeasons(id, numSeasons);
      newValues.num_seasons = numSeasons;
      newValues.seasons = seasons;
      setValues(newValues);
    }
    fetchData();
  }, [values.query]);
  
  return (
    <div>
      <SearchBar handleSubmit={handleSubmit} />
      <br />
      <RenderTable data={values}/>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <header className="App-header"></header>
      <div><Page /></div>
    </div>
  );
}

export default App;
