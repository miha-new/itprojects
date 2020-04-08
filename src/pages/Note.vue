<template lang="pug">
  .page-note
    confirm(
      :show="confirm.leave.show"
      :text="confirm.leave.text"
      @confirm="confirmLeaveNote"
    )
    .container
      .wrap
        router-link.btn.btn-back(
          to="/"
        )
          i.icon-left
          span Назад
        .btn-group-changes
          .btn-group-text Изменения:
          button.btn.btn-prev(
            title="Предыдущее изменение"
            :disabled="prevNoteDisabled"
            @click="prevNote"
          )
            i.icon-left
          button.btn.btn-next(
            title="Следующее изменение"
            :disabled="nextNoteDisabled"
            @click="nextNote"
          )
            i.icon-right
          button.btn.btn-clear(
            title="Очистить изменения"
            :disabled="clearNoteDisabled"
            @click="clearNote"
          )
            i.icon-clear
          confirm(
            :show="confirm.clear.show"
            :text="confirm.clear.text"
            @confirm="confirmClearNote"
          )
      .wrap
        .card(
          v-if="note.history.length"
        )
          .form-group-title
            input.input-control(
              type="text"
              name="title"
              placeholder="Название заметки"
              autocomplete="off"
              :value="note.history[note.curr].title"
              @input="checkValid($event,'title')"
              @change="changeNote($event,'title')"
            )
          .form-group-todo(
            v-for="(todo,index) in note.history[note.curr].todos"
          )
            .form-group-text
              label.custom-checkbox
                input.custom-input-control(
                  type="checkbox"
                  name="done"
                  :value="todo.done"
                  :checked="todo.done"
                  @change="changeNote($event,'todos',index)"
                )
                .custom-input-label
                  i.icon-checked
            input.input-control(
              type="text"
              name="desc"
              placeholder="Описание действия"
              autocomplete="off"
              :value="todo.desc"
              @input="checkValid($event,'todos')"
              @change="changeNote($event,'todos',index)"
            )
            .form-group-text(
              v-if="note.history[note.curr].todos.length > 1"
            )
              button.btn.btn-delete(
                @click="deleteNoteTodo(index)"
              )
                i.icon-delete
          button.btn.btn-add(
            @click="addNoteTodo"
          )
            i.icon-add
            span Добавить
      .wrap
        button.btn.btn-primary(
          @click="saveNote"
        ) Сохранить
        button.btn.btn-danger.ml-auto(
          v-if="!isCreatePage"
          @click="deleteNote"
        ) Удалить
        confirm(
          :show="confirm.delete.show"
          :text="confirm.delete.text"
          @confirm="confirmDeleteNote"
        )
</template>

