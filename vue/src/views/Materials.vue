<template>
  <div class="materials-container">
    <h1 class="page-title">素材库管理</h1>
    
    <div class="materials-content">
      <!-- 顶部：分类导航 -->
      <div class="category-navigation">
        <div class="category-tabs">
          <el-tabs v-model="activeCategory">
            <el-tab-pane label="人物" name="character">
              <template #icon><el-icon><User /></el-icon></template>
            </el-tab-pane>
            <el-tab-pane label="服装" name="costume">
              <template #icon><el-icon><Suitcase /></el-icon></template>
            </el-tab-pane>
            <el-tab-pane label="表情" name="expression">
              <template #icon><el-icon><ChatRound /></el-icon></template>
            </el-tab-pane>
            <el-tab-pane label="情节" name="plot">
              <template #icon><el-icon><Connection /></el-icon></template>
            </el-tab-pane>
            <el-tab-pane label="声音" name="sound">
              <template #icon><el-icon><Microphone /></el-icon></template>
            </el-tab-pane>
          </el-tabs>
        </div>
        
        <div class="search-filter">
          <el-input 
            v-model="searchQuery" 
            placeholder="搜索素材" 
            class="search-input"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          
          <el-dropdown @command="handleFilterChange">
            <el-button type="primary" plain>
              筛选 <el-icon><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="all">全部</el-dropdown-item>
                <el-dropdown-item command="recent">最近使用</el-dropdown-item>
                <el-dropdown-item command="favorite">收藏</el-dropdown-item>
                <el-dropdown-item command="custom">自定义</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      
      <!-- 主区域：素材网格 -->
      <div class="materials-grid-container">
        <div class="materials-grid">
          <div 
            v-for="item in filteredMaterials" 
            :key="item.id"
            class="material-card"
            :class="{ active: selectedMaterial && selectedMaterial.id === item.id }"
            @click="selectMaterial(item)"
          >
            <div class="material-preview">
              <img :src="item.thumbnail" :alt="item.name" />
              <div class="material-actions">
                <el-button 
                  circle 
                  size="small" 
                  @click.stop="toggleFavorite(item)"
                >
                  <el-icon><Star :filled="item.isFavorite" /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="material-info">
              <h3>{{ item.name }}</h3>
              <p>{{ item.type }}</p>
            </div>
          </div>
        </div>
        
        <div class="pagination-container">
          <el-pagination 
            layout="prev, pager, next" 
            :total="totalMaterials"
            :page-size="pageSize"
            :current-page="currentPage"
            @current-change="handlePageChange"
          />
        </div>
      </div>
      
      <!-- 右侧：素材详情抽屉 -->
      <el-drawer
        v-model="drawerVisible"
        title="素材详情"
        direction="rtl"
        size="30%"
      >
        <div class="material-detail" v-if="selectedMaterial">
          <div class="detail-preview">
            <img :src="selectedMaterial.image" :alt="selectedMaterial.name" />
          </div>
          
          <div class="detail-info">
            <h2>{{ selectedMaterial.name }}</h2>
            
            <div class="detail-attributes">
              <div class="attribute-item">
                <span class="attribute-label">类型：</span>
                <span class="attribute-value">{{ selectedMaterial.type }}</span>
              </div>
              
              <div class="attribute-item">
                <span class="attribute-label">创建日期：</span>
                <span class="attribute-value">{{ selectedMaterial.createdAt }}</span>
              </div>
              
              <div class="attribute-item">
                <span class="attribute-label">标签：</span>
                <div class="attribute-tags">
                  <el-tag 
                    v-for="tag in selectedMaterial.tags" 
                    :key="tag"
                    size="small"
                    class="tag-item"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
              </div>
              
              <div class="attribute-item" v-if="selectedMaterial.description">
                <span class="attribute-label">描述：</span>
                <p class="attribute-description">{{ selectedMaterial.description }}</p>
              </div>
            </div>
          </div>
          
          <div class="detail-actions">
            <el-button type="primary" @click="useMaterial">使用素材</el-button>
            <el-button type="default" @click="editMaterial">编辑</el-button>
            <el-button type="danger" plain @click="deleteMaterial">删除</el-button>
          </div>
        </div>
      </el-drawer>
      
      <!-- 上传素材按钮 -->
      <div class="upload-button">
        <el-button type="primary" circle @click="showUploadDialog">
          <el-icon><Plus /></el-icon>
        </el-button>
      </div>
      
      <!-- 上传素材对话框 -->
      <el-dialog
        v-model="uploadDialogVisible"
        title="上传素材"
        width="50%"
      >
        <el-form label-position="top">
          <el-form-item label="素材名称">
            <el-input v-model="newMaterial.name" placeholder="请输入素材名称"></el-input>
          </el-form-item>
          
          <el-form-item label="素材类型">
            <el-select v-model="newMaterial.type" placeholder="请选择素材类型" style="width: 100%">
              <el-option label="人物" value="character"></el-option>
              <el-option label="服装" value="costume"></el-option>
              <el-option label="表情" value="expression"></el-option>
              <el-option label="情节" value="plot"></el-option>
              <el-option label="声音" value="sound"></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="标签">
            <el-tag
              v-for="tag in newMaterial.tags"
              :key="tag"
              closable
              @close="removeTag(tag)"
              class="tag-item"
            >
              {{ tag }}
            </el-tag>
            <el-input
              v-if="tagInputVisible"
              ref="tagInputRef"
              v-model="tagInputValue"
              class="tag-input"
              size="small"
              @keyup.enter="addTag"
              @blur="addTag"
            />
            <el-button v-else size="small" @click="showTagInput">
              + 添加标签
            </el-button>
          </el-form-item>
          
          <el-form-item label="描述">
            <el-input 
              type="textarea" 
              v-model="newMaterial.description" 
              :rows="3"
              placeholder="请输入素材描述"
            ></el-input>
          </el-form-item>
          
          <el-form-item label="上传文件">
            <el-upload
              action="#"
              list-type="picture-card"
              :auto-upload="false"
              :limit="1"
              :on-change="handleFileChange"
            >
              <el-icon><Plus /></el-icon>
            </el-upload>
          </el-form-item>
        </el-form>
        
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="uploadDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="uploadMaterial">上传</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { 
  User, 
  Suitcase, 
  ChatRound, 
  Connection, 
  Microphone, 
  Search, 
  ArrowDown, 
  Star, 
  Plus 
} from '@element-plus/icons-vue'

