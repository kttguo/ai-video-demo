<template>
  <div class="storyline-container">
    <h1 class="page-title">故事线编辑</h1>
    
    <div class="storyline-content">
      <!-- 左侧：故事结构导航 -->
      <div class="storyline-panel storyline-structure-panel">
        <h2 class="panel-title">故事结构</h2>
        
        <div class="panel-content">
          <div class="structure-visualization">
            <!-- 三幕式结构可视化 -->
            <div class="act-section">
              <div class="act-header" @click="toggleAct(1)">
                <h3>第一幕：开端</h3>
                <el-icon :class="{ 'is-rotate': expandedActs.includes(1) }">
                  <ArrowDown />
                </el-icon>
              </div>
              
              <div class="act-content" v-show="expandedActs.includes(1)">
                <div 
                  v-for="node in actNodes.act1" 
                  :key="node.id"
                  class="structure-node"
                  :class="{ active: selectedNode && selectedNode.id === node.id }"
                  @click="selectNode(node)"
                >
                  <div class="node-indicator"></div>
                  <div class="node-content">
                    <h4>{{ node.title }}</h4>
                    <p>{{ node.summary }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="act-section">
              <div class="act-header" @click="toggleAct(2)">
                <h3>第二幕：发展</h3>
                <el-icon :class="{ 'is-rotate': expandedActs.includes(2) }">
                  <ArrowDown />
                </el-icon>
              </div>
              
              <div class="act-content" v-show="expandedActs.includes(2)">
                <div 
                  v-for="node in actNodes.act2" 
                  :key="node.id"
                  class="structure-node"
                  :class="{ active: selectedNode && selectedNode.id === node.id }"
                  @click="selectNode(node)"
                >
                  <div class="node-indicator"></div>
                  <div class="node-content">
                    <h4>{{ node.title }}</h4>
                    <p>{{ node.summary }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="act-section">
              <div class="act-header" @click="toggleAct(3)">
                <h3>第三幕：结局</h3>
                <el-icon :class="{ 'is-rotate': expandedActs.includes(3) }">
                  <ArrowDown />
                </el-icon>
              </div>
              
              <div class="act-content" v-show="expandedActs.includes(3)">
                <div 
                  v-for="node in actNodes.act3" 
                  :key="node.id"
                  class="structure-node"
                  :class="{ active: selectedNode && selectedNode.id === node.id }"
                  @click="selectNode(node)"
                >
                  <div class="node-indicator"></div>
                  <div class="node-content">
                    <h4>{{ node.title }}</h4>
                    <p>{{ node.summary }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="structure-actions">
            <el-button type="primary" plain size="small" @click="addNewNode">
              <el-icon><Plus /></el-icon> 添加节点
            </el-button>
          </div>
        </div>
      </div>
      
      <!-- 主区域：情节编辑器 -->
      <div class="storyline-panel storyline-editor-panel">
        <h2 class="panel-title">情节编辑器</h2>
        
        <div class="panel-content">
          <div class="timeline-editor">
            <!-- 时间轴式布局 -->
            <div class="timeline-track">
              <div class="timeline-line"></div>
              
              <draggable 
                v-model="timelineNodes" 
                item-key="id"
                ghost-class="ghost-node"
                chosen-class="chosen-node"
                animation="300"
                @end="onDragEnd"
              >
                <template #item="{ element }">
                  <div 
                    class="timeline-node"
                    :class="{ active: selectedNode && selectedNode.id === element.id }"
                    @click="selectNode(element)"
                  >
                    <div class="node-point"></div>
                    <div class="node-card">
                      <h3>{{ element.title }}</h3>
                      <p>{{ element.summary }}</p>
                      <div class="node-tags">
                        <el-tag size="small" type="info">{{ getActName(element.act) }}</el-tag>
                        <el-tag size="small" type="success" v-if="element.emotionIntensity > 7">高情绪</el-tag>
                        <el-tag size="small" type="warning" v-if="element.isKeyPoint">关键点</el-tag>
                      </div>
                    </div>
                  </div>
                </template>
              </draggable>
            </div>
          </div>
          
          <div class="editor-actions">
            <el-button-group>
              <el-button type="primary" @click="saveStoryline">保存故事线</el-button>
              <el-button type="default" @click="previewStoryline">预览</el-button>
              <el-button type="danger" plain @click="resetStoryline">重置</el-button>
            </el-button-group>
          </div>
        </div>
      </div>
      
      <!-- 右侧：情节详情面板 -->
      <div class="storyline-panel storyline-detail-panel">
        <h2 class="panel-title">情节详情</h2>
        
        <div class="panel-content">
          <template v-if="selectedNode">
            <div class="detail-form">
              <el-form label-position="top">
                <el-form-item label="情节标题">
                  <el-input v-model="selectedNode.title"></el-input>
                </el-form-item>
                
                <el-form-item label="所属幕">
                  <el-select v-model="selectedNode.act" style="width: 100%">
                    <el-option label="第一幕：开端" :value="1"></el-option>
                    <el-option label="第二幕：发展" :value="2"></el-option>
                    <el-option label="第三幕：结局" :value="3"></el-option>
                  </el-select>
                </el-form-item>
                
                <el-form-item label="情节描述">
                  <el-input 
                    type="textarea" 
                    v-model="selectedNode.description" 
                    :rows="4"
                  ></el-input>
                </el-form-item>
                
                <el-form-item label="情节选项">
                  <div class="plot-options">
                    <div 
                      v-for="(option, index) in selectedNode.options" 
                      :key="index"
                      class="plot-option"
                      :class="{ active: selectedNode.selectedOption === index }"
                      @click="selectOption(index)"
                    >
                      <div class="option-header">
                        <span class="option-number">选项 {{ index + 1 }}</span>
                        <el-tag size="small" v-if="selectedNode.selectedOption === index">已选</el-tag>
                      </div>
                      <p>{{ option }}</p>
                    </div>
                    
                    <div class="custom-option">
                      <el-input 
                        type="textarea" 
                        v-model="customOption" 
                        :rows="2"
                        placeholder="输入自定义情节..."
                      ></el-input>
                      <el-button size="small" @click="addCustomOption">添加</el-button>
                    </div>
                  </div>
                </el-form-item>
                
                <el-form-item label="情绪强度">
                  <el-slider 
                    v-model="selectedNode.emotionIntensity" 
                    :min="1" 
                    :max="10"
                    :marks="{
                      1: '平静',
                      5: '中等',
                      10: '强烈'
                    }"
                  ></el-slider>
                </el-form-item>
                
                <el-form-item>
                  <el-checkbox v-model="selectedNode.isKeyPoint">标记为关键情节点</el-checkbox>
                </el-form-item>
              </el-form>
              
              <div class="detail-actions">
                <el-button type="danger" plain size="small" @click="deleteNode">
                  <el-icon><Delete /></el-icon> 删除节点
                </el-button>
              </div>
            </div>
          </template>
          
          <div class="empty-detail" v-else>
            <el-empty description="请选择一个情节节点"></el-empty>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 预览窗口 -->
    <el-dialog
      v-model="previewVisible"
      title="故事线预览"
      width="70%"
    >
      <div class="storyline-preview">
        <div class="preview-node" v-for="node in timelineNodes" :key="node.id">
          <h3>{{ node.title }}</h3>
          <p class="preview-description">{{ node.description }}</p>
          <div class="preview-option" v-if="node.options && node.options.length > 0 && node.selectedOption !== null">
            <strong>选择的情节：</strong> {{ node.options[node.selectedOption] }}
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ArrowDown, Plus, Delete } from '@element-plus/icons-vue'
import draggable from 'vuedraggable'

// 展开的幕
const expandedActs = ref([1])

// 切换幕的展开/收起状态
const toggleAct = (act: number) => {
  const index = expandedActs.value.indexOf(act)
  if (index === -1) {
    expandedActs.value.push(act)
  } else {
    expandedActs.value.splice(index, 1)
  }
}

// 示例节点数据
const nodes = ref([
  {
    id: 1,
    title: '主角介绍',
    summary: '介绍主角的背景和性格',
    description: '故事开始，我们的主角小明是一个普通的大学生，性格内向但心地善良。他有一个梦想，就是成为一名优秀的程序员。',
    act: 1,
    options: [
      '小明来自农村，是家里第一个上大学的人',
      '小明是城市里的独生子，父母对他期望很高',
      '小明是孤儿，靠自己的努力考上了大学'
    ],
    selectedOption: 0,
    emotionIntensity: 3,
    isKeyPoint: true
  },
  {
    id: 2,
    title: '遇到挑战',
    summary: '主角面临的第一个挑战',
    description: '小明在大学里遇到了编程课的挑战，他发现自己的基础比其他同学差很多。',
    act: 1,
    options: [
      '小明决定熬夜苦学，追赶上其他同学',
      '小明寻求老师的帮助',
      '小明找到了一个学习小组加入'
    ],
    selectedOption: 2,
    emotionIntensity: 5,
    isKeyPoint: false
  },
  {
    id: 3,
    title: '遇到导师',
    summary: '主角遇到了改变他命运的人',
    description: '小明在学习小组中认识了一位计算机系的学长，他愿意指导小明学习编程。',
    act: 1,
    options: [
      '学长是一位严厉但负责的导师',
      '学长是一位幽默风趣的天才程序员',
      '学长是业界知名的程序员，隐藏身份在校园中'
    ],
    selectedOption: 1,
    emotionIntensity: 6,
    isKeyPoint: true
  },
  {
    id: 4,
    title: '第一次成功',
    summary: '主角取得第一次成就',
    description: '在学长的指导下，小明完成了他的第一个项目，并在班级展示中获得了好评。',
    act: 2,
    options: [
      '项目是一个简单但实用的手机应用',
      '项目是一个创新的算法解决方案',
      '项目是一个小游戏，受到同学们的喜爱'
    ],
    selectedOption: 2,
    emotionIntensity: 8,
    isKeyPoint: true
  },
  {
    id: 5,
    title: '新的挑战',
    summary: '主角面临更大的挑战',
    description: '小明决定参加一个全国性的编程比赛，但竞争非常激烈。',
    act: 2,
    options: [
      '小明日以继夜地准备比赛',
      '小明和学长组队参赛',
      '小明组建了一个校园团队一起参赛'
    ],
    selectedOption: 1,
    emotionIntensity: 7,
    isKeyPoint: false
  },
  {
    id: 6,
    title: '失败与挫折',
    summary: '主角遭遇失败',
    description: '比赛中，小明的方案在最后关头出现了bug，导致他们失去了获胜的机会。',
    act: 2,
    options: [
      '小明陷入自责和沮丧',
      '小明从失败中学习，决心改进',
      '小明质疑自己是否适合编程这条路'
    ],
    selectedOption: 1,
    emotionIntensity: 9,
    isKeyPoint: true
  },
  {
    id: 7,
    title: '最终挑战',
    summary: '主角面临最大的考验',
    description: '一家知名科技公司来学校招聘，小明决定应聘，但他需要完成一个高难度的编程挑战。',
    act: 3,
    options: [
      '小明独自一人完成挑战',
      '小明和学长一起攻克难题',
      '小明组织了一个团队合作解决问题'
    ],
    selectedOption: 0,
    emotionIntensity: 8,
    isKeyPoint: true
  },
  {
    id: 8,
    title: '成功与成长',
    summary: '主角最终取得成功',
    description: '经过不懈努力，小明成功完成了挑战，得到了科技公司的录用offer。',
    act: 3,
    options: [
      '小明接受offer，开始了他的职业生涯',
      '小明决定继续深造，攻读研究生',
      '小明创办了自己的小型创业公司'
    ],
    selectedOption: 0,
    emotionIntensity: 10,
    isKeyPoint: true
  }
])

// 按幕分组的节点
const actNodes = computed(() => {
  return {
    act1: nodes.value.filter(node => node.act === 1),
    act2: nodes.value.filter(node => node.act === 2),
    act3: nodes.value.filter(node => node.act === 3)
  }
})

// 时间轴节点
const timelineNodes = ref([...nodes.value].sort((a, b) => a.id - b.id))

// 当前选中的节点
const selectedNode = ref(null)

// 自定义选项
const customOption = ref('')

// 预览窗口可见性
const previewVisible = ref(false)

// 选择节点
const selectNode = (node) => {
  selectedNode.value = node
}

// 选择情节选项
const selectOption = (index) => {
  if (selectedNode.value) {
    selectedNode.value.selectedOption = index
  }
}

// 添加自定义选项
const addCustomOption = () => {
  if (selectedNode.value && customOption.value.trim()) {
    selectedNode.value.options.push(customOption.value)
    selectedNode.value.selectedOption = selectedNode.value.options.length - 1
    customOption.value = ''
  }
}

// 获取幕名称
const getActName = (act) => {
  switch (act) {
    case 1: return '第一幕'
    case 2: return '第二幕'
    case 3: return '第三幕'
    default: return '未知'
  }
}

// 拖拽结束后更新节点顺序
const onDragEnd = () => {
  // 这里可以添加逻辑来保存新的节点顺序
  console.log('节点顺序已更新', timelineNodes.value)
}

// 添加新节点
const addNewNode = () => {
  const newId = Math.max(...nodes.value.map(node => node.id)) + 1
  const newNode = {
    id: newId,
    title: '新情节',
    summary: '请添加情节摘要',
    description: '',
    act: 1,
    options: [],
    selectedOption: null,
    emotionIntensity: 5,
    isKeyPoint: false
  }
  
  nodes.value.push(newNode)
  timelineNodes.value.push(newNode)
  selectedNode.value = newNode
}

// 删除节点
const deleteNode = () => {
  if (!selectedNode.value) return
  
  const id = selectedNode.value.id
  const nodeIndex = nodes.value.findIndex(node => node.id === id)
  const timelineIndex = timelineNodes.value.findIndex(node => node.id === id)
  
  if (nodeIndex !== -1) {
    nodes.value.splice(nodeIndex, 1)
  }
  
  if (timelineIndex !== -1) {
    timelineNodes.value.splice(timelineIndex, 1)
  }
  
  selectedNode.value = null
}

// 保存故事线
const saveStoryline = () => {
  // 这里应该调用保存接口
  console.log('保存故事线', {
    nodes: nodes.value,
    timeline: timelineNodes.value
  })
}

// 预览故事线
const previewStoryline = () => {
  previewVisible.value = true
}

// 重置故事线
const resetStoryline = () => {
  // 这里应该添加确认对话框
  if (confirm('确定要重置故事线吗？所有未保存的更改将丢失。')) {
    // 重置逻辑
    // 这里可以重新加载初始数据或清空数据
  }
}
</script>

<style lang="scss" scoped>
.storyline-container {
  max-width: 1600px;
  margin: 0 auto;
}

.page-title {
  margin-bottom: 2rem;
  font-size: 2rem;
  color: #333;
}

.storyline-content {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 1400px) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
}

