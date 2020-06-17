<template lang="pug">
  .page-home
    .container
      .section
        router-link.btn.btn-success(
          to="/create"
        ) Создать заметку
      //- Если есть заметки
      .section(
        v-if="notes.length"
      )
        card-note(
          v-for="note in notes"
          :key="note.id"
          :value="note"
        )
      //- Если нет заметок
      .section(
        v-else
      )
        .card
          .text Заметок не найдено
</template>

<script>
  import {mapState} from 'vuex'
  import CardNote from '@/components/CardNote'

  export default {
    components: {
      CardNote
    },
    computed: {
      ...mapState({
        notes: state => state.notes
      })
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/_variables';

  .page-home {
    padding-top: .75rem;
    padding-bottom: .75rem;
    .card {
      margin-top: 1rem;
      &:first-child {
        margin-top: 0;
      }
      .text {
        font-size: 1.5rem;
        line-height: 1.5;
        font-weight: 500;
        color: $dark;
        text-transform: uppercase;
        text-align: center;
      }
    }
  }
</style>