// 当前选中的分类
const activeCategory = ref('character')

// 搜索和筛选
const searchQuery = ref('')
const currentFilter = ref('all')

// 分页
const currentPage = ref(1)
const pageSize = ref(12)
const totalMaterials = ref(100)

// 素材详情抽屉
const drawerVisible = ref(false)
const selectedMaterial = ref(null)

// 上传素材对话框
const uploadDialogVisible = ref(false)
const newMaterial = ref({
  name: '',
  type: '',
  tags: [],
  description: '',
  file: null
})

// 标签输入
const tagInputVisible = ref(false)
const tagInputValue = ref('')
const tagInputRef = ref(null)

// 示例素材数据
const materials = ref([
  {
    id: 1,
    name: '现代男性角色',
    type: '人物',
    category: 'character',
    thumbnail: 'https://picsum.photos/200/300?random=1',
    image: 'https://picsum.photos/400/600?random=1',
    createdAt: '2023-05-15',
    tags: ['现代', '男性', '成年'],
    description: '一个现代都市男性角色，适合现代剧情。',
    isFavorite: true
  },
  {
    id: 2,
    name: '古代女性角色',
    type: '人物',
    category: 'character',
    thumbnail: 'https://picsum.photos/200/300?random=2',
    image: 'https://picsum.photos/400/600?random=2',
    createdAt: '2023-05-16',
    tags: ['古代', '女性', '成年'],
    description: '一个古代女性角色，适合古装剧情。',
    isFavorite: false
  },
  {
    id: 3,
    name: '现代休闲服装',
    type: '服装',
    category: 'costume',
    thumbnail: 'https://picsum.photos/200/300?random=3',
    image: 'https://picsum.photos/400/600?random=3',
    createdAt: '2023-05-17',
    tags: ['现代', '休闲', '男女通用'],
    description: '一套现代休闲服装，适合日常场景。',
    isFavorite: false
  },
  {
    id: 4,
    name: '古代官服',
    type: '服装',
    category: 'costume',
    thumbnail: 'https://picsum.photos/200/300?random=4',
    image: 'https://picsum.photos/400/600?random=4',
    createdAt: '2023-05-18',
    tags: ['古代', '官服', '男性'],
    description: '一套古代官员服装，适合古装剧情。',
    isFavorite: true
  },
  {
    id: 5,
    name: '微笑表情',
    type: '表情',
    category: 'expression',
    thumbnail: 'https://picsum.photos/200/200?random=5',
    image: 'https://picsum.photos/400/400?random=5',
    createdAt: '2023-05-19',
    tags: ['微笑', '积极', '通用'],
    description: '一个微笑表情，表达友好和愉快。',
    isFavorite: false
  },
  {
    id: 6,
    name: '悲伤表情',
    type: '表情',
    category: 'expression',
    thumbnail: 'https://picsum.photos/200/200?random=6',
    image: 'https://picsum.photos/400/400?random=6',
    createdAt: '2023-05-20',
    tags: ['悲伤', '消极', '通用'],
    description: '一个悲伤表情，表达忧郁和难过。',
    isFavorite: false
  },
  {
    id: 7,
    name: '初次相遇',
    type: '情节',
    category: 'plot',
    thumbnail: 'https://picsum.photos/200/150?random=7',
    image: 'https://picsum.photos/400/300?random=7',
    createdAt: '2023-05-21',
    tags: ['相遇', '开端', '通用'],
    description: '主角们初次相遇的情节模板，适合故事开端。',
    isFavorite: true
  },
  {
    id: 8,
    name: '误会与和解',
    type: '情节',
    category: 'plot',
    thumbnail: 'https://picsum.photos/200/150?random=8',
    image: 'https://picsum.photos/400/300?random=8',
    createdAt: '2023-05-22',
    tags: ['误会', '和解', '通用'],
    description: '角色之间产生误会并最终和解的情节模板。',
    isFavorite: false
  },
  {
    id: 9,
    name: '欢快背景音乐',
    type: '声音',
    category: 'sound',
    thumbnail: 'https://picsum.photos/200/200?random=9',
    image: 'https://picsum.photos/400/400?random=9',
    createdAt: '2023-05-23',
    tags: ['欢快', '背景音乐', '通用'],
    description: '一段欢快的背景音乐，适合轻松愉快的场景。',
    isFavorite: false
  },
  {
    id: 10,
    name: '紧张氛围音效',
    type: '声音',
    category: 'sound',
    thumbnail: 'https://picsum.photos/200/200?random=10',
    image: 'https://picsum.photos/400/400?random=10',
    createdAt: '2023-05-24',
    tags: ['紧张', '氛围', '通用'],
    description: '一段紧张的氛围音效，适合悬疑或紧张场景。',
    isFavorite: true
  },
  {
    id: 11,
    name: '科幻男性角色',
    type: '人物',
    category: 'character',
    thumbnail: 'https://picsum.photos/200/300?random=11',
    image: 'https://picsum.photos/400/600?random=11',
    createdAt: '2023-05-25',
    tags: ['科幻', '男性', '成年'],
    description: '一个科幻世界的男性角色，适合科幻剧情。',
    isFavorite: false
  },
  {
    id: 12,
    name: '奇幻女性角色',
    type: '人物',
    category: 'character',
    thumbnail: 'https://picsum.photos/200/300?random=12',
    image: 'https://picsum.photos/400/600?random=12',
    createdAt: '2023-05-26',
    tags: ['奇幻', '女性', '成年'],
    description: '一个奇幻世界的女性角色，适合奇幻剧情。',
    isFavorite: false
  }
])

