<template>
  <div class="character-container">
    <h1 class="page-title">角色创建</h1>
    
    <div class="character-content">
      <!-- 左侧：角色参数设置面板 -->
      <div class="character-panel character-params-panel">
        <h2 class="panel-title">角色参数</h2>
        
        <div class="panel-content">
          <!-- 创建方式选择 -->
          <div class="param-section">
            <h3 class="section-title">创建方式</h3>
            <el-radio-group v-model="createMethod" size="large">
              <el-radio-button label="ai">AI生成</el-radio-button>
              <el-radio-button label="material">素材库</el-radio-button>
            </el-radio-group>
          </div>
          
          <!-- 基础信息输入 -->
          <div class="param-section">
            <h3 class="section-title">基础信息</h3>
            
            <el-form label-position="top">
              <el-form-item label="姓名">
                <el-input v-model="characterInfo.name" placeholder="请输入角色姓名"></el-input>
              </el-form-item>
              
              <el-form-item label="性别">
                <el-select v-model="characterInfo.gender" placeholder="请选择性别" style="width: 100%">
                  <el-option label="男" value="male"></el-option>
                  <el-option label="女" value="female"></el-option>
                  <el-option label="其他" value="other"></el-option>
                </el-select>
              </el-form-item>
              
              <el-form-item label="年龄">
                <el-input-number v-model="characterInfo.age" :min="1" :max="120" style="width: 100%"></el-input-number>
              </el-form-item>
              
              <el-form-item label="职业">
                <el-input v-model="characterInfo.occupation" placeholder="请输入角色职业"></el-input>
              </el-form-item>
            </el-form>
          </div>
          
          <!-- 性格特征选择 -->
          <div class="param-section">
            <h3 class="section-title">性格特征</h3>
            
            <div class="personality-tags">
              <el-tag 
                v-for="tag in availablePersonalityTags" 
                :key="tag.value"
                :type="characterInfo.personality.includes(tag.value) ? '' : 'info'"
                effect="plain"
                @click="togglePersonality(tag.value)"
                class="personality-tag"
              >
                {{ tag.label }}
              </el-tag>
            </div>
          </div>
          
          <!-- 外观描述输入框（AI生成模式） -->
          <div class="param-section" v-if="createMethod === 'ai'">
            <h3 class="section-title">外观描述</h3>
            <el-input 
              type="textarea" 
              v-model="characterInfo.appearance" 
              :rows="5"
              placeholder="请描述角色的外观特征，如身高、体型、发型、服装等"
            ></el-input>
            
            <div class="ai-generate-actions">
              <el-button type="primary" icon="el-icon-magic-stick" @click="generateCharacter">AI生成角色</el-button>
              <el-tooltip content="使用AI根据您的描述生成角色形象" placement="top">
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
          </div>
          
          <!-- 素材库选择（素材库模式） -->
          <div class="param-section" v-if="createMethod === 'material'">
            <h3 class="section-title">素材选择</h3>
            
            <div class="material-filter">
              <el-select v-model="materialFilter.gender" placeholder="性别" style="width: 100px">
                <el-option label="全部" value="all"></el-option>
                <el-option label="男" value="male"></el-option>
                <el-option label="女" value="female"></el-option>
              </el-select>
              
              <el-select v-model="materialFilter.age" placeholder="年龄段" style="width: 120px">
                <el-option label="全部" value="all"></el-option>
                <el-option label="儿童" value="child"></el-option>
                <el-option label="青少年" value="teen"></el-option>
                <el-option label="成年" value="adult"></el-option>
                <el-option label="老年" value="elder"></el-option>
              </el-select>
              
              <el-select v-model="materialFilter.style" placeholder="风格" style="width: 120px">
                <el-option label="全部" value="all"></el-option>
                <el-option label="写实" value="realistic"></el-option>
                <el-option label="动漫" value="anime"></el-option>
                <el-option label="像素" value="pixel"></el-option>
              </el-select>
            </div>
            
            <div class="material-grid">
              <div 
                v-for="item in 6" 
                :key="item" 
                class="material-item"
                :class="{ active: selectedMaterial === item }"
                @click="selectedMaterial = item"
              >
                <img :src="`https://picsum.photos/100/150?random=${item}`" alt="角色素材" />
              </div>
            </div>
            
            <el-pagination 
              layout="prev, pager, next" 
              :total="30"
              :page-size="6"
              class="material-pagination"
            />
          </div>
        </div>
      </div>
      
      <!-- 中央：角色预览区 -->
      <div class="character-panel character-preview-panel">
        <h2 class="panel-title">角色预览</h2>
        
        <div class="panel-content preview-content">
          <div class="character-preview">
            <img 
              :src="previewImage || 'https://picsum.photos/400/600?random=1'" 
              alt="角色预览" 
              class="preview-image"
            />
          </div>
          
          <div class="preview-controls">
            <el-button-group>
              <el-button type="default">正面</el-button>
              <el-button type="default">侧面</el-button>
              <el-button type="default">背面</el-button>
            </el-button-group>
          </div>
          
          <div class="character-info-preview">
            <h3>{{ characterInfo.name || '未命名角色' }}</h3>
            <p>{{ characterInfo.gender === 'male' ? '男' : characterInfo.gender === 'female' ? '女' : '其他' }} | {{ characterInfo.age || '--' }}岁 | {{ characterInfo.occupation || '未设置职业' }}</p>
            <div class="personality-preview">
              <el-tag 
                v-for="tag in selectedPersonalityTags" 
                :key="tag.value"
                size="small"
                class="preview-tag"
              >
                {{ tag.label }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧：风格调整面板 -->
      <div class="character-panel character-style-panel">
        <h2 class="panel-title">风格调整</h2>
        
        <div class="panel-content">
          <!-- 画风切换 -->
          <div class="style-section">
            <h3 class="section-title">画风选择</h3>
            
            <div class="style-options">
              <div 
                class="style-option" 
                :class="{ active: characterStyle.artStyle === 'realistic' }"
                @click="characterStyle.artStyle = 'realistic'"
              >
                <img src="https://picsum.photos/100/100?random=1" alt="写实风格" />
                <span>写实</span>
              </div>
              
              <div 
                class="style-option" 
                :class="{ active: characterStyle.artStyle === 'anime' }"
                @click="characterStyle.artStyle = 'anime'"
              >
                <img src="https://picsum.photos/100/100?random=2" alt="动漫风格" />
                <span>动漫</span>
              </div>
              
              <div 
                class="style-option" 
                :class="{ active: characterStyle.artStyle === 'pixel' }"
                @click="characterStyle.artStyle = 'pixel'"
              >
                <img src="https://picsum.photos/100/100?random=3" alt="像素风格" />
                <span>像素</span>
              </div>
            </div>
          </div>
          
          <!-- 细节调整选项 -->
          <div class="style-section">
            <h3 class="section-title">细节调整</h3>
            
            <div class="style-sliders">
              <div class="style-slider">
                <span class="slider-label">明暗对比</span>
                <el-slider v-model="characterStyle.contrast" :min="0" :max="100"></el-slider>
              </div>
              
              <div class="style-slider">
                <span class="slider-label">色彩饱和度</span>
                <el-slider v-model="characterStyle.saturation" :min="0" :max="100"></el-slider>
              </div>
              
              <div class="style-slider">
                <span class="slider-label">细节丰富度</span>
                <el-slider v-model="characterStyle.detailLevel" :min="0" :max="100"></el-slider>
              </div>
            </div>
          </div>
          
          <!-- 确认/重置按钮 -->
          <div class="style-actions">
            <el-button type="primary" @click="saveCharacter">保存角色</el-button>
            <el-button type="default" @click="resetCharacter">重置</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { QuestionFilled } from '@element-plus/icons-vue'

// 创建方式
const createMethod = ref('ai')

// 角色信息
const characterInfo = ref({
  name: '',
  gender: '',
  age: 25,
  occupation: '',
  personality: [],
  appearance: ''
})

// 素材筛选
const materialFilter = ref({
  gender: 'all',
  age: 'all',
  style: 'all'
})

// 选中的素材
const selectedMaterial = ref(null)

// 角色风格
const characterStyle = ref({
  artStyle: 'realistic',
  contrast: 50,
  saturation: 50,
  detailLevel: 50
})

// 预览图片
const previewImage = ref('')

// 可用的性格特征标签
const availablePersonalityTags = [
  { label: '开朗', value: 'cheerful' },
  { label: '内向', value: 'introverted' },
  { label: '勇敢', value: 'brave' },
  { label: '谨慎', value: 'cautious' },
  { label: '聪明', value: 'smart' },
  { label: '固执', value: 'stubborn' },
  { label: '善良', value: 'kind' },
  { label: '冷酷', value: 'cold' },
  { label: '幽默', value: 'humorous' },
  { label: '忠诚', value: 'loyal' },
  { label: '叛逆', value: 'rebellious' },
  { label: '浪漫', value: 'romantic' }
]

// 已选择的性格特征标签
const selectedPersonalityTags = computed(() => {
  return availablePersonalityTags.filter(tag => characterInfo.value.personality.includes(tag.value))
})

// 切换性格特征
const togglePersonality = (value: string) => {
  const index = characterInfo.value.personality.indexOf(value)
  if (index === -1) {
    // 最多选择5个特征
    if (characterInfo.value.personality.length < 5) {
      characterInfo.value.personality.push(value)
    } else {
      // 可以添加提示：最多选择5个特征
    }
  } else {
    characterInfo.value.personality.splice(index, 1)
  }
}

// AI生成角色
const generateCharacter = () => {
  // 这里应该调用AI生成接口
  console.log('生成角色', characterInfo.value)
  // 模拟生成结果
  setTimeout(() => {
    previewImage.value = `https://picsum.photos/400/600?random=${Math.floor(Math.random() * 100)}`
  }, 1000)
}

// 保存角色
const saveCharacter = () => {
  // 保存角色信息
  console.log('保存角色', {
    ...characterInfo.value,
    style: characterStyle.value
  })
  // 这里应该调用保存接口
}

// 重置角色
const resetCharacter = () => {
  characterInfo.value = {
    name: '',
    gender: '',
    age: 25,
    occupation: '',
    personality: [],
    appearance: ''
  }
  characterStyle.value = {
    artStyle: 'realistic',
    contrast: 50,
    saturation: 50,
    detailLevel: 50
  }
  previewImage.value = ''
  selectedMaterial.value = null
}
</script>

<style lang="scss" scoped>
.character-container {
  max-width: 1400px;
  margin: 0 auto;
}

.page-title {
  margin-bottom: 2rem;
  font-size: 2rem;
  color: #333;
}

.character-content {
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.character-panel {
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
    max-height: 700px;
    overflow-y: auto;
  }
}

// 参数面板样式
.character-params-panel {
  .param-section {
    margin-bottom: 1.5rem;
    
    .section-title {
      font-size: 1rem;
      margin-bottom: 1rem;
      color: #333;
      font-weight: 500;
    }
  }
  
  .personality-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    
    .personality-tag {
      cursor: pointer;
    }
  }
  
  .ai-generate-actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
  }
  
  .material-filter {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .material-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    margin-bottom: 1rem;
    
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
    margin-top: 1rem;
    display: flex;
    justify-content: center;
  }
}

