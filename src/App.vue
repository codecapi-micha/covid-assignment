<script setup>
import CountrySelect from './components/CountrySelect.vue';
</script>

<template>
  <b-container>
    <b-row>
      <b-col cols="4">
        <CountrySelect></CountrySelect>
      </b-col>
      <b-col cols="8">
        <router-view></router-view>
      </b-col>
    </b-row>
  </b-container>
</template>