// 面板通用样式
.storyline-panel {
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

// 故事结构面板样式
.storyline-structure-panel {
  .structure-visualization {
    margin-bottom: 1.5rem;
  }
  
  .act-section {
    margin-bottom: 1.5rem;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    overflow: hidden;
    
    .act-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.8rem 1rem;
      background-color: #f5f7fa;
      cursor: pointer;
      
      h3 {
        margin: 0;
        font-size: 1rem;
        color: #333;
      }
      
      .el-icon {
        transition: transform 0.3s;
        
        &.is-rotate {
          transform: rotate(180deg);
        }
      }
    }
    
    .act-content {
      padding: 1rem;
      animation: fadeIn 0.3s;
    }
  }
  
  .structure-node {
    display: flex;
    align-items: flex-start;
    padding: 0.5rem;
    margin-bottom: 0.8rem;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    
    &:hover {
      background-color: #f5f7fa;
    }
    
    &.active {
      background-color: #ecf5ff;
    }
    
    .node-indicator {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #409eff;
      margin-top: 0.5rem;
      margin-right: 0.8rem;
      flex-shrink: 0;
    }
    
    .node-content {
      h4 {
        margin: 0 0 0.3rem 0;
        font-size: 0.9rem;
        color: #333;
      }
      
      p {
        margin: 0;
        font-size: 0.8rem;
        color: #666;
      }
    }
  }
  
  .structure-actions {
    text-align: center;
  }
}

