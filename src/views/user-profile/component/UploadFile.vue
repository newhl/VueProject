<template>
  <van-dialog
    :value="value"
    @input="$emit('input', $event)"
    :showConfirmButton="false"
    closeOnClickOverlay
  >
    <van-cell-group>
      <van-cell title="从相册选择图片" @click="handleSelectFile" />
      <input ref="file" type="file" style="display: none;">
      <van-cell title="拍照" />
      <van-cell title="取消" @click="$emit('input', false)" />
    </van-cell-group>
  </van-dialog>
</template>

<script>
import Vue from 'vue'
import { ImagePreview } from 'vant'

Vue.use(ImagePreview)

import { uploadPhoto } from '@/api/user'
export default {
  name: 'UploadFile',
  props: ['value'],
  methods: {
    // 点击从相册选择图片，弹出选择图片的对话框
    handleSelectFile () {
      this.$refs.file.click()

      // 给file注册onchange事件
      this.$refs.file.onchange = (e) => {
        // 如果没有选择文件，返回
        if (e.target.files.length === 0) {
          return
        }

        //  console.log(e.target.files[0])
        // 图片在内存中可以访问的临时路径
        const url = URL.createObjectURL(e.target.files[0])
        // console.log(url)
        // 关闭弹出对话框
        this.$emit('input', false)
        // 图片预览
        ImagePreview({
          images: [
            url
          ],
          // 不显示页码
          showIndex: false,
          onClose: this.handleUploadPhoto
        })
      }
    },
    // 上传头像
    handleUploadPhoto () {
      this.$dialog.confirm({
        message: '是否确认该图片作为头像'
      }).then(async () => {
        // 加载提示
        this.$toast.loading({
          duration: 0,       // 持续展示 toast
          forbidClick: true, // 禁用背景点击
          loadingType: 'spinner',
          message: '正在上传...'
        })

        // on confirm
        try {
          const data = await uploadPhoto('photo', this.$refs.file.files[0])
          // 更改当前的头像
          // console.log(data)
          // 通知父组件图片上传成功
          this.$emit('upload-success', data.photo)
          this.$toast.success('头像上传成功')
        } catch (err) {
          this.$toast.fail('头像上传失败')
        }

        // 关闭加载提示
        this.$toast.clear()
      }).catch(() => {
        // on cancel
      })
    }
  }
}
</script>

<style lang="less" scoped>
.van-cell__title {
  text-align: center;
}
</style>