import React, { useState, useEffect } from "react";
import 'semantic-ui-css/semantic.min.css'
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

// async function sentimentAnalysis(client){

//   const sentimentInput = [
//       "This product was absolutely terrible and I would never recommend this to anyone. Please remove this from the store immediately."
//   ];
//   const sentimentResult = await client.analyzeSentiment(sentimentInput);

//   sentimentResult.forEach(document => {
//       console.log(`ID: ${document.id}`);
//       console.log(`\tDocument Sentiment: ${document.sentiment}`);
//       console.log(`\tDocument Scores:`);
//       console.log(`\t\tPositive: ${document.confidenceScores.positive.toFixed(2)} \tNegative: ${document.confidenceScores.negative.toFixed(2)} \tNeutral: ${document.confidenceScores.neutral.toFixed(2)}`);
//       console.log(`\tSentences Sentiment(${document.sentences.length}):`);
//       document.sentences.forEach(sentence => {
//           console.log(`\t\tSentence sentiment: ${sentence.sentiment}`)
//           console.log(`\t\tSentences Scores:`);
//           console.log(`\t\tPositive: ${sentence.confidenceScores.positive.toFixed(2)} \tNegative: ${sentence.confidenceScores.negative.toFixed(2)} \tNeutral: ${sentence.confidenceScores.neutral.toFixed(2)}`);
//       });
//   });
// }

function SearchBar(props) {
  return (
    <div class='center'>
    <form onSubmit={props.handleSubmit}>
      <div class="ui one column stackable center aligned page grid">
        <div class="column eight wide">
          <div class="ui fluid icon input" style={{marginTop:'8%'}}>
            <input type="text" name="show" placeholder="Search for a TV Show"/>
            <i class="search icon"></i>
          </div>
        </div>
      </div>
    </form>
    </div>
  );
}

function RenderTable(props) {
  if (props.data.query !== undefined && props.data.id === undefined) {
    if (props.data.timeout) {
      return (
      <div class="ui one column stackable center aligned page grid">
      <div class="column eight wide">
        <div class="ui segment">
          <p>Could not find TV Show</p>
        </div>
      </div>
    </div>
    )}
    return (
      <div class="ui one column stackable center aligned page grid">
        <div class="column eight wide">
          <div class="ui segment">
            <div class="ui active inverted dimmer">
              <div class="ui small text loader">Loading...</div>
            </div>
            <p></p><p></p><h1></h1>
          </div>
        </div>
      </div>
      );
  }
  if (props.data.id === undefined) {
    return (<p></p>);
    // return (<h1 style={{textAlign: 'center'}}>Please enter a search query for a valid tv show.</h1>)
  }
  if (Object.keys(props.data).length === 0 && props.data.constructor === Object) {
    return (<h1 style={{textAlign: 'center'}}>Enter a search query</h1>)
  }
  // TODO: GET RID OF THIS & add error handling for missing stuff
  if (props.data.id === 7089) {
    return (<h1 style={{textAlign: 'center'}}>Enter a search query</h1>)
  }

  let all_seasons = [];
  let season = <th rowSpan={props.data.num_seasons + 2}><p class="rotate">Season Number</p></th>;
  all_seasons.push(season);
  let max_episodes = 0;
  for (let i = 1; i <= props.data.num_seasons; i++) {
    let season_number = 'season' + i;
    max_episodes = max_episodes < props.data.seasons[season_number].length ? props.data.seasons[season_number].length : max_episodes; 
    season = <tr>
      <th>{i}</th>
      {props.data.seasons[season_number].map(index => (
       <td data-value={index}> {index} </td>
      ))}
    </tr>
    all_seasons.push(season);
  }

  let episode_header = [];
  episode_header.push(<th></th>)
  episode_header.push(<th></th>)
  for (let i = 1; i <= max_episodes; i++) {
    episode_header.push(<th>{i}</th>)
  }

  return (
    <div>
      <h1 class='medium text' style={{textAlign: 'center'}}>{props.data.name}</h1>
      <h2 style={{textAlign: 'center'}}>Average Rating Per Episode</h2>
      <br/>
      <div class="ui one column stackable center aligned page grid">
        <table>
          <th colSpan={max_episodes + 2}>Episode Number</th>
          <tbody>
          <tr>{episode_header}</tr>
          {all_seasons}
          </tbody>
        </table>
      </div>
      <br/>
    </div>
  );
}

