<template lang="pug">
  .page-note
    .container
      .section
        //- Кнопка вернутся назад
        router-link.btn.btn-back(
          to="/"
        )
          i.icon-left
          span Назад
        //- Кнопки управления историей изменений
        .btn-group-changes
          .btn-group-text Изменения:
          button.btn.btn-prev(
            title="Предыдущее изменение"
            :disabled="isFirstChange"
            @click="prevChange"
          )
            i.icon-left
          button.btn.btn-next(
            title="Следующее изменение"
            :disabled="isLastChange"
            @click="nextChange"
          )
            i.icon-right
      .section
        //- Карточка заметки
        card-note(
          v-if="history.length"
          :value="history[current]"
          :editable="true"
          :valid.sync="valid"
          @change="updateHistory"
          @delete="$router.push('/')"
        )
      .section
        //- Кнопки сохранить/удалить
        button.btn.btn-primary(
          @click="saveNote"
        ) Сохранить
        button.btn.btn-danger.ml-auto(
          v-if="!isCreate"
          @click="openConfirmDelete"
        ) Удалить
        //- Диалоговое окно подтверждения удаления заметки
        confirm(
          v-model="confirm.delete.show"
          :text="confirm.delete.text"
          @accept="acceptConfirmDelete"
        )
    //- Диалоговое окно подтверждения ухода без сохранения
    confirm(
      v-model="confirm.leave.show"
      :text="confirm.leave.text"
      @accept="acceptConfirmLeave"
    )
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import CardNote from '@/components/CardNote'

  export default {
    props: {
      id: [String, Number]
    },
    components: {
      CardNote
    },
    data: () => ({
      current: -1,
      history: [],
      confirm: {
        leave: {
          show: false,
          text: 'Вы действительно хотите покинуть страницу без сохранения?'
        },
        delete: {
          show: false,
          text: 'Вы действительно хотите удалить заметку?'
        }
      },
      valid: false,
      routeLeave: null
    }),
    computed: {
      ...mapState({
        notes: state => state.notes
      }),
      // Если нет id значит это страница создания заметки
      isCreate() {
        return this.id === undefined
      },
      // Текущая заметка по значению id
      note() {
        return this.notes.find(note => note.id == this.id)
      },
      // Шаблон новой заметки
      newNote() {
        return { title: '', todos: [{ done: false, text: '' }] }
      },
      isFirstChange() {
        return this.current < 1
      },
      isLastChange() {
        return this.current >= this.history.length - 1
      }
    },
    mounted() {
      // Инициализация данных заметки
      this.initNote()
    },
    // Хук ухода на другую страницу
    beforeRouteLeave(to, from, next) {
      const note = this.isCreate ? this.newNote : this.note
      const hasChange = !this.isSame(note, this.history[this.current])
      if (hasChange && !this.isValidForm()) {
        this.routeLeave = to
        this.openConfirmLeave()
        next(false)
      } else {
        next()
      }
    },
    methods: {
      ...mapActions({
        createNote: 'createNote',
        editNote: 'editNote',
        removeNote: 'removeNote'
      }),
      // Сравнивает два значения
      isSame(a, b) {
        return JSON.stringify(a) == JSON.stringify(b)
      },
      // Открывает диалоговое окно подтверждения (удалить)
      openConfirmDelete() {
        this.confirm.delete.show = true
      },
      // Проверяем подтверждение действия (удалить)
      acceptConfirmDelete(value) {
        if (value) {
          this.removeNote(this.note)
          this.$router.replace('/')
        }
      },
      // Открывает диалоговое окно подтверждения (уход без сохранения)
      openConfirmLeave() {
        this.confirm.leave.show = true
      },
      // Проверяем подтверждение действия (уход без сохранения)
      acceptConfirmLeave(value) {
        if (value) {
          this.current = 0
          this.$router.push(this.routeLeave)
        } else {
          this.routeLeave = null
        }
      },
      // Инициализация заметки
      initNote() {
        const note = this.isCreate ? this.newNote : this.note
        if (note) {
          this.updateHistory(note)
        } else {
          this.$router.replace('/')
        }
      },
      // Обновляем историю изменений
      updateHistory(note) {
        const index = this.current + 1
        const count = this.history.length - index
        this.history.splice(index, count, note)
        this.current = index
      },
      // Отменить изменение
      prevChange() {
        this.current -= 1
        this.valid = true
      },
      // Вернуть отмененое изменение
      nextChange() {
        this.current += 1
        this.valid = true
      },
      // Проверка на валидность формы
      isValidForm() {
        const note = this.history[this.current]
        const isValidTitle = !!note.title
        const isValidTodos = note.todos.every(todo => !!todo.text)
        return isValidTitle && isValidTodos
      },
      // Сохранить заметку
      saveNote() {
        setTimeout(() => {
          this.valid = true
          if (this.isValidForm()) {
            const note = this.history[this.current]
            if (this.isCreate) {
              this.createNote(note)
            } else {
              this.editNote(note)
            }
            this.$router.push('/')
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  @import '@/assets/scss/_variables';

  .page-note {
    padding-top: .75rem;
    padding-bottom: .75rem;
    .btn-group-changes {
      display: flex;
      flex-wrap: wrap;
      margin-left: auto;
      user-select: none;
      .btn-group-text {
        font-size: 14px;
        line-height: 20px;
        color: $secondary;
      }
      .btn-prev,
      .btn-next,
      .btn-clear {
        margin-left: .5rem;
      }
      .btn-prev,
      .btn-next {
        &:focus,
        &:hover {
          .icon-right,
          .icon-left {
            background-color: darken($warning,5%);
          }
        }
        .icon-right,
        .icon-left {
          background-color: $warning;
          border-color: darken($warning,5%);
          transition: background-color .15s ease-in-out;
          &:not(:first-child) {
            margin-left: .25rem;
          }
          &:not(:last-child) {
            margin-right: .25rem;
          }
          &::before {
            border-color: $white;
          }
        }
      }
    }
    .btn-primary,
    .btn-danger {
      width: 135px;
    }
  }
</style>