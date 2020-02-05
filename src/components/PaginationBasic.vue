<template>
  <nav class="pagination" :class="getSizeClass('pagination')" role="navigation">
    <ul class="pagination-list">
      <li v-for="(page, index) in pagesArray" :key="index">
        <a :class="pageClass(page)" @click="$emit('click', page)" v-html="page"></a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'PaginationBasic',
  props: {
    pages: Number,
    currentPage: Number
  },
  data () {
    return {
      minPages: 6
    }
  },
  computed: {
    pagesArray () {
      let values = []

      for (let i = 1; i <= this.pages; i++) {
        values.push(i)
        if (this.pages > this.minPages && this.currentPage > 3 && i === 1) {
          values.push('&hellip;')
          i = this.currentPage - 2
        } else if (this.pages > this.minPages && i > this.currentPage &&
                   this.currentPage + 2 < this.pages && i < this.pages) {
          values.push('&hellip;')
          i = this.pages - 1
        }
      }
      return values
    }
  },
  methods: {
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    },
    pageClass (page) {
      switch (page) {
        case '&hellip;':
          return 'pagination-ellipsis'
        case this.currentPage:
          return 'pagination-link is-current'
        default:
          return 'pagination-link'
      }
    }
  }
}
</script>
