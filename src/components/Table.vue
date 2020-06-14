<template>
  <div>
    <table style="z-index: 1000; position: absolute">
      <tr>
        <th
          v-for="h in header"
          :key="h">{{ h }}</th>
      </tr>
      <tr
        v-for="(b, index) in body"
        :key="index"
      >
        <td v-for="(item, i) in b" :key="i">{{ item }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  name: 'Table',
  props: ['header', 'body']
}
</script>

<style>

</style>