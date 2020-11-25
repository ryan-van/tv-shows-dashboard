import React, { useState } from "react";

const APIKEY = '8891d5cefed0da21234ba062e1c9a7d7';
const baseURL = 'https://api.themoviedb.org/3/';
// https://api.themoviedb.org/3/tv/2316/season/{season_number}?api_key=8891d5cefed0da21234ba062e1c9a7d7&language=en-US

function App() {
  const [query, setQuery] = useState("The Good Place");
  const [tvID, setTVID] = useState(66573);
  const [numSeasons, setNumSeasons] = useState(4);
  const [seasons, setSeasons] = useState([]);

  async function getID(keyword) {
    let url = ''.concat(baseURL, 'search/tv?api_key=', APIKEY, '&query=', keyword, '&include_adult=false');
    return await fetch(url)
    .then(response => {return response.json()})
    .then(data => {
      return data.results[0].id;
      // setTVID(data.results[0].id);
    })
  }
  
  const getSeasonCount = function () {
    //https://api.themoviedb.org/3/tv/2316?api_key=8891d5cefed0da21234ba062e1c9a7d7&language=en-US
    let url = ''.concat(baseURL, 'tv/', tvID, '?api_key=', APIKEY, '&language=en-US');
    fetch(url)
    .then(response => response.json())
    .then((data)=>{
      console.log(data);
      let temp = 0;
      for (let x = 0; x < data.seasons.length; x++) {
        if (data.seasons[x].season_number !== 0) {
          temp += 1;
        }
      }
      setNumSeasons(temp);
    })
  }
  
  const getEpisodeRatings = function () {
    getSeasonCount(); 
    console.log(numSeasons);
    
    let tmpSeasons = [];
    let i;
    for (i = 1; i <= numSeasons; i++) {
      let episodeRatings = [];
      let url = ''.concat(baseURL, 'tv/', String(tvID), '/season/', i, '?api_key=', APIKEY, '&language=en-US');
      fetch(url)
      .then(response => response.json())
      .then((data)=>{
        // console.log(data);
        let j;
        for (j = 0; j < data.episodes.length; j++) {
          episodeRatings.push(data.episodes.vote_average);
        }
        tmpSeasons.push(episodeRatings);
        setSeasons(tmpSeasons);
      })
    }
  }
  
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
  
  async function RenderTable(props) {
    // make api call on props.query
    let id = await getID(props.query);
    // let set;
    // id.then(response => {
    //   set = response;
    //   console.log(response);
    // })
    console.log(id);
    // const episodeRatings = getEpisodeRatings();
    return (<h1>this is the table</h1>)

  }
  
  function Page() {
    // const [query, setQuery] = useState("The Good Place");
    
    const handleSubmit = (event) =>  {
      event.preventDefault();
      setQuery(event.target.show.value);
    }

    const handleTable = (event) => {

    }
    
    //https://developers.themoviedb.org/3/search/search-tv-shows
  
    // https://api.themoviedb.org/3/search/tv?api_key=8891d5cefed0da21234ba062e1c9a7d7&language=en-US&page=1&query=test&include_adult=false
  
    return (
      <div>
        <SearchBar handleSubmit={handleSubmit} />
        <RenderTable query={query} />
      </div>
    );
  }
  return (
    <div className="App">
      <header className="App-header"></header>
      <div><Page /></div>
    </div>
  );
}

export default App;
