<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from 'vue-router'
import { isError } from '../api/api'
import TypeAheadSelectWithOverview from "./generic/TypeAheadSelectWithOverview.vue";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();

const countries = ref(null)

const getCountries = async () => {
  countries.value = null
  try {
    countries.value = await store.dispatch('fetchCountries')
  } catch (error) {
    countries.value = error
  }
}

onMounted(getCountries)
const handleCountrySelection = (country) => {
  router.push({
    name: 'CasesByCountry',
    params: {
      countrySlug: country.Slug
    },
  })
}

</script>

<template>
  <nav class="country-selection">
    <b-alert variant="danger" v-if="isError(countries)" show>
      Error while fetching countries.
      <a href="#" @click.prevent="getCountries()">Try again</a>
    </b-alert>
    <TypeAheadSelectWithOverview
      v-else
      :items="countries"
      itemKey="Slug"
      itemValue="Slug"
      itemLabel="Country"
      searchPlaceholder="Search by country"
      :searchProperties="['Country', 'Slug', 'ISO2']"
      @select="handleCountrySelection"
    >
      <template v-slot:label>Search</template>
    </TypeAheadSelectWithOverview>
  </nav>
</template>

<style lang="scss" scoped>
.country-selection {
  height: 100vh;
  overflow-y: scroll;
}
</style>