<template>
  <div class="scene-container">
    <h1 class="page-title">场景生成</h1>
    
    <div class="scene-content">
      <!-- 顶部：场景类型选择 -->
      <div class="scene-type-selection">
        <div class="category-tags">
          <el-tag 
            v-for="category in sceneCategories" 
            :key="category.value"
            :type="activeCategory === category.value ? '' : 'info'"
            effect="plain"
            @click="activeCategory = category.value"
            class="category-tag"
          >
            {{ category.label }}
          </el-tag>
        </div>
        
        <div class="mood-tags">
          <span class="mood-label">情绪标签：</span>
          <el-tag 
            v-for="mood in sceneMoods" 
            :key="mood.value"
            :type="activeMoods.includes(mood.value) ? '' : 'info'"
            effect="plain"
            @click="toggleMood(mood.value)"
            size="small"
            class="mood-tag"
          >
            {{ mood.label }}
          </el-tag>
        </div>
      </div>
      
      <div class="scene-main-content">
        <!-- 左侧：场景参数设置 -->
        <div class="scene-panel scene-params-panel">
          <h2 class="panel-title">场景参数</h2>
          
          <div class="panel-content">
            <!-- 创建方式选择 -->
            <div class="param-section">
              <h3 class="section-title">创建方式</h3>
              <el-radio-group v-model="createMethod" size="large">
                <el-radio-button label="ai">AI生成</el-radio-button>
                <el-radio-button label="material">素材库</el-radio-button>
              </el-radio-group>
            </div>
            
            <!-- 素材库筛选器 -->
            <div class="param-section" v-if="createMethod === 'material'">
              <h3 class="section-title">素材筛选</h3>
              
              <el-form label-position="top">
                <el-form-item label="场景类型">
                  <el-select v-model="materialFilter.type" placeholder="请选择场景类型" style="width: 100%">
                    <el-option label="全部" value="all"></el-option>
                    <el-option label="室内" value="indoor"></el-option>
                    <el-option label="室外" value="outdoor"></el-option>
                    <el-option label="自然" value="nature"></el-option>
                    <el-option label="城市" value="city"></el-option>
                  </el-select>
                </el-form-item>
                
                <el-form-item label="时间">
                  <el-select v-model="materialFilter.time" placeholder="请选择时间" style="width: 100%">
                    <el-option label="全部" value="all"></el-option>
                    <el-option label="白天" value="day"></el-option>
                    <el-option label="黄昏" value="dusk"></el-option>
                    <el-option label="夜晚" value="night"></el-option>
                  </el-select>
                </el-form-item>
                
                <el-form-item label="风格">
                  <el-select v-model="materialFilter.style" placeholder="请选择风格" style="width: 100%">
                    <el-option label="全部" value="all"></el-option>
                    <el-option label="写实" value="realistic"></el-option>
                    <el-option label="动漫" value="anime"></el-option>
                    <el-option label="像素" value="pixel"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              
              <div class="material-grid">
                <div 
                  v-for="item in 6" 
                  :key="item" 
                  class="material-item"
                  :class="{ active: selectedMaterial === item }"
                  @click="selectedMaterial = item"
                >
                  <img :src="`https://picsum.photos/150/100?random=${item}`" alt="场景素材" />
                </div>
              </div>
              
              <el-pagination 
                layout="prev, pager, next" 
                :total="30"
                :page-size="6"
                class="material-pagination"
              />
            </div>
            
            <!-- 场景描述输入（AI生成模式） -->
            <div class="param-section" v-if="createMethod === 'ai'">
              <h3 class="section-title">场景描述</h3>
              <el-input 
                type="textarea" 
                v-model="sceneInfo.description" 
                :rows="5"
                placeholder="请描述您想要的场景，如地点、时间、氛围等"
              ></el-input>
              
              <div class="ai-generate-actions">
                <el-button type="primary" @click="generateScene">AI生成场景</el-button>
                <el-tooltip content="使用AI根据您的描述生成场景" placement="top">
                  <el-icon><QuestionFilled /></el-icon>
                </el-tooltip>
              </div>
            </div>
            
            <!-- 动态特效选择 -->
            <div class="param-section">
              <h3 class="section-title">动态特效</h3>
              
              <div class="effect-options">
                <div 
                  v-for="effect in dynamicEffects" 
                  :key="effect.value"
                  class="effect-option"
                  :class="{ active: sceneInfo.effects.includes(effect.value) }"
                  @click="toggleEffect(effect.value)"
                >
                  <el-icon><component :is="effect.icon" /></el-icon>
                  <span>{{ effect.label }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 主区域：场景预览 -->
        <div class="scene-panel scene-preview-panel">
          <h2 class="panel-title">场景预览</h2>
          
          <div class="panel-content preview-content">
            <div class="scene-preview">
              <img 
                :src="previewImage || 'https://picsum.photos/800/450?random=1'" 
                alt="场景预览" 
                class="preview-image"
              />
              
              <!-- 动态特效展示 -->
              <div class="scene-effects">
                <div class="rain-effect" v-if="sceneInfo.effects.includes('rain')"></div>
                <div class="snow-effect" v-if="sceneInfo.effects.includes('snow')"></div>
                <div class="fog-effect" v-if="sceneInfo.effects.includes('fog')"></div>
                <div class="leaves-effect" v-if="sceneInfo.effects.includes('leaves')"></div>
              </div>
            </div>
            
            <div class="preview-controls">
              <div class="style-switcher">
                <h3 class="switcher-title">风格预览</h3>
                <el-radio-group v-model="previewStyle" size="small">
                  <el-radio-button label="realistic">写实</el-radio-button>
                  <el-radio-button label="anime">动漫</el-radio-button>
                  <el-radio-button label="pixel">像素</el-radio-button>
                </el-radio-group>
              </div>
              
              <div class="scene-actions">
                <el-button type="primary" @click="saveScene">保存场景</el-button>
                <el-button type="default" @click="resetScene">重置</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { QuestionFilled, Sunny, Moon, Cloudy, WindPower } from '@element-plus/icons-vue'

// 场景类别
const sceneCategories = [
  { label: '全部', value: 'all' },
  { label: '现代', value: 'modern' },
  { label: '古代', value: 'ancient' },
  { label: '玄幻', value: 'fantasy' },
  { label: '科幻', value: 'scifi' },
  { label: '恐怖', value: 'horror' },
  { label: '浪漫', value: 'romantic' }
]

// 场景情绪
const sceneMoods = [
  { label: '温馨', value: 'warm' },
  { label: '紧张', value: 'tense' },
  { label: '神秘', value: 'mysterious' },
  { label: '欢乐', value: 'joyful' },
  { label: '悲伤', value: 'sad' },
  { label: '恐惧', value: 'fearful' },
  { label: '平静', value: 'peaceful' },
  { label: '激动', value: 'exciting' }
]

// 动态特效
const dynamicEffects = [
  { label: '雨滴', value: 'rain', icon: 'Cloudy' },
  { label: '飘雪', value: 'snow', icon: 'Sunny' },
  { label: '雾气', value: 'fog', icon: 'Moon' },
  { label: '落叶', value: 'leaves', icon: 'WindPower' }
]

// 当前选中的类别和情绪
const activeCategory = ref('all')
const activeMoods = ref([])

// 创建方式
const createMethod = ref('ai')

// 场景信息
const sceneInfo = ref({
  name: '',
  description: '',
  category: 'modern',
  moods: [],
  effects: []
})

// 素材筛选
const materialFilter = ref({
  type: 'all',
  time: 'all',
  style: 'all'
})

// 选中的素材
const selectedMaterial = ref(null)

// 预览图片
const previewImage = ref('')

// 预览风格
const previewStyle = ref('realistic')

// 切换情绪标签
const toggleMood = (value: string) => {
  const index = activeMoods.value.indexOf(value)
  if (index === -1) {
    // 最多选择3个情绪
    if (activeMoods.value.length < 3) {
      activeMoods.value.push(value)
      sceneInfo.value.moods.push(value)
    } else {
      // 可以添加提示：最多选择3个情绪
    }
  } else {
    activeMoods.value.splice(index, 1)
    const moodIndex = sceneInfo.value.moods.indexOf(value)
    if (moodIndex !== -1) {
      sceneInfo.value.moods.splice(moodIndex, 1)
    }
  }
}

// 切换特效
const toggleEffect = (value: string) => {
  const index = sceneInfo.value.effects.indexOf(value)
  if (index === -1) {
    sceneInfo.value.effects.push(value)
  } else {
    sceneInfo.value.effects.splice(index, 1)
  }
}

// AI生成场景
const generateScene = () => {
  // 这里应该调用AI生成接口
  console.log('生成场景', {
    ...sceneInfo.value,
    category: activeCategory.value,
    moods: activeMoods.value
  })
  // 模拟生成结果
  setTimeout(() => {
    previewImage.value = `https://picsum.photos/800/450?random=${Math.floor(Math.random() * 100)}`
  }, 1000)
}

// 保存场景
const saveScene = () => {
  // 保存场景信息
  console.log('保存场景', {
    ...sceneInfo.value,
    category: activeCategory.value,
    moods: activeMoods.value,
    style: previewStyle.value
  })
  // 这里应该调用保存接口
}

// 重置场景
const resetScene = () => {
  sceneInfo.value = {
    name: '',
    description: '',
    category: 'modern',
    moods: [],
    effects: []
  }
  activeCategory.value = 'all'
  activeMoods.value = []
  previewImage.value = ''
  selectedMaterial.value = null
  previewStyle.value = 'realistic'
}
</script>

<style lang="scss" scoped>
.scene-container {
  max-width: 1400px;
  margin: 0 auto;
}

.page-title {
  margin-bottom: 2rem;
  font-size: 2rem;
  color: #333;
}

// 场景类型选择区域
.scene-type-selection {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
  
  .category-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
    
    .category-tag {
      cursor: pointer;
      padding: 0.5rem 1rem;
      font-size: 1rem;
    }
  }
  
  .mood-tags {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    
    .mood-label {
      color: #666;
      font-size: 0.9rem;
    }
    
    .mood-tag {
      cursor: pointer;
    }
  }
}

