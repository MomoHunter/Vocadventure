<template>
  <div class="modal is-active" v-if="show">
    <div class="modal-background"></div>
    <div class="modal-content">
      <article class="message is-10 is-centered" :class="[getSizeClass('message'), options.color]">
        <div class="message-header">
          <p>{{ getText(options.title) }}</p>
          <button class="delete" aria-label="delete" :class="getSizeClass('button')"
                  @click="$emit('click', 'close')"></button>
        </div>
        <div class="message-body">
          <div class="flexContainer">
            <div class="content is-full marginBottomBig" :class="getSizeClass('content')" v-html="getText(options.text)"></div>
            <ButtonBasic class="is-half is-left" :icon="options.leftIcon" :text="options.leftText"
                         :color="options.leftColor" @click="$emit('click', 'buttonLeft')" />
            <ButtonBasic class="is-half is-right" :icon="options.rightIcon" :text="options.rightText"
                         :color="options.rightColor" @click="$emit('click', 'buttonRight')" />
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script>
import ButtonBasic from '@/components/ButtonBasic.vue'

export default {
  name: 'ModalMessage',
  components: {
    ButtonBasic
  },
  props: {
    show: Boolean,
    options: Object
  },
  methods: {
    getText (id) {
      return this.$store.getters.getText(id)
    },
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    }
  }
}
</script>

<style lang="scss" scoped>
.flexContainer {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  .is-full {
    width: 100%;
  }

  .is-half {
    width: calc(50% - .25rem);
  }

  .is-left {
    margin-right: .25rem;
  }

  .is-right {
    margin-left: .25rem;
  }
}

.is-10 {
  width: calc(100% / 1.2);
}

.is-centered {
  margin: 0 auto;
}
</style>
