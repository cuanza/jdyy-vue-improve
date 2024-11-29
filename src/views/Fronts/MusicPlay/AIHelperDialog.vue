<template>
  <el-dialog
      v-model="dialogVisible"
      title="AI 笔记助手"
      width="1000"
      :before-close="handleClose"
  >
    <div v-if="loading" class="loading-container">
      {{ loadingMessage }}<span class="dots-animation"></span>
    </div>
    <div v-else v-html="formattedMessage"></div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {ElMessageBox, ElMessage} from 'element-plus';
import {getNotes, getTranscribe} from '@/api/request/music';

export default defineComponent({
  name: 'AIHelperDialog',
  data() {
    return {
      dialogVisible: false,
      musicId: 0,
      actionType: '',
      message: '', // 完整消息内容
      displayedMessage: '', // 逐字显示的内容
      loading: false, // 用于显示加载状态
      typingInterval: null as number | null, // 定时器 ID
    };
  },
  computed: {
    formattedMessage() {
      // 替换 \n 为 <br>
      return this.displayedMessage.replace(/\n/g, '<br>');
    },
    loadingMessage() {
      // 根据 actionType 返回对应的提示文字
      if (this.actionType === 'notes') {
        return '正在获取AI课堂笔记';
      } else if (this.actionType === 'transcribe') {
        return '正在进行AI语音转文字';
      } else {
        return '正在加载...'; // 默认提示
      }
    },
  },
  methods: {
    async openDialog(musicId: number, actionType: string) {
      this.musicId = musicId; // 设置音乐 ID
      this.actionType = actionType; // 设置操作类型
      this.dialogVisible = true; // 打开 Dialog
      this.loading = true; // 开始加载
      this.message = ''; // 清空之前的消息
      this.displayedMessage = ''; // 清空逐字显示的内容
      if (actionType === 'notes') {
        try {
          const response = await getNotes(this.musicId);
          this.message = response?.data || '获取AI笔记成功！'; // 设置完整消息
          this.startTyping(); // 启动逐字显示效果
        } catch (error) {
          this.message = '获取AI笔记失败，请稍后重试。';
          console.error('获取AI笔记失败:', error);
        } finally {
          this.loading = false; // 结束加载
        }
      }
      if (actionType === 'transcribe') {
        try {
          const response = await getTranscribe(this.musicId);
          this.message = response?.data || '获取AI语音转文字！'; // 设置完整消息
          this.startTyping(); // 启动逐字显示效果
        } catch (error) {
          this.message = '获取AI转谱失败，请稍后重试。';
          console.error('获取AI转谱失败:', error);
        } finally {
          this.loading = false; // 结束加载
        }
      }
    },
    startTyping() {
      let index = 0;
      const fullText = this.message;

      // 清除旧定时器
      if (this.typingInterval) {
        clearInterval(this.typingInterval);
      }

      // 设置逐字显示定时器
      this.typingInterval = setInterval(() => {
        if (index < fullText.length) {
          this.displayedMessage += fullText[index];
          index++;
        } else {
          clearInterval(this.typingInterval); // 清除定时器
        }
      }, 10); // 每 10 毫秒显示一个字符
    },
    closeDialog() {
      this.dialogVisible = false; // 关闭 Dialog
      this.displayedMessage = ''; // 清空逐字显示的内容
      if (this.typingInterval) {
        clearInterval(this.typingInterval); // 清除定时器
      }
    },
    handleClose(done: () => void) {
      ElMessageBox.confirm('确定要关闭AI笔记助手吗？')
          .then(() => {
            done();
            this.closeDialog();
          })
          .catch(() => {
            // 用户取消关闭
            ElMessage.info('操作已取消');
          });
    },
  },
});
</script>


<style scoped>
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  height: 100px;
}

.dots-animation::after {
  content: '';
  display: inline-block;
  width: 1em;
  text-align: left;
  animation: dots 1.5s steps(3, end) infinite;
}

@keyframes dots {
  0% {
    content: '';
  }
  33% {
    content: '.';
  }
  66% {
    content: '..';
  }
  100% {
    content: '...';
  }
}
</style>