// 筛选后的素材
const filteredMaterials = computed(() => {
  let result = materials.value
  
  // 按分类筛选
  if (activeCategory.value !== 'all') {
    result = result.filter(item => item.category === activeCategory.value)
  }
  
  // 按搜索关键词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => {
      return (
        item.name.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query)) ||
        (item.description && item.description.toLowerCase().includes(query))
      )
    })
  }
  
  // 按筛选条件筛选
  if (currentFilter.value === 'favorite') {
    result = result.filter(item => item.isFavorite)
  } else if (currentFilter.value === 'recent') {
    // 这里应该按照最近使用时间排序，这里简化为按创建时间倒序
    result = [...result].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }
  
  return result
})

// 选择素材
const selectMaterial = (material) => {
  selectedMaterial.value = material
  drawerVisible.value = true
}

// 切换收藏状态
const toggleFavorite = (material) => {
  material.isFavorite = !material.isFavorite
}

// 处理筛选变化
const handleFilterChange = (command) => {
  currentFilter.value = command
}

// 处理分页变化
const handlePageChange = (page) => {
  currentPage.value = page
  // 这里应该加载对应页的数据
}

// 使用素材
const useMaterial = () => {
  // 这里应该实现使用素材的逻辑
  console.log('使用素材', selectedMaterial.value)
  drawerVisible.value = false
}

// 编辑素材
const editMaterial = () => {
  // 这里应该实现编辑素材的逻辑
  console.log('编辑素材', selectedMaterial.value)
}

// 删除素材
const deleteMaterial = () => {
  // 这里应该实现删除素材的逻辑
  if (confirm(`确定要删除素材「${selectedMaterial.value.name}」吗？`)) {
    console.log('删除素材', selectedMaterial.value)
    const index = materials.value.findIndex(item => item.id === selectedMaterial.value.id)
    if (index !== -1) {
      materials.value.splice(index, 1)
    }
    drawerVisible.value = false
  }
}

