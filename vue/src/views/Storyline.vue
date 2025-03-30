<template>
  <div class="storyline-container">
    <!-- 进度指示器 -->
    <div class="progress-indicator">
      <el-steps :active="currentStep" finish-status="success">
        <el-step title="故事雏形" description="输入基本故事概念"></el-step>
        <el-step title="三幕结构" description="编排故事情节"></el-step>
        <el-step title="预览调整" description="完善故事细节"></el-step>
      </el-steps>
    </div>

    <div class="main-content">
      <!-- 左侧编辑区 -->
      <div class="edit-section">
        <!-- 故事雏形输入 -->
        <div class="story-input" v-show="currentStep === 0">
          <h2>故事雏形</h2>
          <el-form>
            <el-form-item label="故事主题">
              <el-input v-model="storyInfo.theme" placeholder="请输入故事主题，如：爱情、冒险、科幻等"></el-input>
            </el-form-item>
            <el-form-item label="故事概要">
              <el-input
                type="textarea"
                v-model="storyInfo.summary"
                :rows="6"
                placeholder="请简要描述您的故事构思..."
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="generateStoryStructure">生成故事结构</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 三幕结构编辑 -->
        <div class="three-act-structure" v-show="currentStep === 1">
          <h2>三幕结构编辑</h2>
          
          <!-- 第一幕：开头 -->
          <div class="act-section">
            <h3>第一幕：开头</h3>
            <el-form>
              <el-form-item label="从前...">
                <el-input
                  type="textarea"
                  v-model="storyStructure.act1.background"
                  :rows="3"
                  placeholder="描述故事的背景和起点"
                ></el-input>
              </el-form-item>
              <el-form-item label="每天...">
                <el-input
                  type="textarea"
                  v-model="storyStructure.act1.daily"
                  :rows="3"
                  placeholder="描述主角的日常生活"
                ></el-input>
              </el-form-item>
              <el-form-item label="直到有一天...">
                <el-input
                  type="textarea"
                  v-model="storyStructure.act1.trigger"
                  :rows="3"
                  placeholder="描述触发事件"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>

          <!-- 第二幕：情节 -->
          <div class="act-section">
            <h3>第二幕：情节</h3>
            <el-form>
              <el-form-item label="因此...">
                <el-input
                  type="textarea"
                  v-model="storyStructure.act2.consequence1"
                  :rows="3"
                  placeholder="描述第一个转折"
                ></el-input>
              </el-form-item>
              <el-form-item label="因此...">
                <el-input
                  type="textarea"
                  v-model="storyStructure.act2.consequence2"
                  :rows="3"
                  placeholder="描述第二个转折"
                ></el-input>
              </el-form-item>
              <el-form-item label="因此...">
                <el-input
                  type="textarea"
                  v-model="storyStructure.act2.consequence3"
                  :rows="3"
                  placeholder="描述第三个转折"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>

          <!-- 第三幕：结局 -->
          <div class="act-section">
            <h3>第三幕：结局</h3>
            <el-form>
              <el-form-item label="直到最后...">
                <el-input
                  type="textarea"
                  v-model="storyStructure.act3.climax"
                  :rows="3"
                  placeholder="描述故事高潮"
                ></el-input>
              </el-form-item>
              <el-form-item label="从此之后...">
                <el-input
                  type="textarea"
                  v-model="storyStructure.act3.ending"
                  :rows="3"
                  placeholder="描述故事结局"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <!-- 预览调整 -->
        <div class="preview-adjust" v-show="currentStep === 2">
          <h2>预览调整</h2>
          <el-form>
            <el-form-item label="故事节奏">
              <el-slider v-model="previewSettings.pace" :min="1" :max="10"></el-slider>
            </el-form-item>
            <el-form-item label="情感强度">
              <el-slider v-model="previewSettings.emotionalIntensity" :min="1" :max="10"></el-slider>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="generateVideo">生成视频</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>

      <!-- 右侧预览区 -->
      <div class="preview-section">
        <h2>故事预览</h2>
        <div class="preview-content">
          <div v-if="currentStep === 0" class="story-preview">
            <h3>故事概览</h3>
            <p>{{ storyInfo.summary || '请在左侧输入故事概要...' }}</p>
          </div>
          <div v-else-if="currentStep === 1" class="structure-preview">
            <div class="timeline">
              <div class="act" v-for="(act, index) in previewContent" :key="index">
                <h4>{{ act.title }}</h4>
                <p>{{ act.content }}</p>
              </div>
            </div>
          </div>
          <div v-else class="video-preview">
            <div class="video-placeholder">
              <el-icon><VideoCamera /></el-icon>
              <p>视频预览区域</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="action-bar">
      <el-button @click="prevStep" :disabled="currentStep === 0">上一步</el-button>
      <el-button type="primary" @click="nextStep" :disabled="currentStep === 2">下一步</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { VideoCamera } from '@element-plus/icons-vue'

