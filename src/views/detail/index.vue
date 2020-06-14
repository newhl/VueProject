<template>
  <div>
    <!-- 头部导航 -->
    <van-nav-bar
      title="文章详情"
      fixed
      left-text="返回"
      @click-left="$router.back()"
    />
    <div class="article" v-if="article">
      <!-- 文章标题 -->
      <h2 class="article-title">{{ article.title }}</h2>
      <!-- 作者信息 -->
      <author-info :article="article"></author-info>
      <!-- 文章内容 -->
      <div class="article-content" v-html="article.content">
      </div>
      <!-- 点赞和取消 -->
      <more-action :article="article"></more-action>
      <!-- 评论列表 -->
      <comment-list :isArticle="true" :id="article.art_id.toString()"></comment-list>
      <!-- 发布评论 -->
      <send-comment :target="article.art_id.toString()" :isArticle="true"></send-comment>
      <!-- 回复的评论列表 -->
      <reply-list v-model="showReplyList" :art_id="id"></reply-list>
    </div>
  </div>
</template>

<script>
import { getArticle } from '@/api/article'
// 加载作者信息组件
import AuthorInfo from './component/AuthorInfo'
// 加载更多操作
import MoreAction from './component/MoreAction'
// 加载评论列表
import CommentList from './component/CommentList'
// 加载发布评论组件
import SendComment from './component/SendComment'
// 加载评论回复的组件
import ReplyList from './component/ReplyList'
import { mapState } from 'vuex'
export default {
  name: 'Detail',
  // 文章的id
  props: ['id'],
  components: {
    AuthorInfo,
    MoreAction,
    CommentList,
    SendComment,
    ReplyList
  },
  computed: {
    ...mapState(['showReplyList'])
  },
  data () {
    return {
      article: null
    }
  },
  created () {
    // 根据id，获取文章详情
    this.loadData()
  },
  methods: {
    // 加载文章详情
    async loadData () {
      try {
        const data = await getArticle(this.id)
        this.article = data
      } catch (err) {
        this.$toast.fail('获取文章详情失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.article {
  margin-top: 48px;
  padding: 0px 20px;
  .article-title {
    font-size: 20px;
    font-weight: bold;
  }
  .article-content {
    font-size: 14px;
  }
}
</style>
