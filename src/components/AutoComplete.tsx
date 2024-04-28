import { useThemeProps } from '@mui/material'
import React, { useEffect } from'react'
import searchIcon from '../images/search.svg'
import crossIcon from '../images/cross.svg'
import { CountryData, SearchCountryResponse } from '../types'
import { Spinner } from './Spinner'


export interface AutoCompleteProps<T> {
    overrideStyles?: Record<string, string>
    loadingResults?: boolean
    searchResults?: T[]
    searchResultCustomRenderer?: (item: T, onClick: () => void) => React.ReactNode
    onQueryChange: (value: string) => void
    value?: string
    onSelect: (value: string) => void
    clearable?: boolean
}

const DEFAULT_STYLES = {
    height: '40px',
    width: '600px',
    borderRadius: '8px',
    border: '1px solid lightgray',
    padding: '8px 12px',
}

interface SearchResultsProps<T extends CountryData> extends Pick<AutoCompleteProps<T>, 'searchResults' | 'searchResultCustomRenderer' | 'overrideStyles'> {
    onResultClick: (selectedItem: string) => void
    searchQuery?: string
    shouldShowNoResults?: boolean
}

// TODO: Future Improvement - Infinite scrolling support can be added to handle cases when searched results can be a very high number
// So to ensure that all the results don't get rendered at the same time - infinite scrolling can be used along with a paginated api

function SearchResults<T extends CountryData>(props: SearchResultsProps<T>) {

    const { searchResults, onResultClick, searchResultCustomRenderer, overrideStyles = {}, searchQuery, shouldShowNoResults } = props

    return searchResults && searchResults.length > 0 ? (
        <div style={{ width: overrideStyles.width }} className='search-item-popover-container'>
            {
                searchResults.map((searchItem: T) => {
                    // Provides support to render search item in a customizable way
                    if(searchResultCustomRenderer){
                        return searchResultCustomRenderer(searchItem, () => onResultClick(`${searchItem.name.official} (${searchItem.name.common})`))
                    }else{
                        return (
                            <div className='search-item-wrapper'>{searchItem.name.official}</div>
                        )
                    }
                })
            }
        </div>
    ) : shouldShowNoResults ? (
        <div className='search-item-popover-container'><div className='no-results-found'>No results found</div></div>
    ) : null
}

export function AutoComplete<T extends CountryData>(props: AutoCompleteProps<T>){

    const { overrideStyles, loadingResults, searchResults, onQueryChange, searchResultCustomRenderer, value, onSelect, clearable = true } = props

    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)

    const [selectedValue, setSelectedValue] = React.useState<string | undefined>(value || '')

    // overrideStyles - Allows parent component to override the styles of the auto complete component and cusomize according to the use case
    const inputStyles = {
        ...DEFAULT_STYLES,
        ...overrideStyles
    }

    const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onQueryChange(e.target.value)
        setIsPopoverOpen(false)
        setSelectedValue(e.target.value)
    } 

    const handleResultSelection = React.useCallback((selectedItem: string) => {
        setSelectedValue(selectedItem)
        onSelect(selectedItem)
        setIsPopoverOpen(false)
    }, [])

    const handleBlur = () => {
        setTimeout(() => {
            setIsPopoverOpen(false)
        }, 300)
    }

    const handleFocus = () => {
        setIsPopoverOpen(true)
    }

    useEffect(() => {
        setIsPopoverOpen(true)
    }, [searchResults])

    const shouldShowNoResults = Boolean(!searchResults?.length && selectedValue && !loadingResults)

    const handleInputClear = () => {
        onSelect('')
        onQueryChange('')
        setIsPopoverOpen(false)
        setSelectedValue('')
    }

    const getIconComponent = () => {
        if(loadingResults){
            return <Spinner />
        }else if(!selectedValue){
            return <img className='search-icon' src={searchIcon} />
        }else if(clearable && selectedValue){
            return <img onClick={handleInputClear} className='cross-icon' src={crossIcon} />
        }

        return null
    }

    return(
        <div className='auto-complete-container'>
            <input onBlur={handleBlur} onFocus={handleFocus} value={selectedValue} placeholder='Search' style={inputStyles} onChange={handleQueryChange} className='auto-complete-input' type="text" />
            {getIconComponent()}
            {
                isPopoverOpen && (
                    <SearchResults<T> shouldShowNoResults={shouldShowNoResults} searchQuery={selectedValue} overrideStyles={inputStyles} searchResults={searchResults} onResultClick={handleResultSelection} searchResultCustomRenderer={searchResultCustomRenderer} />
                )
            }
        </div>
    )

}