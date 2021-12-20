<script>
import { computed } from '@vue/reactivity'
export default {
    name: 'SummaryDetails',
    props: {
        label: {
            type: String,
            required: true,
        },
        labelA: {
            type: String,
            required: true,
        },
        labelB: {
            type: String,
            required: true,
        },
        casesA: {
            type: Number,
            required: true,
        },
        casesB: {
            type: Number,
            required: true,
        },
        deathsA: {
            type: Number,
            required: true,
        },
        deathsB: {
            type: Number,
            required: true,
        },
    },
    setup({ casesA, casesB, deathsA, deathsB }) {
        const casesDiff = computed(() => casesA - casesB)
        const casesIndicator = computed(() => {
            if (casesDiff.value > 0) {
                return '+'
            }

            return ''
        })
        const deathsDiff = computed(() => deathsA - deathsB)
        const deathsIndicator = computed(() => {
            if (deathsDiff.value > 0) {
                return '+'
            }

            return ''
        })
        const formatNumber = (number) => {
            return number.toLocaleString()
        }
        return {
            casesDiff,
            casesIndicator,
            deathsDiff,
            deathsIndicator,
            formatNumber,
        }
    },
}
</script>
<template>
    <h3>{{ label }}</h3>
    <h5>Cases</h5>
    <p>{{ labelA }}: {{ formatNumber(casesA) }}</p>
    <p>{{ labelB }}: {{ formatNumber(casesB) }}</p>
    <strong
        data-test="cases-indicator"
        :class="casesDiff > 0 ? 'trend--is-positive' : 'trend--is-negative'"
    >
        {{ casesIndicator }}
        {{ formatNumber(casesDiff) }}
    </strong>

    <h5 class="mt-5">Deaths</h5>
    <p>{{ labelA }}: {{ formatNumber(deathsA) }}</p>
    <p>{{ labelB }}: {{ formatNumber(deathsB) }}</p>
    <strong
        data-test="deaths-indicator"
        :class="deathsDiff > 0 ? 'trend--is-positive' : 'trend--is-negative'"
    >{{ deathsIndicator }}{{ formatNumber(deathsDiff) }}</strong>
</template>


<style lang="scss" scoped>
.trend {
    &--is-positive {
        color: #b02a37;
    }
    &--is-negative {
        color: #479f76;
    }
}
</style>