// 当前步骤
const currentStep = ref(0)

// 故事基本信息
const storyInfo = ref({
  theme: '',
  summary: ''
})

// 三幕结构
const storyStructure = ref({
  act1: {
    background: '',
    daily: '',
    trigger: ''
  },
  act2: {
    consequence1: '',
    consequence2: '',
    consequence3: ''
  },
  act3: {
    climax: '',
    ending: ''
  }
})

// 预览设置
const previewSettings = ref({
  pace: 5,
  emotionalIntensity: 5
})

// 预览内容计算属性
const previewContent = computed(() => {
  return [
    {
      title: '第一幕',
      content: `${storyStructure.value.act1.background}\n${storyStructure.value.act1.daily}\n${storyStructure.value.act1.trigger}`
    },
    {
      title: '第二幕',
      content: `${storyStructure.value.act2.consequence1}\n${storyStructure.value.act2.consequence2}\n${storyStructure.value.act2.consequence3}`
    },
    {
      title: '第三幕',
      content: `${storyStructure.value.act3.climax}\n${storyStructure.value.act3.ending}`
    }
  ]
})

// 生成故事结构
const generateStoryStructure = () => {
  // TODO: 调用AI接口生成故事结构
  nextStep()
}

// 生成视频
const generateVideo = () => {
  // TODO: 调用视频生成接口
}

// 步骤控制
const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const nextStep = () => {
  if (currentStep.value < 2) {
    currentStep.value++
  }
}
</script>

<style lang="scss" scoped>
.storyline-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  .progress-indicator {
    margin-bottom: 2rem;
  }

  .main-content {
    display: grid;
    grid-template-columns: 3fr 2fr;
    gap: 2rem;
    margin-bottom: 2rem;

    @media (max-width: 992px) {
      grid-template-columns: 1fr;
    }
  }

  .edit-section,
  .preview-section {
    background-color: #fff;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    h2 {
      margin-bottom: 1.5rem;
      color: #333;
      font-size: 1.5rem;
    }
  }

  .act-section {
    margin-bottom: 2rem;
    padding: 1rem;
    border: 1px solid #eee;
    border-radius: 4px;

    h3 {
      margin-bottom: 1rem;
      color: #409eff;
    }
  }

  .preview-section {
    .preview-content {
      min-height: 400px;
      
      .video-placeholder {
        height: 300px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: #f5f7fa;
        border-radius: 4px;

        .el-icon {
          font-size: 3rem;
          color: #909399;
          margin-bottom: 1rem;
        }

        p {
          color: #909399;
        }
      }
    }

    .timeline {
      .act {
        margin-bottom: 1.5rem;
        padding: 1rem;
        background-color: #f5f7fa;
        border-radius: 4px;

        h4 {
          color: #409eff;
          margin-bottom: 0.5rem;
        }

        p {
          color: #606266;
          white-space: pre-line;
        }
      }
    }
  }

  .action-bar {
    display: flex;
    justify-content: center;
    gap: 1rem;
  }
}
</style>