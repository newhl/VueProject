import request from '@/utils/request'

/**
 * 获取文章列表（登录和不登录）
 * @param {*} 参数 channel_id,timestamp,with_top
 */
export const getArticles = ({
  // 频道的id
  channel_id,
  // 时间戳
  timestamp,
  // 是否包含置顶1，0不包含
  with_top
}) => {
  return request.get('/app/v1_1/articles', {
    params: {
      channel_id,
      timestamp,
      with_top
    }
  })
}

// 不喜欢文章
export const dislikeArticle = (id) => {
  return request.post('/app/v1_0/article/dislikes', {
    // 文章的id
    target: id
  })
}

// 举报文章
export const reportArticle = ({
  // 文章的id
  target,
  // 举报类型
  // 举报类型： 0-其他问题，1-标题夸张，2-低俗色情，3-错别字多，4-旧闻重复，5-广告软文，6-内容不实，7-涉嫌违法犯罪，8-侵权'
  type
}) => {
  return request.post('/app/v1_0/article/reports', {
    target,
    type
  })
}

// 获取文章详情，id文章的id
export const getArticle = (id) => {
  return request.get(`/app/v1_0/articles/${id}`)
}

// 点赞  文章的id
export const likeArticle = (id) => {
  return request.post('/app/v1_0/article/likings', {
    target: id
  })
}

// 取消点赞
export const unLikeArticle = (id) => {
  return request.delete(`/app/v1_0/article/likings/${id}`)
}

// 不喜欢  上面有

// 取消不喜欢
export const unDislikeArticle = (id) => {
  return request.delete(`/app/v1_0/article/dislikes/${id}`)
}