// 情节编辑器面板样式
.storyline-editor-panel {
  .timeline-editor {
    margin-bottom: 2rem;
  }
  
  .timeline-track {
    position: relative;
    padding: 2rem 0;
    
    .timeline-line {
      position: absolute;
      top: 0;
      left: 20px;
      width: 4px;
      height: 100%;
      background-color: #e4e7ed;
      z-index: 1;
    }
  }
  
  .timeline-node {
    display: flex;
    align-items: flex-start;
    margin-bottom: 2rem;
    position: relative;
    z-index: 2;
    
    .node-point {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background-color: #409eff;
      border: 3px solid #fff;
      box-shadow: 0 0 0 2px #c6e2ff;
      margin-right: 1.5rem;
      margin-top: 1rem;
      flex-shrink: 0;
      position: relative;
      z-index: 3;
    }
    
    .node-card {
      flex-grow: 1;
      background-color: #fff;
      border-radius: 8px;
      padding: 1rem;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s, box-shadow 0.3s;
      
      h3 {
        margin: 0 0 0.5rem 0;
        font-size: 1.1rem;
        color: #333;
      }
      
      p {
        margin: 0 0 0.8rem 0;
        color: #666;
        font-size: 0.9rem;
      }
      
      .node-tags {
        display: flex;
        gap: 0.5rem;
      }
    }
    
    &:hover .node-card {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }
    
    &.active .node-card {
      border: 1px solid #409eff;
      background-color: #ecf5ff;
    }
  }
  
  .ghost-node {
    opacity: 0.5;
  }
  
  .chosen-node {
    .node-card {
      border: 1px dashed #409eff;
    }
  }
  
  .editor-actions {
    display: flex;
    justify-content: center;
  }
}

// 情节详情面板样式
.storyline-detail-panel {
  .detail-form {
    animation: fadeIn 0.3s;
  }
  
  .plot-options {
    margin-bottom: 1rem;
    
    .plot-option {
      padding: 0.8rem;
      border: 1px solid #e4e7ed;
      border-radius: 4px;
      margin-bottom: 0.8rem;
      cursor: pointer;
      transition: all 0.3s;
      
      .option-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
        
        .option-number {
          font-weight: 500;
          color: #333;
        }
      }
      
      p {
        margin: 0;
        color: #666;
        font-size: 0.9rem;
      }
      
      &:hover {
        border-color: #c6e2ff;
      }
      
      &.active {
        background-color: #ecf5ff;
        border-color: #409eff;
      }
    }
    
    .custom-option {
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      
      .el