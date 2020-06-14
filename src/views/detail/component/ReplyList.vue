<template>
  <van-popup
    :value="value"
    @input="$store.commit('setShowReplyList', $event)"
    position="bottom"
    v-if="currentComment"
    :style="{ height: '80%' }"
  >
    <van-nav-bar
      :title="currentComment.reply_count + '条评论'"
    />

    <!-- 待评论的 内容 -->
     <van-cell>
      <div slot="icon">
        <img class="avatar" :src="currentComment.aut_photo" alt="">
      </div>
      <div slot="title">
        <span>{{ currentComment.aut_name }}</span>&nbsp;
        <van-tag>楼主</van-tag>
      </div>
      <div slot="default">
        <van-button icon="like-o" size="mini" plain>赞</van-button>
      </div>
      <div slot="label">
        <p>{{ currentComment.content }}</p>
        <p>
          <span>{{ currentComment.pubdate | fmtDate }}</span>
          ·
          <span>回复 {{ currentComment.reply_count }}</span>
        </p>
      </div>
    </van-cell>

    <!-- 评论的回复列表 -->
    <h3>回复列表</h3>
    <comment-list :isArticle="false" :id="currentComment.com_id.toString()"></comment-list>
  
    <!-- 发布评论 -->
    <send-comment :isArticle="false" :target="currentComment.com_id.toString()" :art_id="art_id"></send-comment>
  </van-popup>
</template>

<script>
import { mapState } from 'vuex'
import CommentList from './CommentList'
import SendComment from './SendComment'
import eventHub from '@/utils/eventHub'
export default {
  name: 'ReplyList',
  props: ['value', 'art_id'],
  components: {
    CommentList,
    SendComment
  },
  computed: {
    ...mapState(['currentComment'])
  },
  created () {
    eventHub.$on('sendSuccess', () => {
      this.currentComment.reply_count++
    })
  }
}
</script>

<style lang="less" scoped>
.avatar {
  width: 25px;
  height: 25px;
  border-radius: 100%;
  margin-right: 5px;
}
</style>