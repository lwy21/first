<template>
  <div class="hello">
    <h1>Hello world</h1>
    <pre class="class1">{{content}}</pre>
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data() {
      return {
        content: "HelloWord"
      };
    },
    mounted() {
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .class1 {
    color: red;
  }
</style>
