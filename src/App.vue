<template lang="pug">
  #app
    //- router-view - точка в которой будет отображён компонент страницы
    router-view
</template>

<script>
  import {mapActions} from 'vuex'

  export default {
    created() {
      // Инициализируем данные заметок
      this.initNotes()
    },
    methods: {
      ...mapActions({
        initNotes: 'initNotes'
      })
    }
  }
</script>

<style lang="scss" src="./assets/scss/common.scss" />