function SimilarShows(props) {
  if (props.data.id === undefined) {
    return (<p></p>);
  }
  if (props.data.similarShows.length === 0) {
    return <h2 style={{textAlign: 'center'}}>No Similar Shows</h2>
  }

  let arr = []
  for (let i = 0; i < props.data.similarShows.length; i++) {
    arr.push(
      <div>
      <form onSubmit={props.handleSubmit}>
      <input class="ui button" type="submit" name="show" value={props.data.similarShows[i]}></input>
      </form>
      </div>
    )}
    return (
      <div>
        <h2 style={{textAlign: 'center'}}>Similar Shows</h2>
        <br />
        <div class="ui one column stackable center aligned page grid">
          <div class="ui segment">
            <div class="ui buttons">
              {arr}
            </div>
          </div>
        </div>
        <br />
      </div>
    );
}

function Reviews(props) {
  if (props.data.id === undefined) {
    return (<p></p>);
  }
  if (props.data.reviews === null) {
    return <h2 style={{textAlign: 'center'}}>No Reviews</h2>
  }
  return (
    <div class="ui two column centered grid divided">
      <div class="three column centered row">
        <div class="column">
          <h2 style={{textAlign: 'center'}}>Top Positive Review</h2> <br/>
          <p style={{textAlign: 'center'}} id='demo'><i>"{props.data.reviews.positive_quote}"</i></p>
          <p style={{textAlign: 'center'}}><i>-{props.data.reviews.positive_author}</i></p>
          <button onClick={() => props.handlePositiveReview(props.data.reviews)} class="basic ui button centered">
            Show full review
          </button>
        </div>

        <div class="column">
          <h2 style={{textAlign: 'center'}}>Top Critical Review</h2> <br/>
          <p id='test' style={{textAlign: 'center'}}><i>"{props.data.reviews.negative_quote}"</i></p>
          <p style={{textAlign: 'center'}}><i>-{props.data.reviews.negative_author}</i></p>
          <button onClick={() => props.handleNegativeReview(props.data.reviews)} class="basic ui button centered">
            Show full review
          </button>
        </div>
      </div>
    </div>
  );
} 

