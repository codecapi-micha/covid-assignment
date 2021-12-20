import { getISODateTimeString } from '../utils/date'
import { sortByKey } from '../utils/sort'

const API_URL = 'https://api.covid19api.com'
const makeRequest = async (endpoint) => {
  await new Promise((resolve) => {
    setTimeout(resolve, 1000)
  })
  const request = await fetch(`${API_URL}${endpoint}`)
  return request.json()
}

const FetchCountries = async () => {
  const result = await makeRequest('/countries')
  return result.sort(sortByKey('Country'))
}

const FetchSummariesByCountryAndDateRange = async (
  countrySlug,
  startDate,
  endDate
) => {
  const result = await makeRequest(
    `/country/${countrySlug}?from=${getISODateTimeString(
      startDate
    )}&to=${getISODateTimeString(endDate)}`
  )
  return result.filter((entry) => entry.Province === '')
}

export { FetchCountries, FetchSummariesByCountryAndDateRange }
