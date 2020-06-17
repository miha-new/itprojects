<template lang="pug">
  //- Если заметка не редактируется
  .card(
    v-if="!editable"
    @click.self="goToEdit"
  )
    //- Заголовок
    .title(
      v-text="value.title"
    )
    //- Список дел
    .todo(
      v-for="todo in value.todos.slice(0,3)"
      :class="{done: todo.done}"
    )
      //- Маркер
      .custom-checkbox
        i.icon-checked
      //- Текст
      .todo-text {{todo.text}}
    //- Кнопка удаления заметки
    button.btn.btn-delete(
      @click.stop="openConfirm"
    )
      i.icon-delete-large
    //- Диалоговое окно подтверждения удаления заметки
    confirm(
      v-model="confirm.show"
      :text="confirm.text"
      @accept="acceptConfirm"
    )
  //- Если заметка редактируется
  .card(
    v-else
    :class="{editable}"
  )
    //- Заголовок
    .title(
      ref="title"
      v-text="value.title"
      contenteditable
      placeholder="Название"
      @input="validate('title')"
      @blur="changeTitle"
      @paste.prevent
    )
    //- Список дел
    .todo(
      v-for="(todo, index) in value.todos"
      :key="index"
      ref="todo"
    )
      //- Маркер
      label.custom-checkbox
        input.custom-input-control(
          type="checkbox"
          name="done"
          :value="todo.done"
          :checked="todo.done"
          @change="changeTodos($event, index)"
        )
        .custom-input-label
          i.icon-checked
      //- Текст
      .todo-text(
        v-text="todo.text"
        contenteditable
        placeholder="Описание"
        @input="validate('todo', index)"
        @blur="changeTodos($event, index)"
        @paste.prevent
      )
      //- Кнопка удаления пункта из списка дел
      button.btn.btn-delete(
        v-if="value.todos.length > 1"
        @click="deleteNoteTodo(index)"
      )
        i.icon-delete
    //- Кнопка добавления нового пункта в список дел
    button.btn.btn-add(
      @click="addTodo"
    )
      i.icon-add
      span Добавить
</template>

<script>
  import {mapActions} from 'vuex'

  export default {
    props: {
      value: {
        type: Object,
        required: true
      },
      editable: {
        type: Boolean,
        default: false
      },
      valid: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      confirm: {
        show: false,
        text: 'Вы действительно хотите удалить заметку?'
      }
    }),
    computed: {
      // Если нет id значит это страница создания заметки
      isCreate() {
        return this.value.id === undefined
      }
    },
    watch: {
      // Следим за изменением значения
      valid(value) {
        if (value) this.validateAll()
      }
    },
    methods: {
      ...mapActions({
        removeNote: 'removeNote'
      }),
      // Сравнивает два значения
      isSame(a, b) {
        return JSON.stringify(a) == JSON.stringify(b)
      },
      // Отправляет на страницу редактирования заметки
      goToEdit() {
        const path = `/edit/${this.value.id}`
        this.$router.push(path)
      },
      // Открывает диалоговое окно подтверждения
      openConfirm() {
        this.confirm.show = true
      },
      // Проверяем подтверждение действия
      acceptConfirm(value) {
        if (value) {
          this.removeNote(this.value)
        }
      },
      // Создает объект с внесеными изменениями и
      // отправляет их дальше на проверку
      changeTitle({target}) {
        const title = target.innerText
        this.emitValue({title})
      },
      // Создает объект с внесеными изменениями и
      // отправляет их дальше на проверку
      changeTodos({target}, index) {
        const todos = [...this.value.todos]
        const todo = {...todos[index]}
        if (target.name == 'done') {
          todo.done = !todo.done
        } else {
          todo.text = target.innerText
        }
        todos.splice(index, 1, todo)
        this.emitValue({todos})
      },
      // Добавляет новый пункт в список дел
      addTodo() {
        const todos = [...this.value.todos]
        const todo = {done: false, text: ''}
        todos.push(todo)
        this.emitValue({todos})
      },
      // Удаляет пункт из списка дел
      deleteNoteTodo(index) {
        const todos = [...this.value.todos]
        todos.splice(index, 1)
        this.emitValue({todos})
      },
      // Проверяет наличие изменений и
      // возвращает новое значение
      emitValue(change) {
        const value = {...this.value, ...change}
        if (!this.isSame(value, this.value)) {
          this.$emit('change', value)
        }
      },
      // Валидация поля
      validate(name, index) {
        let elem
        if (index !== undefined) {
          elem = this.$refs[name][index]
        } else {
          elem = this.$refs[name]
        }
        this.$nextTick(() => {
          if (!elem.innerText) {
            elem.classList.add('error')
          } else {
            elem.classList.remove('error')
          }
        })
      },
      // Валидация всех полей
      validateAll() {
        this.validate('title')
        for (let i = 0; i < this.$refs['todo'].length; i++) {
          this.validate('todo', i)
        }
        this.$emit('update:valid', false)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/_variables';

  .card {
    position: relative;
    color: $dark;
    text-decoration: none;
    user-select: none;
    &:not(.editable) {
      cursor: pointer;
      .title,
      .todo {
        pointer-events: none;
      }
    }
    [contenteditable] {
      &:focus {
        outline: 0;
      }
      &[placeholder] {
        &:before {
          content: '';
          pointer-events: none;
        }
        &:empty:before {
          content: attr(placeholder);
          color: $secondary; 
        }
      }
    }
    .title {
      flex-basis: 0;
      flex-grow: 1;
      max-width: 100%;
      color: $dark;
      padding: .25rem 0;
      margin-bottom: 1.25rem;
      font-size: 1.5rem;
      line-height: 1.25;
      font-weight: 500;
      text-transform: uppercase;
      border-top: 1px solid transparent;
      border-bottom: 1px solid transparent;
      transition: border-color $time ease-in-out;
      &:not([contenteditable]) {
        padding-right: 40px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
      &[contenteditable] {
        border-bottom-color: darken($white,5%);
        transition: border-color $time ease-in-out;
      }
      &.error {
        border-bottom-color: $danger;
      }
    }
    > .btn-delete {
      position: absolute;
      top: 17px;
      right: 20px;
    }
    .todo {
      position: relative;
      padding: .125rem 2.25rem;
      background-color: $light;
      border: 1px solid darken($white,5%);
      border-radius: .5rem;
      margin-bottom: .75rem;
      transition: border-color $time ease-in-out;
      &.error {
        border-color: $danger;
      }
      &.done {
        .icon-checked {
          &::before {
            border-color: $success;
          }
        }
      }
      > .btn-delete {
        position: absolute;
        top: 4px;
        right: 8px;
      }
      .todo-text {
        max-width: 100%;
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        &:not([contenteditable]) {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
      .custom-checkbox {
        position: absolute;
        top: 4px;
        left: 8px;
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
            cursor: pointer;
          }
        }
      }
      .icon-checked {
        position: absolute;
        top: 0;
        left: 0;
        background-color: transparent;
        border-color: $secondary;
        &::before {
          border-color: transparent;
        }
      }
    }
    .btn-add {
      margin-top: .75rem;
      margin-bottom: .75rem;
    }
  }
</style>