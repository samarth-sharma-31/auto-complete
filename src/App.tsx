
import React from 'react'
import { AutoComplete } from './components/AutoComplete'
import { debounce } from './utils'
import { CountryData, SearchCountryResponse } from './types'
import "./styles.css";


// This method uses a public api to fetch list of countries
const fetchResults = (searchQuery: string): Promise<SearchCountryResponse> => {
  return new Promise((resolve, reject) => {
    fetch(`https://restcountries.com/v3.1/name/${searchQuery}?fields=name,flags&fullText=false`).then((response) => {
      // This adds an additional delay of 3s to observe loading beahviour and simulating slow network
      setTimeout(() => {
        resolve(response.json() as unknown as SearchCountryResponse)
      }, 1000)
    }).catch((error) => {
      reject(error)
    })
  })
}


const SEARCH_RESULTS_CACHE = {} as Record<string, CountryData[]>


export default function App() {

  const [searchResults, setSearchResults] = React.useState<SearchCountryResponse | undefined>()
  const [loadingResults, setLoadingResults] = React.useState(false)

  const [countrySelected, setCountrySelected] = React.useState<string | undefined>()
  const [searchQuery, setSearchQuery] = React.useState<string>('')


  const fetchCountries = React.useCallback(async (searchQuery: string) => {
    setLoadingResults(true)
    try{
      const countriesResponse = await fetchResults(searchQuery)
      // Set the response in cache for future usages
      SEARCH_RESULTS_CACHE[searchQuery] = countriesResponse;
      setSearchResults(countriesResponse)
    }catch (e) {
      // TODO: Add error handling suppport
      console.log(e)
    } finally {
      setLoadingResults(false)
    }
  }, [])


  const debouncedHandleQueryChange = React.useMemo(() => debounce((searchString: string) => {
    // Only make the search call when the length of the query is atleast 3 to ensure that the query is relatively
    // more meaningful
    // reset state
    setSearchQuery(searchString)
    setSearchResults([])
    setCountrySelected('')
    if(!searchString || searchString.length < 3){
      return;
    }

    // first check in cache if the results exist, if not then make the api call
    if(SEARCH_RESULTS_CACHE[searchString]){
      setSearchResults(SEARCH_RESULTS_CACHE[searchString])
      return;
    }else {
      fetchCountries(searchString)
    }
  }, 300), [fetchCountries])

  const renderCountryData = (countryData: CountryData, handleClick: () => void) => {
    const { name, flags } = countryData
    const highlightedCountryName = `${name.official} (${name.common})`.replace(new RegExp(searchQuery, "gi"), (match) => `<span class="highlight-text">${match}</span>`);

    return(
      <div onClick={handleClick} key={name.official} className={`country-item-wrapper ${countrySelected === name.official ? 'country-item-wrapper-selected' : 'country-item-wrapper-hover'}`}>
        <div className='flag-container'>
          <img className='flag-image' src={flags.svg} alt={flags.alt} />
        </div>
        <div className='name-container'dangerouslySetInnerHTML={{ __html: highlightedCountryName }}></div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <header className='page-heading'>Explore Countries</header>
      <AutoComplete onSelect={(value) => setCountrySelected(value)} searchResultCustomRenderer={renderCountryData} searchResults={searchResults} loadingResults={loadingResults} onQueryChange={debouncedHandleQueryChange} />
      {countrySelected && <div className='selected-country'>{`Selected Country: ${countrySelected}`}</div>}
    </div>
  );
}
