Vue.component('basic-button', {
  props: ['icon', 'color', 'text'],
  template: `
    <a class="button is-rounded is-outlined is-fullwidth" v-bind:class="getClass('button')">
      
    </a>
  `





    /*'<a class="button is-info is-rounded is-outlined is-fullwidth" v-bind:class="getClass(\'button\')"' +
    ' v-on:click="navigateTo(\'selection\',\'training\')">\n' +
    '<span class="icon">' +
    '<i class="fas fa-book"></i>' +
    '</span>' +
    '<span>{{ getText(\'menuButton1\') }}</span>' +
    '</a>'*/
});