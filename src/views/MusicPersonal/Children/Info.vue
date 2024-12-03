<template>
    <div>
      <el-card>
        <el-descriptions class="margin-top" title="简介" :column="2" border>
          <template #extra>
            <el-button type="primary" v-if="route.params.id == uid" size="small">操作</el-button>
          </template>
          <el-descriptions-item>
            <template #label>
              <i class="el-icon-picture-outline"></i>
              头像
            </template>
            <img class="img" :src="`http://localhost:8080/${avatar}`" alt="" />
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <i class="el-icon-user"></i>
              账户名
            </template>
            {{ username }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <i class="el-icon-s-custom"></i>
              昵称
            </template>
            {{ nickname }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <i class="el-icon-odometer"></i>
              年龄
            </template>
            {{ age }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <i class="el-icon-male"></i>
              <i class="el-icon-female"></i>
              性别
            </template>
            <el-tag size="small">{{ gender }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <i class="el-icon-message"></i>
              邮箱Email
            </template>
            {{ email }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <i class="el-icon-mobile-phone"></i>
              手机号码
            </template>
            {{ mobilePhoneNumber }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <i class="el-icon-location-outline"></i>
              地区
            </template>
            {{ area }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <i class="el-icon-office-building"></i>
              职业
            </template>
            {{ work }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <i class="el-icon-basketball"></i>
              兴趣爱好
            </template>
            {{ hobby }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <i class="el-icon-magic-stick"></i>
              个性签名
            </template>
            {{ signature }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <i class="el-icon-date"></i>
              注册日期
            </template>
            {{ formatDate(create_date)  }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </div>
  </template>
  
<script setup lang="ts">
import { useUserInfoStore } from '@/stores/user-info'
  import { ref, onMounted } from "vue";
  import { useRoute } from "vue-router";
  import  api  from "@/api/index";
  //格式化日期库
  import dayjs from "dayjs";
  
  // 定义数据类型
  interface UserInfo {
    avatar: string;
    username: string;
    age: number;
    email: string;
    mobilePhoneNumber: string;
    area: string;
    create_date: number;
    nickname: string;
    gender: string;
    work: string;
    hobby: string;
    signature: string;
  }
  
  // 路由和状态管理
  const route = useRoute();
  const uid=useUserInfoStore().uid
  
  // 响应式数据
  const avatar = ref<string>("");
  const username = ref<string>("");
  const age = ref<number>(0);
  const email = ref<string>("");
  const mobilePhoneNumber = ref<string>("");
  const area = ref<string>("");
  const create_date = ref<number>(0);
  const nickname = ref<string>("");
  const gender = ref<string>("");
  const work = ref<string>("");
  const hobby = ref<string>("");
  const signature = ref<string>("");
  
  // 数据加载函数
  const load = async () => {
    try {
      const res = await api.user.getUserInfoById(route.params.id as string);
      const data:any = res.data;
      avatar.value = data.avatar;
      username.value = data.username;
      age.value = data.age;
      email.value = data.email;
      mobilePhoneNumber.value = data.mobilePhoneNumber;
      area.value = data.area;
      create_date.value = data.create_date;
      nickname.value = data.nickname;
      gender.value = data.gender == "1" ? "男" : "女";
      work.value = data.work;
      hobby.value = data.hobby;
      signature.value = data.signature;
    } catch (err) {
      console.error(err);
    }
  };

// 格式化日期
const formatDate = (timestamp: number): string => {
  return dayjs(timestamp).format("YYYY-MM-DD");
};
  
  // 组件挂载时加载数据
  onMounted(() => {
    load();
  });
</script>
  
<script lang="ts">
export default {
  name: 'info',  // 组件名称
};
</script>

  <style scoped>
  .img {
    width: 80px;
    height: 80px;
  }
  </style>
  

