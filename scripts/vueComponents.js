Vue.component('basic-button', {
  props: {
    icon: String,
    text: String
  },
  template: `
    <a class="button is-rounded is-outlined is-fullwidth" v-bind:class="getClass('button')">
      <span class="icon">
        <i class="fas" v-bind:class="icon"></i>
      </span>
    <span>{{ getText(text) }}</span>
  </a>
  `
});