async function fetchId(query) {
  const url = ''.concat(baseURL, 'search/tv?api_key=', APIKEY, '&query=', encodeURIComponent(query), '&include_adult=false');
  let response = await fetch(url);
  let json_response = await response.json();
  let ret = [];
  if (json_response.total_pages !== 0) {
    ret[0] = json_response.results[0].id
    ret[1] = json_response.results[0].name
  }
  return json_response.total_pages !== 0 ? ret : null;
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

async function fetchSimilarShows(id) {
  let url = ''.concat(baseURL, 'tv/', id, '/similar?api_key=', APIKEY, '&language=en-US&page=1');
  let response = await fetch(url);
  let json_response = await response.json();
  let max = json_response.results.length < 5 ? json_response.results.length : 5;
  let similarShows = []
  while (similarShows.length !== max) {
    let random = Math.floor(Math.random() * json_response.results.length);
    if (!similarShows.includes(json_response.results[random].name)) {
      similarShows.push(json_response.results[random].name);
    }
  }
  return similarShows;
}

async function fetchReviews(id) {
  let url = ''.concat(baseURL, 'tv/', id, '/reviews?api_key=', APIKEY, '&language=en-US&page=1');
  let response = await fetch(url);
  let json_response = await response.json();
  if (json_response.results.length === 0) {
    return null;
  }
  let review = [];
  for (let i = 0; i < json_response.results.length; i++) {
    let values = [];
    const sentimentResult = await textAnalyticsClient.analyzeSentiment([json_response.results[i].content]);
    sentimentResult.forEach(document => {
      values.sentiment = document.sentiment;
      values.positive = document.confidenceScores.positive.toFixed(2);
      values.negative = document.confidenceScores.negative.toFixed(2);
      values.neutral = document.confidenceScores.neutral.toFixed(2);
      values.content = json_response.results[i].content
    });
    values.reviewer = json_response.results[i].author;
    review.push(values);
  }
  
  review.sort((a, b) => parseFloat(b.positive) - parseFloat(a.positive));
  let finalReview = [];
  let sentimentResult = await textAnalyticsClient.analyzeSentiment([review[0].content]);
  sentimentResult.forEach(document => {
    let prevMax = -1;
    let maxQuote = "";
    document.sentences.forEach(sentence => {
      let posScore = sentence.confidenceScores.positive.toFixed(2);
      if (prevMax < posScore) {
        prevMax = posScore;
        maxQuote = sentence.text;
      }
    });
    finalReview.positive_full = review[0].content;
    finalReview.positive_quote = maxQuote;
    finalReview.positive_author = review[0].reviewer;
  });
  

  review.sort((a, b) => parseFloat(b.negative) - parseFloat(a.negative));
  sentimentResult = await textAnalyticsClient.analyzeSentiment([review[0].content]);
  sentimentResult.forEach(document => {
    let prevMax = -1;
    let maxQuote = "";
    document.sentences.forEach(sentence => {
      let posScore = sentence.confidenceScores.negative.toFixed(2);
      if (prevMax <= posScore) {
        prevMax = posScore;
        maxQuote = sentence.text;
      }
    });
    finalReview.negative_full = review[0].content;
    finalReview.negative_quote = maxQuote;
    finalReview.negative_author = review[0].reviewer;
  });
  
  return finalReview;
}

function Page() {
  const [values, setValues] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    let newValues = {};
    newValues.submitted = true;
    newValues.entered = true;
    newValues.query = event.target.show.value;
    setValues(newValues);
  }

  useEffect (() => {
    async function fetchData() {
      let newValues = JSON.parse(JSON.stringify(values));
      const timer = setTimeout(() => {
        newValues.timeout = true;
        setValues(newValues);
        return;
      }, 7000);
      newValues.submitted = false;
      setValues(newValues);
      let ret = await fetchId(values.query);
      if (ret === null || ret[0] === 7089) {
        return;
      }
      clearTimeout(timer);
      
      let id = ret[0]
      newValues.id = id;
      newValues.name = ret[1];

      let numSeasons = await fetchNumSeasons(id);
      let seasons = await fetchSeasons(id, numSeasons);
      let similarShows = await fetchSimilarShows(id);
      let reviews = await fetchReviews(id);
      newValues.num_seasons = numSeasons;
      newValues.seasons = seasons;
      newValues.similarShows = similarShows;
      newValues.reviews = reviews;
      newValues.submitted = false;
      setValues(newValues);
    }
    fetchData();
    // return () => clearTimeout(timer);
  }, [values.submitted]);
  
  const handleNegativeReview = (event) => {
    if (event !== null) {
      let newValues = JSON.parse(JSON.stringify(values));
      newValues.reviews = event;
      newValues.reviews.negative_quote = newValues.reviews.negative_full;
      setValues(newValues);
    }
  }

  const handlePositiveReview = (event) => {
    if (event !== null) {
      let newValues = JSON.parse(JSON.stringify(values));
      newValues.reviews = event;
      newValues.reviews.positive_quote = newValues.reviews.positive_full;
      setValues(newValues);
    }
  }

  return (
    <div>
      <div style={{marginTop:'5%'}}>
        <h1 class='large text' style={{textAlign: 'center'}}>TV-Shows-Dashboard</h1>
      </div>
      
      <SearchBar handleSubmit={handleSubmit} />
      <br />
      <RenderTable data={values}/>
      <br />
      <SimilarShows data={values} handleSubmit={handleSubmit}/>
      <br />
      <Reviews data={values} handleNegativeReview={handleNegativeReview} handlePositiveReview={handlePositiveReview}/>
    </div>
  );
}

function App() {
  // sentimentAnalysis(textAnalyticsClient);
  return (
    <div className="App">
      <header className="App-header"></header>
      <div><Page /></div>
    </div>
  );
}

export default App;
