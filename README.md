# tv-shows-dashboard

## Project Description
A web application that allows users to query for a TV show and then displays the lifetime of the TV show with episode summary statistics. Each query will return a table with columns as season numbers and rows as corresponding episodes for each season. In the table, we will display the rating (and other information tbd). The background color of the cell will be reflected according to the rating.

For example, a user can search for the show _The Good Place_. This would display the show name and tables rating:

**The Good Place**
|               | Season 1           | Season 2  | ...  |
| ------------- |:-------------:| -----:|-----:|
| Episode 1      | 8.4 | 6.8 |... |
| Episode 2      | 4.1      |   4.2 |... |
| Episode 3 | 7.7      |    7.25 | ... |
| ...  | ...      |    ... |... |


## API
We'll be using the [TMDB API](https://www.themoviedb.org/documentation/api) to fetch the TV show rating scores. We have a registered API key.

To use the API, we need to first get the TMDB TV show ID before searching for each season.
