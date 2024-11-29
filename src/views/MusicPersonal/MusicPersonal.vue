<template>

   <!-- 背景图 -->
  <div class="bg">
    <img src="https://hype4.academy/_next/static/media/ovalShadow.793e2be7.svg" alt="图片迷路了~" style="--x:0">
    <img src="https://hype4.academy/_next/static/media/ovalShadow.793e2be7.svg" alt="图片迷路了~" style="--x:1">
    <img src="https://hype4.academy/_next/static/media/ovalShadow.793e2be7.svg" alt="图片迷路了~" style="--x:2">
    <img src="https://hype4.academy/_next/static/media/ovalShadow.793e2be7.svg" alt="图片迷路了~" style="--x:3">
    <img src="https://hype4.academy/_next/static/media/ovalShadow.793e2be7.svg" alt="图片迷路了~" style="--x:4">
    <img src="https://hype4.academy/_next/static/media/ovalShadow.793e2be7.svg" alt="图片迷路了~" style="--x:5">
  </div>

  <div>
    <div class="PersonTop">
      <div class="PersonTop_img">
        <img v-image-preview :src="`http://localhost:8080/${avatar}`" />
      </div>
      <div class="PersonTop_text">
        <div class="user_text">
          <div class="user_name">
            <span> {{ nickname }} </span>
          </div>
          <div class="user-v" v-if="v === 3">
            <img src="@/assets/img/V.png"  class="user-v-img" />
            <span class="user-v-font">优质媒体作者</span>
          </div>
          <div class="user_qianming">
            <span> {{ design }}</span>
          </div>
          <div class="user_anniu">
            <!-- 如果是当前用户，显示“编辑”按钮 -->
            <el-button
              class="el-icon-edit"
              v-if="isCurrentUser"
              type="primary"
              size="medium"
              plain
              @click="edit"
            >编辑</el-button>
            <!-- 否则显示“关注”按钮，已关注则显示“已关注” -->
            <el-button
              v-else
              @click="follow"
              type="primary"
              size="medium"
              icon="el-icon-check"
              v-text="isFollowing ? '已关注' : '关注'"
            />
          </div>
        </div>
        <div class="user_num">
          <!-- 点击粉丝，跳转到粉丝页面 -->
          <div style="cursor: pointer" @click="myfan">
            <div class="num_number">{{ fanCounts }}</div>
            <span class="num_text">粉丝</span>
          </div>
          <!-- 点击关注，跳转到关注页面 -->
          <div style="cursor: pointer" @click="myfollow">
            <div class="num_number">{{ followCounts }}</div>
            <span class="num_text">关注</span>
          </div>
          <div>
            <div class="num_number">{{ goodCounts }}</div>
            <span class="num_text">获赞</span>
          </div>
        </div>
      </div>
    </div>
    <div class="person_body">
      <div class="person_body_left">
        <el-card class="box-card" :body-style="{ padding: '0px' }">
          <div slot="header" class="clearfix">
            <span class="person_body_list" style="border-bottom: none">个人中心</span>
          </div>
          <!-- 侧边菜单 -->
          <el-menu router  style="--el-menu-active-color:#f0f0f0;" default-active="info"  class="el-menu-vertical-demo">
            <el-menu-item index="info" :route="{ name: 'info', params: $route.params.id }">
              <span slot="title">个人简介</span>
            </el-menu-item>
            <el-menu-item index="myarticle" :route="{ name: 'myarticle', params: $route.params.id }">
              
              <span slot="title">发帖</span>
            </el-menu-item>
            <el-menu-item index="mycollect" :route="{ name: 'mycollect', params: $route.params.id }">
              
              <span slot="title">收藏</span>
            </el-menu-item>
            <el-menu-item index="myfan" :route="{ name: 'myfan', params: $route.params.id }">
              
              <span slot="title">粉丝</span>
            </el-menu-item>
            <el-menu-item index="myfollow" :route="{ name: 'myfollow', params: $route.params.id }">
              
              <span slot="title">关注</span>
            </el-menu-item>
          </el-menu>
        </el-card>
      </div>
      <div class="person_body_right">
        <router-view />
      </div>
    </div>
    <!-- 编辑个人信息弹窗 -->
   
  </div>
   <music-personal-dia ref="dialogRef" @flesh="handleOnConfirm" />
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
  import api from '@/api/index'

    import { useUserInfoStore } from '@/stores/user-info'
