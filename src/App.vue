<template>
  <div id="app">
    <LiveRoom/>
  </div>
</template>

<script>
import LiveRoom from './components/LiveRoom'

export default {
  name: 'App',
  components: {
    LiveRoom
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
