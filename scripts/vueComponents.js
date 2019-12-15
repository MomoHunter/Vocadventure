Vue.component('basic-button', {
  props: {
    icon: String,
    text: String
  },
  template: `
    <a class="button is-rounded is-outlined is-fullwidth" v-on:click="$emit('nav')">
      <span class="icon">
        <i class="fas" v-bind:class="icon"></i>
      </span>
    <span>{{ text }}</span>
  </a>
  `
});