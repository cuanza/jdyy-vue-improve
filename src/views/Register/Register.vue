<template>
    <div class="Register">
        <card>
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="0px" class="demo-ruleForm">

                <el-form-item label="头像">
                    <Upload
                        @get-file="getAvatarFile"
                        is-img
                        is-cropper
                        ref="uploadImgRef"
                    ></Upload>
                </el-form-item>
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" class="w-50 m-3" size="large" placeholder="用户名">
                        <template #prefix>
                            <el-icon class="el-input__icon">
                                <User />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>

                
                <!-- 手机号 -->
                <el-form-item prop="mobile">
                    <el-input
                        v-model="ruleForm.mobile"
                        class="w-50 m-3"
                        size="large"
                        placeholder="手机号"
                    >
                        <template #prefix>
                            <el-icon class="el-input__icon">
                                <Phone />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>

                <!-- 邮箱 -->
                <el-form-item prop="email">
                    <el-input
                        v-model="ruleForm.email"
                        class="w-50 m-3"
                        type="email"
                        size="large"
                        placeholder="邮箱"
                    >
                        <template #prefix>
                            <el-icon class="el-input__icon">
                                <Promotion />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>

                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input v-model="ruleForm.password" class="w-50 m-2" size="large" type="password"
                        placeholder="密码" show-password>
                        <template #prefix>
                            <el-icon class="el-input__icon">
                                <Lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>

                <!-- 确认密码 -->
                <el-form-item prop="ensurePassword">
                    <el-input v-model="ruleForm.ensurePassword" class="w-50 m-2" size="large" type="password"
                        placeholder="确认密码" show-password>
                        <template #prefix>
                            <el-icon class="el-input__icon">
                                <Lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>

                <el-form-item prop="gender">
                    <el-radio-group v-model="ruleForm.gender">
                        <el-radio border label="1">男</el-radio>
                        <el-radio border label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>

                <!-- 注册按钮 -->
                <el-form-item>
                    <el-button color="#1890ff" style="color: white" class="register-button"
                        @click="submitForm(ruleFormRef)">
                        注册
                    </el-button>
                    <p id="signup-hint">
                        注册完成? &nbsp;&nbsp;&nbsp;&nbsp;<router-link to="/login">返回登录</router-link>
                    </p>
                </el-form-item>
            </el-form>
        </card>
    </div>
</template>

<script setup lang="ts">

import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'
import card from "@/components/Card/Card.vue";
import { User, Lock, Promotion,Phone } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { doRegister } from '@/api/register';
import Upload from "@/components/Upload";

const ruleFormRef = ref<FormInstance>()
const formData = new FormData();
const ruleForm = reactive({
    username: '',
    password: '',
    ensurePassword: '',
    email:'',
    mobile:'',
    gender:'',
})

const uploadImgRef = ref();
console.log(uploadImgRef.value,"@@@@@2");

//获取photo放到formData里面
const getAvatarFile = (file: any) => {
  console.log(file,"@@@@1");

  formData.set("avatarFile", file);
};

// //解决 'for in' 遍历，获取值时 ts报错问题
const isValidKey = (
  key: string | number | symbol,
  object: object
): key is keyof typeof object => {
  return key in object;
};


//手机号验证
const validateMobile = (rule: any, value: string, callback: (error?: Error) => void) => {
  console.log(value, '')
  if (value === '') {
    callback(new Error('请输入手机号'));
  } else if (!/^1(3|4|5|6|7|8|9)[0-9]\d{8}$/.test(value)) {
    callback(new Error('请输入正确的手机号'));
  } else {
    callback();
  }
};
//邮箱验证

const validateEmail = (rule: any, value: string, callback: (error?: Error) => void) => {
  if (value === '') {
    callback(new Error('请输入邮箱'));
  } else if (!/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(value)) {
    callback(new Error('请输入正确的邮箱'));
  } else {
    callback();
  }
};

const rules = reactive({
    username: [
        {
            required: true,
            message: "用户名不能为空",
            trigger: 'blur'
        },
        {
            min: 6,
            max: 10,
            message: '长度在 6 到 10 个字符',
            trigger: 'blur'
        }
    ],
    password: [{ required: true, message: "密码不能为空", trigger: 'blur' }],
    ensurePassword: [{ required: true, message: "确认密码不能为空", trigger: 'blur' }],
    email:[{ validator: validateEmail, trigger: 'blur' }],
    mobile:[{ validator: validateMobile, trigger: 'blur' }],
    gender:[{
      required: true,
      message: '请选择你的性别！',
      trigger: 'change',
    }]
})

const submitForm = (formEl: FormInstance | undefined) => {

    if (!formEl) return

    for (let key in ruleForm) {
    if (isValidKey(key, ruleForm)) {
      formData.set(key, ruleForm[key]);
    }
  }

    formEl.validate((valid) => {

        
        if (valid) {
            console.log(formData,"@@@@@");
            
            doRegister(formData).then(res => {
                console.log(res, ruleForm);
                // if (ruleForm.password !== ruleForm.ensurePassword) {
                //     ElMessage.error("第一次与第二次输入的密码不一致")
                //     return false;
                // }
                if (res.code === 200) {
                    ElMessage.success("注册成功！！！")
                } else {
                    ElMessage.error(res.message)
                    return false;
                }
            })
                console.log(ruleForm,"0000000");
                
                console.log("cg");
                
        } else {
            ElMessage.error("输入框信息不能为空")
            return false
        }
    })
}


</script>

<style scoped>
/* 返回按钮 */
#signup-hint {
    font-size: 14px;
}

#signup-hint a {
    font-size: 14px;
    color: #1890ff;
    text-decoration: none;
}

#signup-hint a:hover {
    text-decoration: underline;
}

.Register {
    background-image: url(@/assets/image/login-background.jpg);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* 注册按钮 */
.register-button {
    width: 100%;
    height: 40px;
}
</style>