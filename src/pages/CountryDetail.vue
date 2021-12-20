<template>
    <div class="mt-3">
        <div v-if="isLoading">Loading...</div>
        <div v-else>
            <h1>COVID-19 details for {{ country.Country }}</h1>
            <b-row>
                <b-col>
                    <summary-detail
                        label="Since yesterday"
                        labelA="Yesterday"
                        labelB="Two days ago"
                        :casesA="previousDay.yesterday.confirmed"
                        :casesB="previousDay.twoDaysAgo.confirmed"
                        :deathsA="previousDay.yesterday.deaths"
                        :deathsB="previousDay.twoDaysAgo.deaths"
                    ></summary-detail>
                </b-col>
                <b-col>
                    <summary-detail
                        label="Months"
                        labelA="Last month"
                        labelB="Two months ago"
                        :casesA="previousMonth.last30Days.confirmed"
                        :casesB="previousMonth.twoMonthsAgo.confirmed"
                        :deathsA="previousMonth.last30Days.deaths"
                        :deathsB="previousMonth.twoMonthsAgo.deaths"
                    ></summary-detail>
                </b-col>
            </b-row>
        </div>
    </div>
</template>

<script>
import { computed, defineComponent, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
import SummaryDetail from '../components/SummaryDetail.vue'

export default defineComponent({
    components: { SummaryDetail },
    name: 'CountryDetail',
    props: {
        countrySlug: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const { countrySlug } = toRefs(props)
        const store = useStore()
        const country = computed(() => store.getters.getCountryBySlug(countrySlug.value))

        const previousDay = computed(() => {
            return store.getters.getSummaryForLastTwoDays(countrySlug.value)
        })
        const previousMonth = computed(() => {
            return store.getters.getSummaryForLastTwoMonths(countrySlug.value)
        })

        const isLoading = computed(() => {
            return store.state.isLoading
        })

        watch(() => countrySlug.value, async () => {
            await store.dispatch('fetchSummariesForLastTwoMonthsByCountry', {
                countrySlug: countrySlug.value,
            })
        }, {
            immediate: true
        })

        return { country, store, previousDay, previousMonth, isLoading }
    },
})
</script>
