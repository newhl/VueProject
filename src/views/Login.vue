<template>
  <div>
    <!-- 导航头 -->
    <van-nav-bar
      title="登录"
    />
    <!-- 输入框 -->
    <van-cell-group>
      <!-- 使用VeeValidate
        1. 通过v-validate 设置验证的规则
        2. 设置文本框的name属性
        3. 展示验证错误信息
       -->
      <van-field
        v-validate="'required|digits:11'"
        name="mobile"
        :error-message="errors.first('mobile')"
        clearable
        v-model="user.mobile"
        left-icon="phone-o"
        placeholder="请输入手机号码" />
      <van-field
        v-validate="'required|digits:6'"
        name="code"
        :error-message="errors.first('code')"
        v-model="user.code"
        left-icon="star-o"
        placeholder="请输入验证码">
        <van-button slot="button" type="default" size="small">获取验证码</van-button>
      </van-field>
    </van-cell-group>
    <!-- 登录按钮 -->
    <div class="login-btn">
      <van-button
        :loading="loading"
        loading-type="spinner"
        loading-text="正在登录..."
        class="btn"
        type="info"
        @click="handleLogin">登录</van-button>
    </div>
  </div>
</template>

<script>
import { login } from '@/api/user'
import { mapMutations } from 'vuex'
export default {
  name: 'Login',
  data () {
    return {
      user: {
        mobile: '13911111111',
        code: '246810'
      },
      // 控制按钮是否显示正在登录
      loading: false
    }
  },
  created () {
    // 配置VeeValidate的自定义验证信息
    const dict = {
      custom: {
        // 验证的文本框
        mobile: {
          // 验证规则失败之后的提示信息
          required: '请输入手机号码',
          digits: '手机号码必须是11位的数字'
        },
        code: {
          required: '请输入验证码',
          digits: '验证码必须是6位的数字'
        }
      }
    }
    // or use the instance method
    this.$validator.localize('custom', dict)
  },
  methods: {
    ...mapMutations(['setUser']),
    // 点击按钮，处理登录
    async handleLogin () {
      this.loading = true
      try {
        // 表单验证
        // validate() 返回的是promise对象，所以可以使用await调用
        const valid = await this.$validator.validate()
        // 验证失败
        if (!valid) {
          this.loading = false
          return
        }
        // 验证成功
        const data = await login(this.user)
        // 存储登录的状态
        this.setUser(data)
        // 跳转到首页
        // 获取url上查询字符串 redirect
        // 如果获取到redirect，跳转到redirect指向的地址
        // 如果没有redirect跳转到首页

        this.$router.push(this.$route.query.redirect || '/')
        this.$toast.success('登录成功')
      } catch (err) {
        this.$toast.fail('登录失败')
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
.login-btn {
  padding: 20px;
  .btn {
    width: 100%;
  }
}
</style>
