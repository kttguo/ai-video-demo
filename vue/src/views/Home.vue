<template>
  <div class="home-container">
    <!-- 顶部Banner区域 -->
    <section class="banner-section">
      <el-carousel height="400px">
        <el-carousel-item v-for="item in 4" :key="item">
          <div class="banner-item banner-item-{{ item }}">
            <h2>AI剧本生成系统</h2>
            <p>轻松创建专业级剧本，释放你的创作潜能</p>
            <el-button type="primary" size="large" @click="$router.push('/character')">快速开始</el-button>
          </div>
        </el-carousel-item>
      </el-carousel>
    </section>

    <!-- 中部功能模块展示区 -->
    <section class="features-section">
      <h2 class="section-title">核心功能</h2>
      <div class="features-grid">
        <div class="feature-card" @click="$router.push('/storyline')">
          <div class="feature-icon">
            <el-icon><Connection /></el-icon>
          </div>
          <h3>写故事</h3>
          <p>创建引人入胜的故事情节，打造精彩剧本</p>
        </div>
        <div class="feature-card" @click="$router.push('/character')">
          <div class="feature-icon">
            <el-icon><User /></el-icon>
          </div>
          <h3>角色创建</h3>
          <p>打造独特的角色形象，定制个性与外观</p>
        </div>

        <div class="feature-card" @click="$router.push('/scene')">
          <div class="feature-icon">
            <el-icon><Picture /></el-icon>
          </div>
          <h3>场景生成</h3>
          <p>构建丰富多彩的场景，营造完美氛围</p>
        </div>

        
      </div>
    </section>

    <!-- 底部作品展示区 -->
    <section class="showcase-section">
      <h2 class="section-title">优秀作品</h2>
      
      <div class="showcase-filter">
        <el-tag 
          v-for="tag in tags" 
          :key="tag.value"
          :type="activeTag === tag.value ? '' : 'info'"
          effect="plain"
          @click="activeTag = tag.value"
        >
          {{ tag.label }}
        </el-tag>
      </div>

      <div class="showcase-grid">
        <div class="showcase-item" v-for="item in 6" :key="item">
          <div class="showcase-cover">
            <img :src="`https://picsum.photos/300/200?random=${item}`" alt="作品封面" />
          </div>
          <div class="showcase-info">
            <h3>示例作品 {{ item }}</h3>
            <p>这是一个由AI生成的精彩剧本示例</p>
          </div>
        </div>
      </div>

      <div class="showcase-pagination">
        <el-pagination 
          layout="prev, pager, next" 
          :total="50"
          :page-size="10"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { User, Picture, Connection } from '@element-plus/icons-vue'

const activeTag = ref('all')
const tags = [
  { label: '全部', value: 'all' },
  { label: '悬疑', value: 'suspense' },
  { label: '爱情', value: 'romance' },
  { label: '科幻', value: 'scifi' },
  { label: '冒险', value: 'adventure' },
  { label: '喜剧', value: 'comedy' }
]
</script>

<style lang="scss" scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
  color: #333;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 60px;
    height: 3px;
    background-color: #409eff;
  }
}

// Banner区域样式
.banner-section {
  margin-bottom: 3rem;
  
  .banner-item {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    background-size: cover;
    background-position: center;
    text-align: center;
    padding: 2rem;
    
    h2 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    }
    
    p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      max-width: 600px;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }
  }
  
  .banner-item-1 {
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://picsum.photos/1200/400?random=1');
  }
  
  .banner-item-2 {
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://picsum.photos/1200/400?random=2');
  }
  
  .banner-item-3 {
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://picsum.photos/1200/400?random=3');
  }
  
  .banner-item-4 {
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://picsum.photos/1200/400?random=4');
  }
}

// 功能模块展示区样式
.features-section {
  margin-bottom: 3rem;
  
  .features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
  
  .feature-card {
    background-color: #fff;
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s, box-shadow 0.3s;
    cursor: pointer;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
    
    .feature-icon {
      width: 80px;
      height: 80px;
      margin: 0 auto 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #ecf5ff;
      border-radius: 50%;
      
      .el-icon {
        font-size: 2rem;
        color: #409eff;
      }
    }
    
    h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
      color: #333;
    }
    
    p {
      color: #666;
      line-height: 1.6;
    }
  }
}

// 作品展示区样式
.showcase-section {
  margin-bottom: 3rem;
  
  .showcase-filter {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 2rem;
    
    .el-tag {
      cursor: pointer;
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }
  }
  
  .showcase-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
    margin-bottom: 2rem;
    
    @media (max-width: 992px) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @media (max-width: 576px) {
      grid-template-columns: 1fr;
    }
  }
  
  .showcase-item {
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s;
    
    &:hover {
      transform: translateY(-5px);
    }
    
    .showcase-cover {
      height: 200px;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s;
      }
      
      &:hover img {
        transform: scale(1.05);
      }
    }
    
    .showcase-info {
      padding: 1.5rem;
      
      h3 {
        margin-bottom: 0.5rem;
        font-size: 1.2rem;
        color: #333;
      }
      
      p {
        color: #666;
        font-size: 0.9rem;
      }
    }
  }
  
  .showcase-pagination {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }
}
</style>