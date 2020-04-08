<template lang="pug">
  .card(
    @click.self="goToEdit(note)"
  )
    .wrap-title
      .title {{ note.title }}
      button.btn.btn-delete(
        title="Удалить"
        @click.stop="deleteNote(note)"
      )
        i.icon-delete-large
      confirm(
        :show="confirm.delete.show"
        :text="confirm.delete.text"
        @confirm="confirmDeleteNote"
      )
    .todo(
      v-for="todo in previewTodos"
      :class="classTodoDone(todo)"
    )
      i.icon-checked
      .todo-text {{ todo.desc }}
    .todo-count Всего: {{ note.todos.length }}
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    props: {
      note: {
        type: Object,
        required: true
      }
    },
    data: () => ({
      confirm: {
        delete: {
          show: false,
          text: 'Вы действительно хотите удалить заметку?'
        }
      }
    }),
    computed: {
      previewTodos() {
        return this.note.todos.slice(0,3)
      }
    },
    methods: {
      ...mapActions('notes',{
        removeNote: 'removeNote'
      }),
      goToEdit(note) {
        const name = 'edit'
        const params = { id: note.id }
        this.$router.push({ name, params })
      },
      classTodoDone(todo) {
        return { done: todo.done }
      },
      deleteNote() {
        this.confirm.delete.show = true
      },
      confirmDeleteNote(value) {
        this.confirm.delete.show = false
        if (value) {
          this.removeNote(this.note)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/_variables';

  .card {
    cursor: pointer;
    user-select: none;
    .wrap-title {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 1.25rem;
      pointer-events: none;
      .title {
        flex-basis: 0;
        flex-grow: 1;
        max-width: 100%;
        color: $dark;
        padding: .125rem 0;
        font-size: 1.5rem;
        line-height: 1.5;
        font-weight: 500;
        text-transform: uppercase;
        border: none;
      }
      .btn-delete {
        margin-left: .75rem;
        pointer-events: auto;
      }
      .confirm-mask {
        pointer-events: auto;
      }
    }
    .todo {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      align-content: center;
      padding: .125rem 2.25rem;
      background-color: $light;
      border: 1px solid darken($white,5%);
      border-radius: .5rem;
      margin-bottom: .75rem;
      pointer-events: none;
      &.done {
        .icon-checked {
          &::before {
            border-color: $success;
          }
        }
      }
      .todo-text {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      .icon-checked {
        position: absolute;
        top: calc(50% - 10px);
        left: 8px;
        background-color: transparent;
        border-color: $secondary;
        &::before {
          border-color: transparent;
        }
      }
    }
    .todo-count {
      display: inline-flex;
      font-size: 1rem;
      line-height: 1.25;
      margin-top: .75rem;
      margin-bottom: .75rem;
      color: $secondary;
      pointer-events: none;
    }
  }
</style>