// 主内容区域
.scene-main-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
}

// 面板通用样式
.scene-panel {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  
  .panel-title {
    padding: 1rem;
    margin: 0;
    background-color: #f5f7fa;
    border-bottom: 1px solid #e4e7ed;
    font-size: 1.2rem;
    color: #333;
  }
  
  .panel-content {
    padding: 1.5rem;
  }
}

// 参数面板样式
.scene-params-panel {
  .param-section {
    margin-bottom: 1.5rem;
    
    .section-title {
      font-size: 1rem;
      margin-bottom: 1rem;
      color: #333;
      font-weight: 500;
    }
  }
  
  .ai-generate-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  
  .material-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
    margin: 1rem 0;
    
    .material-item {
      border: 2px solid transparent;
      border-radius: 4px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      &.active {
        border-color: #409eff;
      }
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    }
  }
  
  .material-pagination {
    display: flex;
    justify-content: center;
  }
  
  .effect-options {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    
    .effect-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.8rem;
      border-radius: 4px;
      border: 1px solid #e4e7ed;
      cursor: pointer;
      transition: all 0.3s;
      
      .el-icon {
        font-size: 1.2rem;
        color: #909399;
      }
      
      span {
        color: #606266;
      }
      
      &.active {
        background-color: #ecf5ff;
        border-color: #409eff;
        
        .el-icon {
          color: #409eff;
        }
        
        span {
          color: #409eff;
        }
      }
      
      &:hover {
        border-color: #c6e2ff;
      }
    }
  }
}

