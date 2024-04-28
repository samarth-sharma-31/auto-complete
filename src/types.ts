
export interface FlagDetails {
    alt: string
    svg: string
}

export interface NameDetails {
    common: string
    official: string
}

export interface CountryData {
    flags: FlagDetails,
    name: NameDetails
}

export type SearchCountryResponse = CountryData[]