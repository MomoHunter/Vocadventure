Vue.component('basic-button', {
  props: {
    icon: String,
    text: String,
    show: Boolean
  },
  template: `
    <a class="button is-rounded is-outlined is-fullwidth" v-show="show" v-on:click="$emit('click')">
      <span class="icon">
        <i class="fas" v-bind:class="icon"></i>
      </span>
      <span>{{ text }}</span>
    </a>
  `
});

Vue.component('selection-button', {
  props: {
    text: [String, Number],
    show: Boolean
  },
  template: `
    <a class="button is-rounded is-fullwidth" v-show="show" v-on:click="$emit('click')">
      <span>{{ text }}</span>
    </a>
  `
});
