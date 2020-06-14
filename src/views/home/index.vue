<template>
  <div>
    <!-- 导航头 -->
    <van-nav-bar
      fixed
      title="黑马头条"
    />
    <!-- 频道列表 -->
    <van-tabs animated v-model="activeIndex">
      <!-- 小按钮，点击弹出频道管理的弹出层 -->
      <van-icon slot="nav-right" name="wap-nav" class="nav-btn" @click="showChannelEdit=true" />
      <!-- 遍历标签页，显示频道列表 -->
      <van-tab
        type="line"
        v-for="channel in channels"
        :title="channel.name"
        :key="channel.id">

        <!-- 下拉加载更多组件 -->
        <van-pull-refresh
          :success-text="successText"
          v-model="currentChannel.pullLoading"
          @refresh="onRefresh">
          <!-- 文章列表,不同的标签页下有不同的列表 -->
          <van-list
            v-model="currentChannel.loading"
            :finished="currentChannel.finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
          <!-- 点击cell跳转到文章详情页面 -->
            <van-cell
              @click="$router.push({ name: 'detail', params: { id: article.art_id.toString() } })"
              v-for="article in currentChannel.articles"
              :key="article.art_id.toString()"
              :title="article.title"
            >
              <div slot="label">
                <!-- grid 显示封面
                  article.cover.type   0 没有图片   1 1个图片 3 3个图片
                 -->
                <van-grid v-if="article.cover.type" :border="false" :column-num="3">
                  <van-grid-item
                    v-for="(img, index) in article.cover.images"
                    :key="img + index"
                  >
                    <van-image lazy-load height="80" :src="img" >
                      <!-- 图片的加载提示 -->
                      <template v-slot:loading>
                        <van-loading type="spinner" size="20" />
                      </template>
                      <!-- 自定义加载失败提示 -->
                      <template v-slot:error>加载失败</template>
                    </van-image>
                  </van-grid-item>
                </van-grid>
                <p>
                  <span>{{ article.aut_name }}</span>&nbsp;
                  <span>{{ article.comm_count }}评论</span>&nbsp;
                  <span>{{ article.pubdate | fmtDate }}</span>&nbsp;
                  <!-- 点击x按钮，记录当前的文章对象 -->
                  <van-icon name="cross" class="close" @click.stop="handleAction(article)" />
                </p>
              </div>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <!-- 弹出层组件-moreAction -->
    <!--
      v-model 等价于
      v-bind:value="showMoreAction"
      v-on:input="showMoreAction = $event"
     -->
     <!-- 如果article的值为null 不显示more-action -->
    <more-action
      v-if="currentArticle"
      @handleSuccess="handleSuccess"
      :article="currentArticle"
      v-model="showMoreAction"></more-action>

    <!-- 弹出频道管理 -->
    <channel-edit @last="handleLast" @activeChange="handleChange" :active="activeIndex" :channels="channels" v-model="showChannelEdit"></channel-edit>
  </div>
</template>

<script>
import { getDefaultOrUserChannels } from '@/api/channel'
import { getArticles } from '@/api/article'
import { getItem, setItem } from '@/utils/localStorage'
import Vue from 'vue'
import { Lazyload } from 'vant'

// 加载moreaction组件
import MoreAction from './components/MoreAction'
// 导入频道管理的组件
import ChannelEdit from './components/ChannelEdit'
// options 为可选参数，无则不传
Vue.use(Lazyload)

