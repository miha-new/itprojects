<template lang="pug">
  .confirm-mask(
    v-if="show"
  )
    .confirm-box
      .confirm-text {{ text }}
      button.btn.btn-danger(
        @click="confirm(true)"
      ) Да
      button.btn.btn-primary(
        @click="confirm(false)"
      ) Нет
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  },
  methods: {
    confirm(value) {
      this.$emit('confirm',value)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/scss/_variables';

  .confirm-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba($black,.5);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: default;
    .confirm-box {
      max-width: 520px;
      margin: 1.25rem .75rem;
      padding: .75rem 1.25rem;
      background-color: $white;
      border: 1px solid darken($white,5%);
      border-radius: .5rem;
      box-shadow: 0 .25rem .5rem rgba($black,.05);
      text-align: center;
    }
    .confirm-text {
      font-size: 1rem;
      line-height: 1.5;
      color: $dark;
      margin-top: .5rem;
      margin-bottom: 1.25rem;
      text-align: left;
    }
    .btn {
      width: 70px;
      margin-right: 1rem;
      margin-bottom: .5rem;
    }
  }
</style>