// 预览面板样式
.scene-preview-panel {
  .preview-content {
    display: flex;
    flex-direction: column;
  }
  
  .scene-preview {
    width: 100%;
    height: 450px;
    position: relative;
    overflow: hidden;
    border-radius: 4px;
    margin-bottom: 1.5rem;
    
    .preview-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    // 动态特效样式
    .scene-effects {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      
      // 这里可以添加各种特效的CSS动画
      .rain-effect {
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="20" viewBox="0 0 10 20"><line x1="5" y1="0" x2="5" y2="10" stroke="white" stroke-width="1" /></svg>');
        width: 100%;
        height: 100%;
        position: absolute;
        animation: rain 0.5s linear infinite;
        opacity: 0.7;
      }
      
      .snow-effect {
        background-image: radial-gradient(circle, white 1px, transparent 1px);
        background-size: 15px 15px;
        width: 100%;
        height: 100%;
        position: absolute;
        animation: snow 5s linear infinite;
        opacity: 0.7;
      }
      
      .fog-effect {
        background: linear-gradient(to bottom, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%);
        width: 100%;
        height: 100%;
        position: absolute;
        opacity: 0.5;
      }
      
      .leaves-effect {
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path d="M10,0 Q15,5 10,10 Q5,15 10,20 Q15,15 10,10 Q5,5 10,0" fill="%23654321" /></svg>');
        background-size: 20px 20px;
        width: 100%;
        height: 100%;
        position: absolute;
        animation: leaves 10s linear infinite;
        opacity: 0.5;
      }
    }
  }
  
  .preview-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .switcher-title {
      margin-bottom: 0.5rem;
      font-size: 1rem;
      color: #333;
    }
    
    .scene-actions {
      display: flex;
      gap: 1rem;
    }
  }
}

// 动画效果
@keyframes rain {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 0 20px;
  }
}

@keyframes snow {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 15px 15px;
  }
}

@keyframes leaves {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 20px 20px;
  }
}
</style>