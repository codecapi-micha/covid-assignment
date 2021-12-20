import { createStore } from 'vuex'
import {
  FetchCountries,
  FetchSummariesByCountryAndDateRange,
} from '../api/covid19'
import { getISODateTimeString, getStartOfDayUTC } from '../utils/date'
export default createStore({
  state() {
    return {
      countries: [],
      countrySummaries: {},
      isLoading: false,
    }
  },
  mutations: {
    setLoading(state, isLoading) {
      state.isLoading = isLoading
    },
    setCountries(state, countries) {
      state.countries = countries
    },
    setCountrySummaryData(state, { countrySlug, countryData }) {
      if (!state.countrySummaries[countrySlug]) {
        state.countrySummaries = {
          ...state.countrySummaries,
          [countrySlug]: {},
        }
      }
      countryData.forEach((entry) => {
        state.countrySummaries[countrySlug] = {
          ...state.countrySummaries[countrySlug],
          [entry.Date]: entry,
        }
      })
    },
  },
  actions: {
    async fetchCountries({ commit, state }) {
      const countries = await FetchCountries()
      commit('setCountries', countries)
      return state.countries
    },
    async fetchSummariesByCountryAndDateRange(
      { commit, state },
      { countrySlug, startDate, endDate }
    ) {
      commit('setLoading', true)
      const countryData = await FetchSummariesByCountryAndDateRange(
        countrySlug,
        startDate,
        endDate
      )
      commit('setCountrySummaryData', { countrySlug, countryData })
      commit('setLoading', false)
    },
    async fetchSummariesForLastTwoMonthsByCountry(
      { commit, dispatch },
      { countrySlug }
    ) {
      const now = getStartOfDayUTC(new Date())
      now.setUTCDate(now.getUTCDate() - 1)
      const twoMonthsAgo = getStartOfDayUTC(new Date())
      twoMonthsAgo.setUTCMonth(twoMonthsAgo.getUTCMonth() - 2)

      await dispatch('fetchSummariesByCountryAndDateRange', {
        countrySlug,
        startDate: twoMonthsAgo,
        endDate: now,
      })
    },
  },
  getters: {
    getCountryBySlug(state) {
      return (countrySlug) =>
        state.countries.find((country) => country.Slug === countrySlug)
    },
    getSummaryForLastTwoDays(state, getters) {
      return (countrySlug) => {
        const yesterday = new Date()
        yesterday.setUTCDate(yesterday.getUTCDate() - 1)
        const twoDaysAgo = new Date()
        twoDaysAgo.setUTCDate(yesterday.getUTCDate() - 2)

        const yesterdaySummary = getters.getSummaryForCountryAndDate(
          countrySlug,
          yesterday
        )

        const twoDaysAgoSummary = getters.getSummaryForCountryAndDate(
          countrySlug,
          twoDaysAgo
        )

        return {
          yesterday: {
            confirmed: yesterdaySummary?.Confirmed ?? 0,
            deaths: yesterdaySummary?.Deaths ?? 0,
          },
          twoDaysAgo: {
            confirmed: twoDaysAgoSummary?.Confirmed ?? 0,
            deaths: twoDaysAgoSummary?.Deaths ?? 0,
          },
        }
      }
    },
    getSummaryForLastTwoMonths(state, getters) {
      return (countrySlug) => {
        const summary = {
          last30Days: {
            confirmed: 0,
            deaths: 0,
          },
          twoMonthsAgo: {
            confirmed: 0,
            deaths: 0,
          },
        }
        const yesterday = new Date()
        yesterday.setUTCDate(yesterday.getUTCDate() - 1)
        const twoMonthsAgo = new Date()
        twoMonthsAgo.setUTCDate(yesterday.getUTCDate() - 31)

        const yesterdaySummary = getters.getSummaryForCountryAndDate(
          countrySlug,
          yesterday
        )

        const twoDaysMonthsSummary = getters.getSummaryForCountryAndDate(
          countrySlug,
          twoMonthsAgo
        )

        return {
          last30Days: {
            confirmed: yesterdaySummary?.Confirmed ?? 0,
            deaths: yesterdaySummary?.Deaths ?? 0,
          },
          twoMonthsAgo: {
            confirmed: twoDaysMonthsSummary?.Confirmed ?? 0,
            deaths: twoDaysMonthsSummary?.Deaths ?? 0,
          },
        }
      }
    },
    getSummaryForCountryAndDate(state) {
      return (countrySlug, date) => {
        return state?.countrySummaries?.[countrySlug]?.[
          getISODateTimeString(getStartOfDayUTC(date))
        ]
      }
    },
  },
})
