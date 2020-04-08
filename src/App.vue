<template lang="pug">
  #app
    router-view
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    created() {
      this.getNotes()
    },
    methods: {
      ...mapActions('notes', {
        getNotes: 'getNotes'
      })
    }
  }
</script>

<style lang="scss" src="./assets/scss/common.scss" />