// 显示上传对话框
const showUploadDialog = () => {
  newMaterial.value = {
    name: '',
    type: '',
    tags: [],
    description: '',
    file: null
  }
  uploadDialogVisible.value = true
}

// 显示标签输入框
const showTagInput = () => {
  tagInputVisible.value = true
  nextTick(() => {
    tagInputRef.value.focus()
  })
}

// 添加标签
const addTag = () => {
  if (tagInputValue.value) {
    if (!newMaterial.value.tags.includes(tagInputValue.value)) {
      newMaterial.value.tags.push(tagInputValue.value)
    }
  }
  tagInputVisible.value = false
  tagInputValue.value = ''
}

// 移除标签
const removeTag = (tag) => {
  const index = newMaterial.value.tags.indexOf(tag)
  if (index !== -1) {
    newMaterial.value.tags.splice(index, 1)
  }
}

// 处理文件变化
const handleFileChange = (file) => {
  newMaterial.value.file = file
}

// 上传素材
const uploadMaterial = () => {
  // 这里应该实现上传素材的逻辑
  console.log('上传素材', newMaterial.value)
  // 模拟上传成功
  const newId = Math.max(...materials.value.map(item => item.id)) + 1
  materials.value.push({
    id: newId,
    name: newMaterial.value.name,
    type: newMaterial.value.type === 'character' ? '人物' :
          newMaterial.value.type === 'costume' ? '服装' :
          newMaterial.value.type === 'expression' ? '表情' :
          newMaterial.value.type === 'plot' ? '情节' : '声音',
    category: newMaterial.value.type,
    thumbnail: 'https://picsum.photos/200/300?random=' + newId,
    image: 'https://picsum.photos/400/600?random=' + newId,
    createdAt: new Date().toISOString().split('T')[0],
    tags: [...newMaterial.value.tags],
    description: newMaterial.value.description,
    isFavorite: false
  })
  uploadDialogVisible.value = false
}
</script>

<style lang="scss" scoped>
.materials-container {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
}

.page-title {
  margin-bottom: 2rem;
  font-size: 2rem;
  color: #333;
}

.materials-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

// 分类导航样式
.category-navigation {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
  
  .category-tabs {
    flex-grow: 1;
  }
  
  .search-filter {
    display: flex;
    gap: 1rem;
    
    .search-input {
      width: 200px;
    }
  }
}

// 素材网格样式
.materials-grid-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.materials-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
  
  .material-card {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
    cursor: pointer;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
      
      .material-actions {
        opacity: 1;
      }
    }
    
    &.active {
      border: 2px solid #409eff;
    }
    
    .material-preview {
      position: relative;
      height: 200px;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      .material-actions {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        opacity: 0;
        transition: opacity 0.3s;
      }
    }
    
    .material-info {
      padding: 1rem;
      
      h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
        color: #333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      p {
        margin: 0;
        font-size: 0.9rem;
        color: #666;
      }
    }
  }
}

.pagination-container {
  display: flex;
  justify-content: center;
}

// 素材详情样式
.material-detail {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
  
  .detail-preview {
    text-align: center;
    
    img {
      max-width: 100%;
      max-height: 300px;
      object-fit: contain;
      border-radius: 4px;
    }
  }
  
  .detail-info {
    h2 {
      margin-bottom: 1rem;
      font-size: 1.5rem;
      color: #333;
    }
    
    .detail-attributes {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      
      .attribute-item {
        .attribute-label {
          font-weight: 500;
          color: #333;
          margin-right: 0.5rem;
        }
        
        .attribute-value {
          color: #666;
        }
        
        .attribute-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        
        .attribute-description {
          margin: 0.5rem 0 0 0;
          color: #666;
          line-height: 1.5;
        }
      }
    }
  }
  
  .detail-actions {
    margin-top: auto;
    display: flex;
    gap: 1rem;
  }
}

// 上传按钮样式
.upload-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 10;
  
  .el-button {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
}

// 标签输入样式
.tag-item {
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
}

.tag-input {
  width: 100px;
  margin: 0;
  
  &.el-input {
    .el-input__inner {
      height: 24px;
      line-height: 24px;
    }
  }
}

.el-button {
  margin: 0;
}

// 上传对话框样式
.dialog-footer {
  padding-top: 1rem;
  text-align: right;
  
  .el-button + .el-button {
    margin-left: 1rem;
  }
}

// 动画
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.material-detail {
  animation: fadeIn 0.3s ease-out;
}
</style>