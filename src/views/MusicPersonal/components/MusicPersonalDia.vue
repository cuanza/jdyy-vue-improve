<template>
    <div>
      <el-dialog
        title="修改个人信息"
        v-model="dialogVisible"
        width="40%"
        :before-close="handleClose"
      >
        <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
          <div class="updateinfo">
            <div class="left">
              <el-form-item label="头像" prop="avatar">
                <img style="width:150px;height:110px" :src="`http://localhost:8080/${form.avatar}`" />
              </el-form-item>
              <el-form-item label="账号密码" prop="password">
                <el-input v-model="form.password" />
              </el-form-item>
              <el-form-item label="昵称" prop="nickname">
                <el-input v-model="form.nickname" />
              </el-form-item>
              <el-form-item label="年龄" prop="age">
                <el-input v-model="form.age" />
              </el-form-item>
              <el-form-item label="性别" prop="gender">
                <el-switch
                  v-model="form.gender"
                  style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                  active-text="男"
                  inactive-text="女"
                  active-value="1"
                  inactive-value="0"
                />
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email" />
              </el-form-item>
            </div>
            <div class="right">
              <el-form-item label="用户编号" prop="uid">
                <el-input v-model="form.uid" disabled />
              </el-form-item>
              <el-form-item label="账号" prop="username">
                <el-input v-model="form.username" disabled />
              </el-form-item>
              <el-form-item label="地区" prop="area">
                <el-input v-model="form.area" />
              </el-form-item>
              <el-form-item label="兴趣爱好" prop="hobby">
                <el-input v-model="form.hobby" />
              </el-form-item>
              <el-form-item label="职业" prop="work">
                <el-input v-model="form.work" />
              </el-form-item>
              <el-form-item label="个性签名" prop="design">
                <el-input v-model="form.design" />
              </el-form-item>
              <el-form-item label="手机号码" prop="mobilePhoneNumber">
                <el-input v-model="form.mobilePhoneNumber" />
              </el-form-item>
            </div>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="submit">提 交</el-button>
        </span>
      </el-dialog>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue'
  import api from '@/api/index'
  import { useUserInfoStore } from '@/stores/user-info'
  import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'


  // 通过 `ref` 和 `reactive` 定义响应式数据

/**
 *  1.只暴露提供一个入口函数————openDialog()，保持组件内部封闭性
 *  2.数据交互尽量通过 openDialog() 方法来传递，减少外部状态依赖，固定的配置项参数才考虑用 props
 */
  //显示隐藏状态
  const dialogVisible = ref(false)

  // Emit 函数定义
  const emit = defineEmits(['flesh'])

// 打开弹窗 -- 可通过接收参数data来展示父组件的数据
const openDialog = (data:any) => {
    dialogVisible.value = true
    console.log('data:', data);
}


const formRef= ref<FormInstance>()

//用户id
const uid:string=useUserInfoStore().uid
  const form = reactive({
    avatar: '',
    password: '',
    nickname: '',
    age: 0,
    email: '',
    mobilePhoneNumber: '',
    gender:0,
    uid: 0,
    username: '',
    area: '',
    hobby: '',
    work: '',
    design: '',
  })
  
  const rules = reactive({
    nickname: [
      { required: true, message: '昵称不能为空', trigger: 'blur' },
    ],
    password: [
      { required: true, message: '账号密码不能为空', trigger: 'blur' },
    ],
  })
  
  
  // 加载用户数据
  const load = async () => {
    try {
      const response = await api.user.getUserInfoById(uid)
      Object.assign(form, response.data)
    } catch (error) {
      console.error(error)
    }
  }
  
  //提交表单
  const submit = async () => {
    try {
      // await updateUser(form)
      console.log(form,"pppppppp");
      
      dialogVisible.value = false
      ElMessage.success('个人信息更新成功！')
      emit('flesh') // 通知父组件刷新
    } catch (error) {
      console.error(error)
      ElMessage.error('更新失败，请稍后再试')
    }
  }
  
  // 关闭对话框
  const handleClose = () => {
    dialogVisible.value = false
    emit('flesh')
  }

  
// 暴露给父组件
defineExpose({
    openDialog
})

  
  // 在组件挂载时加载用户信息
  onMounted(load)
  </script>
  
  <style scoped>
  .updateinfo {
    width: 100%;
    height: 350px;
    overflow: auto;
  }
  .left {
    float: left;
  }
  .right {
    overflow: hidden;
  }

  /* 按钮 */

.dialog-footer{
  margin: 0 0 0 541px !important;
}
  </style>
  