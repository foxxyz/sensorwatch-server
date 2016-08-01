<template>
    <main>
        <h1>SensorWatch</h1>
        <p class="current">Current Temp: <span></span></p>
        <svg class="sensorchart" width="1000" height="600">
            <g class="x axis"></g>
            <g class="y axis"></g>
            <g class="plot"></g>
        </svg>
    </main>
</template>

<script>
export default {
    el: '#app',
    ready() {
        console.log('app is ready')
    }
}
</script>

<style lang="sass">
* {
    margin: 0;
    padding: 0;
}
body {
    font-family: Helvetica, Arial, sans-serif;
    background: #444;
    font-size: 2em;
    text-align: center;
    color: rgba(220,220,220, 0.6);
    text-shadow: 1px 6px 6px #444, 0 0 0 #000, 1px 6px 6px #444;
}
h1 {
    text-transform: uppercase;
    letter-spacing: -.1em;
}
</style>