<script>
  import { mapState, mapActions } from 'vuex'

  export default {
    props: {
      id: [String, Number]
    },
    data: () => ({
      note: {
        curr: 0,
        history: []
      },
      confirm: {
        leave: {
          show: false,
          text: 'Вы действительно хотите покинуть страницу без сохранения?'
        },
        clear: {
          show: false,
          text: 'Вы действительно хотите очистить внесенные изменения?'
        },
        delete: {
          show: false,
          text: 'Вы действительно хотите удалить заметку?'
        }
      },
      routeLeave: {}
    }),
    computed: {
      ...mapState('notes',{
        notes: state => state.notes
      }),
      isCreatePage() {
        return this.$route.name == 'create'
      },
      prevNoteDisabled() {
        return this.note.curr < 1
      },
      nextNoteDisabled() {
        return this.note.curr >= this.note.history.length - 1
      },
      clearNoteDisabled() {
        return this.note.history.length <= 1
      }
    },
    mounted() {
      const refreshBrowser = this.getRefreshBrowser()
      const note = this.getNote()
      const item = this.initNote()
      if (refreshBrowser && note) {
        this.note = note
      } else if (item) {
        this.addNoteItem(item)
      } else {
        this.$router.push('/')
      }
    },
    beforeRouteLeave(to,from,next) {
      const note = sessionStorage.getItem('note')
      this.routeLeave = to
      if (note) {
        this.confirm.leave.show = true
        next(false)
      } else {
        next()
      }
    },
    methods: {
      ...mapActions('notes',{
        createNote: 'createNote',
        editNote: 'editNote',
        removeNote: 'removeNote'
      }),
      getRefreshBrowser() {
        return sessionStorage.getItem('refreshBrowser') === 'true'
      },
      confirmLeaveNote(value) {
        this.confirm.leave.show = false
        if (value) {
          this.setNote()
          this.$router.push(this.routeLeave.path)
        }
      },
      initNote() {
        const createNote = { title: '', todos: [{ done: false, desc: '' }] }
        const editNote = this.notes.find(note => note.id == this.id)
        return this.isCreatePage ? createNote : editNote
      },
      getNote() {
        const note = sessionStorage.getItem('note')
        return note ? JSON.parse(note) : note
      },
      setNote(note) {
        if (note) {
          sessionStorage.setItem('note',JSON.stringify(note))
        } else {
          sessionStorage.removeItem('note')
        }
      },
      addNoteItem(item) {
        this.note.history.push(item)
        this.note.curr = this.note.history.length - 1
      },
      changeNote({target},name,index) {
        const isTodos = name == 'todos'
        const currItem = this.note.history[this.note.curr] 
        const changeItem = isTodos ? this.changeNoteTodos(target,index) : this.changeNoteTitle(target)
        const newItem = Object.assign({},currItem,changeItem)
        this.addNoteItem(newItem)
        this.setNote(this.note)
      },
      changeNoteTitle({value:title}) {
        return { title }
      },
      changeNoteTodos({name,value},index) {
        const isDesc = name == 'desc'
        const currItemTodos = this.note.history[this.note.curr].todos
        const currTodo = currItemTodos[index]
        const changeTodo = { [name]: isDesc ? value : value == 'false' }
        const newTodo =  Object.assign({},currTodo,changeTodo)
        const todos = Object.assign([],currItemTodos)
        todos.splice(index,1,newTodo)
        return { todos }
      },
      addNoteTodo() {
        const currItem = this.note.history[this.note.curr]
        const todos = Object.assign([],currItem.todos)
        const newTodo = { done: false, desc: '' }
        todos.push(newTodo)
        const changeItem = { todos }
        const newItem = Object.assign({},currItem,changeItem)
        this.addNoteItem(newItem)
        this.setNote(this.note)
      },
      deleteNoteTodo(index) {
        const currItem = this.note.history[this.note.curr]
        const todos = Object.assign([],currItem.todos)
        todos.splice(index,1)
        const changeItem = { todos }
        const newItem = Object.assign({},currItem,changeItem)
        this.addNoteItem(newItem)
        this.setNote(this.note)
      },
      prevNote() {
        this.note.curr -= 1
        this.setNote(this.note)
      },
      nextNote() {
        this.note.curr += 1
        this.setNote(this.note)
      },
      clearNote() {
        this.confirm.clear.show = true
      },
      confirmClearNote(value) {
        this.confirm.clear.show = false
        if (value) {
          const item = this.initNote()
          this.note.history = []
          this.setNote()
          this.addNoteItem(item)
        }
      },
      checkValid({ target },name) {
        const isTodos = name == 'todos'
        const isValid = target.value.trim() != ''
        const elem = isTodos ? target.parentNode : target
        isValid ? elem.classList.remove('error') : elem.classList.add('error');
      },
      isValidForm() {
        const note = this.note.history[this.note.curr]
        const isValidTitle = note.title.trim() != ''
        const isValidTodos = note.todos.map(todo => todo.desc.trim() != '')
        const isValidEveryTodos = isValidTodos.every(todo => todo)
        return isValidTitle && isValidEveryTodos
      },
      saveNote() {
        const note = this.note.history[this.note.curr]
        const isValidForm = this.isValidForm()
        if (!isValidForm) {
          const elemTitle = document.querySelector('input[name=title]')
          const elemTodos = document.querySelectorAll('input[name=desc]')
          this.checkValid({ target: elemTitle }, 'title')
          for (let i = 0; i < elemTodos.length; i++) {
            this.checkValid({ target: elemTodos[i] }, 'todos')
          }
        } else {
          if (this.isCreatePage) {
            this.createNote(note)
          } else {
            this.editNote(note)
          }
          this.setNote()
          this.$router.push('/')
        }
      },
      deleteNote() {
        this.confirm.delete.show = true
      },
      confirmDeleteNote(value) {
        this.confirm.delete.show = false
        if (value) {
          const note = this.note.history[this.note.curr]
          this.removeNote(note)
          this.setNote()
          this.$router.push('/')
        }
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
    .form-group-title {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 1.25rem;
      .input-control {
        font-size: 1.5rem;
        font-weight: 500;
        text-transform: uppercase;
        border: none;
        border-top: 1px solid transparent;
        border-bottom: 1px solid darken($white,5%);
        transition: border-color .15s ease-in-out;
        &.error {
          border-bottom-color: $danger;
        }
      }
    }
    .form-group-todo {
      display: flex;
      flex-wrap: wrap;
      align-content: center;
      background-color: $light;
      border: 1px solid darken($white,5%);
      border-radius: .5rem;
      margin-bottom: .75rem;
      transition: border-color .15s ease-in-out;
      &.error {
        border-color: $danger;
      }
      .form-group-text {
        line-height: 1;
        padding: .25rem .5rem;
      }
      .input-control {
        font-size: 1rem;
        font-weight: 400;
        border: none;
      }
    }
    .btn-add {
      margin-top: .75rem;
      margin-bottom: .75rem;
    }
    .custom-checkbox {
      position: relative;
      display: inline-flex;
      vertical-align: middle;
      .custom-input-control {
        position: absolute;
        left: 0;
        width: 1.25rem;
        height: 1.25rem;
        z-index: -1;
        opacity: 0;
        &:focus + .custom-input-label,
        &:hover + .custom-input-label {
          .icon-checked {
            border-color: $success;
          }
        }
        &:checked + .custom-input-label {
          .icon-checked {
            &::before {
              border-color: $success;
            }
          }
        }
      }
      .custom-input-label {
        min-height: 1.25rem;
        padding-left: 1.25rem;
        .icon-checked {
          position: absolute;
          top: 0;
          left: 0;
          background-color: transparent;
          border-color: $secondary;
          cursor: pointer;
          &::before {
            border-color: transparent;
          }
        }
      }
    }
    .input-control {
      flex-basis: 0;
      flex-grow: 1;
      max-width: 100%;
      padding-top: .25rem;
      padding-bottom: .25rem;
      line-height: 1.25;
      color: $dark;
      background-color: transparent;
      background-clip: padding-box;
      &:focus {
        outline: 0;
      }
      &::placeholder {
        color: $secondary;
      }
    }
  }
</style>