// import { myFollow, addFollow, deleteFollow, followAndFanCount } from "@/api/follow.js"
// import { mygoodCount } from "@/api/good"
import MusicPersonalDia from "@/views/MusicPersonal/components/MusicPersonalDia.vue"
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

// 获取 vuex 中的 store
const store = useStore()
// 获取当前路由信息
const route = useRoute()
const router = useRouter()
const uid=useUserInfoStore().uid

// 定义响应式数据
const avatar = ref("")
const nickname = ref("")
const v = ref(1)
const design = ref("")
const followCounts = ref("")
const fanCounts = ref("")
const goodCounts = ref("")
const isFollowed = ref(false)
const followData = reactive({
  fanId: "",
  followId: "",
})
const isFollowId = ref<string[]>([])

const dialogRef =ref()


// 计算属性：判断是否是当前用户
const isCurrentUser = computed(() => route.params.id == uid)

// 计算属性：判断是否已关注
const isFollowing = computed(() => {
  // 如果 route.params.id 是一个字符串数组，取第一个 ID 进行比较
  const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id;
  return isFollowId.value.includes(id);
});


// 在弹窗里点击提交
const handleOnConfirm = (data:any) => {
  console.log('data', data);
}



// 加载用户数据
const load = async () => {
  try {
    // 获取用户信息
    const res = await api.user.getUserInfoById(uid)
    avatar.value = res.data.avatar
    nickname.value = res.data.username
    v.value = res.data.v
    design.value = res.data.design
  } catch (err) {
    console.error(err)
  }

//   try {
//     // 获取当前用户的关注列表
//     const followRes = await myFollow(store.state.id)
//     isFollowId.value = followRes.data.map(follow => follow.id)
//   } catch (err) {
//     console.error(err)
//   }

//   try {
//     // 获取粉丝和关注数
//     const followAndFanRes = await followAndFanCount(route.params.id)
//     followCounts.value = followAndFanRes.data.followCounts
//     fanCounts.value = followAndFanRes.data.fanCounts
//   } catch (err) {
//     console.error(err)
//   }

//   try {
//     // 获取用户的获赞数
//     const goodCountRes = await mygoodCount(route.params.id)
//     goodCounts.value = goodCountRes.data.goodCounts
//   } catch (err) {
//     console.error(err)
//   }
 }

// 跳转到粉丝页面
const myfan = () => router.push({ path: `/newsuser/personal/myfan/${route.params.id}` })
// 跳转到关注页面
const myfollow = () => router.push({ path: `/newsuser/personal/myfollow/${route.params.id}` })

// 处理关注和取消关注操作
const follow = async () => {
  if (!store.state.id) {
    // 如果未登录，提示登录
    ElMessage.warning("请登录后再进行操作哦")
    return
  }

  // 设置关注数据
  // followData.followId = route.params.id
  // followData.fanId = uid

  // try {
  //   if (isFollowing.value) {
  //     // 如果已关注，执行取消关注操作
  //     await deleteFollow(followData)
  //     isFollowed.value = false
  //     ElMessage.success("已取消关注")
  //   } else {
  //     // 如果未关注，执行关注操作
  //     await addFollow(followData)
  //     isFollowed.value = true
  //     ElMessage.success("已成功关注")
  //   }
  //   load() // 更新数据
  // } catch (err) {
  //   console.error(err)
  // }
}

// 打开编辑个人信息弹窗
const edit = () => {
  // 打开弹窗
  dialogRef.value.openDialog({data:{name: '小白很白'}})
}

// 组件挂载后加载数据
onMounted(load)

// 监听路由变化，刷新数据
watch(
  () => route.path,
  (newPath, oldPath) => {
    if (newPath === `/musicFrout/musicPersonal/${uid}` || newPath === `/musicFrout/musicPersonal/${route.params.id}`) {
      load()
    }
  }
)

</script>

<style scoped>