// 预览面板样式
.character-preview-panel {
  .preview-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .character-preview {
    width: 100%;
    height: 400px;
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
    
    .preview-image {
      height: 100%;
      object-fit: contain;
    }
  }
  
  .preview-controls {
    margin-bottom: 1.5rem;
  }
  
  .character-info-preview {
    text-align: center;
    width: 100%;
    
    h3 {
      margin-bottom: 0.5rem;
      font-size: 1.5rem;
    }
    
    p {
      margin-bottom: 1rem;
      color: #666;
    }
    
    .personality-preview {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 0.5rem;
    }
  }
}

// 风格面板样式
.character-style-panel {
  .style-section {
    margin-bottom: 2rem;
    
    .section-title {
      font-size: 1rem;
      margin-bottom: 1rem;
      color: #333;
      font-weight: 500;
    }
  }
  
  .style-options {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    
    .style-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      
      img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 8px;
        margin-bottom: 0.5rem;
        border: 2px solid transparent;
        transition: all 0.3s;
      }
      
      span {
        font-size: 0.9rem;
        color: #666;
      }
      
      &.active img {
        border-color: #409eff;
      }
      
      &:hover img {
        transform: scale(1.05);
      }
    }
  }
  
  .style-sliders {
    .style-slider {
      margin-bottom: 1.5rem;
      
      .slider-label {
        display: block;
        margin-bottom: 0.5rem;
        color: #666;
      }
    }
  }
  
  .style-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
  }
}
</style>