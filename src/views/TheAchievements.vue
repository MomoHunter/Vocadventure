<template>
  <div class="page">
    <HeroBasic title="achievementsTitle" />
    <div class="flex-grow">

    </div>
    <div class="button-container">
      <ButtonBasic class="width-full" color="red" icon="arrow-left" text="achievementsButton1"
                   @click="$router.push({ name: 'menu', query: { sub: 'adventure' } })" />
    </div>
  </div>
</template>

<script>
import HeroBasic from '@/components/HeroBasic.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'

export default {
  name: 'TheAchievements',
  components: {
    HeroBasic,
    ButtonBasic
  }
}
</script>