export default {
  name: 'Home',
  components: {
    MoreAction,
    ChannelEdit
  },
  data () {
    return {
      // // 列表用的数据
      // list: [],
      // loading: false,
      // finished: false,
      // 频道列表
      channels: [],
      // tab是组件中默认显示的tab项的索引
      // 通过该index，可以找到当前的频道对象
      activeIndex: 0,
      // 下拉更新完毕之后显示，成功的提示
      successText: '',
      showMoreAction: false,
      // 点击x的时候，记录的当前文章对象
      currentArticle: null,
      // 控制频道管理的弹出层显示隐藏
      showChannelEdit: false
    }
  },
  created () {
    console.log('created')
    // 加载频道列表
    this.loadChannels()
  },
  // keep-alive 生命周期函数
  activated () {
    // 在keep-alive缓存的组件被激活时触发
    console.log('activated')
  },
  deactivated () {
    // keep-alive缓存的组件停用时调用
    console.log('deactivated')
  },
  computed: {
    // 返回当前的频道对象
    currentChannel () {
      return this.channels[this.activeIndex]
    }
  },
  methods: {
    // 加载频道列表
    async loadChannels () {
      try {
        let channels = []
        // 1. 如果用户登录，发送请求，获取数据
        if (this.$store.state.user) {
          const data = await getDefaultOrUserChannels()
          channels = data.channels
        } else {
          // 2. 如果用户没有登录，先去本地存储中获取数据，如果没有数据再发送请求
          // 如果本地存储中没有值，获取的是null
          channels = getItem('channels')
          if (!channels) {
            const data = await getDefaultOrUserChannels()
            channels = data.channels
            // 存储到本地存储中
            setItem('channels', channels)
          }
        }

        // console.log(data)
        // 给所有的频道设置，时间戳和文章数组
        channels.forEach((channel) => {
          channel.timestamp = null
          channel.articles = []
          // 上拉加载
          channel.loading = false
          channel.finished = false
          // 下拉加载
          channel.pullLoading = false
        })
        this.channels = channels
      } catch (err) {
        console.log(err)
      }
    },
    // list组件的load
    async onLoad () {
      // 发送请求
      // 获取当前频道对象  --- 下面不需要写了，因为设置了一个当前频道的计算属性
      // const currentChannel = this.channels[this.activeIndex]
      //  当前频道对象 时间戳
      //  当前频道对象 文章数组
      const data = await getArticles({
        // 频道的id
        channel_id: this.currentChannel.id,
        // 时间戳
        timestamp: this.currentChannel.timestamp || Date.now(),
        // 是否包含置顶1，0不包含
        with_top: 1
      })

      // 记录文章列表，记录最后一条数据的时间戳
      this.currentChannel.timestamp = data.pre_timestamp
      // [[], []]
      this.currentChannel.articles.push(...data.results)
      // this.loading = false
      this.currentChannel.loading = false
      // 文章加载完毕
      // 如果某一个频道加载完毕，其它频道中的finished 也是加载完毕
      if (data.results.length === 0) {
        // this.finished = true
        this.currentChannel.finished = true
      }
    },
    // 下拉加载更多
    async onRefresh () {
      try {
        const data = await getArticles({
          // 频道的id
          channel_id: this.currentChannel.id,
          // 时间戳
          timestamp: Date.now(),
          // 是否包含置顶1，0不包含
          with_top: 1
        })

        // 设置加载完毕
        this.currentChannel.pullLoading = false
        // 把数据放到数组的最前面（最新数据）
        this.currentChannel.articles.unshift(...data.results)
        this.successText = `加载了${data.results.length}条数据`
      } catch (err) {
        console.log(err)
      }
    },
    // 点击x按钮，弹出MoreAction，并且记录对应的文章对象
    handleAction (article) {
      this.showMoreAction = true
      this.currentArticle = article
    },
    // more-action中操作成功执行的方法
    handleSuccess () {
      // 隐藏
      this.showMoreAction = false
      // 去掉当前的文章数据
      // this.currentArticle
      // 找到当前文章在数组中的索引
      // findIndex() 查找第一个满足条件的元素的索引
      const articles = this.currentChannel.articles
      const index = articles.findIndex((article) => {
        return article.art_id === this.currentArticle.art_id
      })
      // 删除指定位置的元素
      articles.splice(index, 1)
    },
    // 在频道管理组件中，点击我的频道，索引发生变化的时候执行
    handleChange (index) {
      this.activeIndex = index
      this.showChannelEdit = false
    },
    // 当频道管理删除的是，激活索引是数组最后一项的时候
    handleLast () {
      this.activeIndex--
    }
  }
}
</script>

<style lang="less" scoped>
// 在scoped中书写的样式，动态生成的标签或者子组件中不可用
// 深度作用选择器   /deep/
// .van-tabs /deep/ .van-tabs__content {
//   margin-top: 46px;
//   margin-bottom: 50px;
// }
// .van-tabs {
//   margin-top: 46px;
//   margin-bottom: 50px;
// }

.van-tabs {
  /deep/ .van-tabs__wrap {
    position: fixed;
    top: 46px;
    left: 0;
    right: 10px;
    z-index: 100;
  }
  /deep/ .van-tabs__content {
    margin-top: 90px;
    margin-bottom: 50px;
  }
}
.close {
  float: right;
}
.nav-btn {
  position: fixed;
  right: 10px;
  line-height: 44px;
  background-color: #fff;
  opacity: 0.8;
  font-size: 22px;
}
</style>