/* 背景圆*/
.bg {
  width: 100%;
  height: 100%;
  position: fixed;
  background-image: linear-gradient(180deg, #2f6ed3 5%, #5095e4 20%, #5095e4 60%, #2f6ed3 95%);
  z-index: -1;
}

/* 背景圆 */
/* 背景圆动画 */

@keyframes animate {

0%,
100% {
  transform: translateY(-50px);
}

50% {
  transform: translateY(50px);
}
}

.bg>img {
position: absolute;
animation: animate 10s linear infinite;
animation-delay: calc(var(--x) * -10s);
}

.bg>img:nth-of-type(1) {
width: 15%;
top: 10%;
left: 70%;

}

.bg>img:nth-of-type(2) {
width: 25%;
top: 20%;
left: 10%;

}

.bg>img:nth-of-type(3) {
width: 10%;
top: 40%;
left: 50%;

}

.bg>img:nth-of-type(4) {
width: 30%;
top: 50%;
left: 60%;

}

.bg>img:nth-of-type(5) {
width: 15%;
top: 70%;
left: 15%;

}

.bg>img:nth-of-type(6) {
width: 15%;
top: 5%;
left: 35%;

}


.el-card{
  border:0px;
  box-shadow:0px;
  background: transparent;
}
.el-card.is-always-shadow{
  background: transparent;
  box-shadow:0 0 0;
}
.el-menu{
  background: transparent;

  border: 0;
}

.me-video-player {
  background-color: transparent;
  width: 100%;
  height: 100%;
  object-fit: fill;
  display: block;
  position: fixed;
  left: 0;
  z-index: 0;
  top: 0;
}
.PersonTop {
  width: 1000px;
  height: 140px;
  padding-top: 20px;
  /* background-color: white; */
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(1px);
  /*-webkit-backdrop-filter: blur(1px); */
  border-radius: 10px;
  /* border: 1px solid rgba(255, 255, 255, 0.18); */
  /* 优化高斯模糊 */
  /* transform: translateZ(0); */

  margin-top: 30px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  /* border-radius: 5px; */
}

.PersonTop_img {
  width: 100px;
  height: 100px;
  background-color: #8c939d;
  margin-right: 24px;
  margin-left: 20px;
  overflow: hidden;
  border-radius: 20px;
}

.PersonTop_img img {
  width: 100%;
  height: 100%;
  border-radius: 20px;
}

.PersonTop_text {
  height: 120px;
  width: 880px;
  display: flex;
}

.user_text {
  width: 60%;
  height: 100%;
  color: white;
  line-height: 30px;
}

.user_name {
  font-weight: bold;
}
.user-v {
  margin-bottom: -5px;
}
.user-v-img {
  width: 15px;
  height: 15px;
}
.user-v-font {
  font-size: 15px;
  color: #00c3ff;
}
.user_qianming {
  font-size: 14px;
  color: #999;
}

.user_num {
  width: 40%;
  height: 100%;
  
  display: flex;
  align-items: center;
}

.user_num > div {
  text-align: center;
  border-right: 1px dotted #999;
  box-sizing: border-box;
  width: 80px;
  height: 40px;
  line-height: 20px;
}

.num_text {
  color: #ffffff;
}

.num_number {
  font-size: 20px;
  color: #333;
}

.el-menu-item>span {
  font-size: 16px;
  color: #ffffff;
}


.el-menu-item.is-active {
      background-color: #3370ff !important;
      color: #302a2a !important;
}
.el-menu-item.is-active span {
        color: #433939 !important;
}


/*下面部分样式*/
.person_body {
  width: 1000px;
  margin-top: 210px;
  display: flex;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 5px;
}

.person_body_left {
  width: 27%;
  height: 600px;
  /* border-radius: 5px; */
  margin-right: 3%;
  text-align: center;

  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(1px);
  /*-webkit-backdrop-filter: blur(1px); */
  border-radius: 10px;
  /* border: 1px solid rgba(255, 255, 255, 0.18); */
  /* 优化高斯模糊 */
  transform: translateZ(0);
}

.person_body_list {
  width: 100%;
  height: 50px;
  margin-top: 25px;
  font-size: 22px;
  border-bottom: 1px solid #f0f0f0;
  background-image: -webkit-linear-gradient(
    left,
    rgb(42, 134, 141),
    #e9e625dc 20%,
    #3498db 40%,
    #e74c3c 60%,
    #09ff009a 80%,
    rgba(82, 196, 204, 0.281) 100%
  );
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  -webkit-background-size: 200% 100%;
  -webkit-animation: masked-animation 4s linear infinite;
}



.person_body_right {
  width: 70%;
  /* height: 500px; */
  /* border-radius: 5px;
  background-color: white; */
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(1px);
  /*-webkit-backdrop-filter: blur(1px); */
  border-radius: 10px;
}

.box-card {
  height: 500px;
}

/*ui样式*/
.el-button {
  width: 84px;
}
/* 个人中心图标 */
.clearfix{
    margin: 10px 0 10px 0;
}
</style>
