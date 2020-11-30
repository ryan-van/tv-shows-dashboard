import React, { useState, useEffect } from "react";
import "./index.css"

const APIKEY = '8891d5cefed0da21234ba062e1c9a7d7';
const baseURL = 'https://api.themoviedb.org/3/';
// https://api.themoviedb.org/3/tv/2316/season/{season_number}?api_key=8891d5cefed0da21234ba062e1c9a7d7&language=en-USt
// GET /tv/{tv_id}
// https://api.themoviedb.org/3/tv/2316?api_key=8891d5cefed0da21234ba062e1c9a7d7&language=en-US

// GET /tv/{tv_id}/season/{season_number}
// https://api.themoviedb.org/3/tv/2316/season/1?api_key=8891d5cefed0da21234ba062e1c9a7d7&language=en-US

const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");
const key = 'acbad60592304493a8bc92ef6cbe3f78';
const endpoint = 'https://text-analytics-ucb-datathon.cognitiveservices.azure.com/';

const textAnalyticsClient = new TextAnalyticsClient(endpoint,  new AzureKeyCredential(key));

async function sentimentAnalysis(client){

  const sentimentInput = [
      "This product was absolutely terrible and I would never recommend this to anyone. Please remove this from the store immediately."
  ];
  const sentimentResult = await client.analyzeSentiment(sentimentInput);

  sentimentResult.forEach(document => {
      console.log(`ID: ${document.id}`);
      console.log(`\tDocument Sentiment: ${document.sentiment}`);
      console.log(`\tDocument Scores:`);
      console.log(`\t\tPositive: ${document.confidenceScores.positive.toFixed(2)} \tNegative: ${document.confidenceScores.negative.toFixed(2)} \tNeutral: ${document.confidenceScores.neutral.toFixed(2)}`);
      console.log(`\tSentences Sentiment(${document.sentences.length}):`);
      document.sentences.forEach(sentence => {
          console.log(`\t\tSentence sentiment: ${sentence.sentiment}`)
          console.log(`\t\tSentences Scores:`);
          console.log(`\t\tPositive: ${sentence.confidenceScores.positive.toFixed(2)} \tNegative: ${sentence.confidenceScores.negative.toFixed(2)} \tNeutral: ${sentence.confidenceScores.neutral.toFixed(2)}`);
      });
  });
}

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
  if (props.data.id === 7089) {
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
       <td data-value={index}> {index} </td>
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
      <div style={{marginLeft: '10%'}}>
        <p>Episode Number</p>
      </div>
      <div style={{width: '100%'}}>
        <div style={{width: '10%', float: 'left'}}>
          <p>Season Number</p>
        </div>
        <div style={{marginLeft: '10%'}}>
          <RenderTable data={values}/>
        </div>
      </div> 
    </div>
  );
}

function App() {
  sentimentAnalysis(textAnalyticsClient);
  return (
    <div className="App">
      <header className="App-header"></header>
      <div><Page /></div>
    </div>
  );
}

export default App;
