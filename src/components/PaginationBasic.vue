<template>
  <nav class="pagination" role="navigation">
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
  computed: {
    pagesArray () {
      let values = []

      for (let i = 1; i <= this.pages; i++) {
        values.push(i)
        if (this.pages > 8 && this.currentPage > 3 && i === 1) {
          values.push('&hellip;')
          i = this.currentPage - 2
        } else if (this.pages > 8 && i > this.currentPage && this.currentPage + 2 < this.pages && i < this.pages) {
          values.push('&hellip;')
          i = this.pages - 1
        }
      }
      return values
    }
  },
  methods: {
    pageClass (page) {
      if (page === '&hellip;') {
        return 'pagination-ellipsis'
      } else if (page === this.currentPage) {
        return 'pagination-link is-current'
      } else {
        return 'pagination-link'
      }
    }
  }
}
</script>
