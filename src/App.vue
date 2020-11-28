<template>
  <main-page/>
</template>

<script>
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainPage from './MainPage.vue';

export default {
  name: 'App',
  components: {
    'main-page': MainPage
  }
}
</script>
