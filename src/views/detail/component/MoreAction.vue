<template>
  <div class="more-action">
    <!-- 用户对文章的态度, -1: 无态度，0-不喜欢，1-点赞 -->
    <van-button
      :icon="article.attitude === 1 ? 'star' : 'star-o' "
      round
      :loading="false"
      type="danger"
      @click="handleLike"
    >点赞</van-button>

    <van-button
      icon="delete"
      round
      :loading="false"
      type="danger"
    >不喜欢</van-button>
  </div>
</template>

<script>
import { likeArticle, unLikeArticle } from '@/api/article'
export default {
  props: ['article'],
  methods: {
    // 点赞和取消点赞
    async handleLike () {
      // 判断是否登录
      if (!this.$checkLogin()) {
        return
      }

      // 点赞或者取消点赞
      try {
        // 用户对文章的态度, -1: 无态度，0-不喜欢，1-点赞
        if (this.article.attitude === 1) {
          // 当前已经点赞，取消点赞
          await unLikeArticle(this.article.art_id)
          this.article.attitude = -1
        } else {
          await likeArticle(this.article.art_id)
          this.article.attitude = 1
        }
      } catch (err) {
        this.$toast.fail('操作失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.more-action {
  padding: 20px;
  display: flex;
  justify-content: space-around;
}
</style>