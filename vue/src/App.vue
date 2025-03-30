<template>
  <div class="app-container">
    <header class="app-header">
      <div class="logo">AI剧本生成系统</div>
      <nav class="main-nav">
        <router-link to="/">首页</router-link>
        <router-link to="/storyline">写故事</router-link>
        <router-link to="/character">角色创建</router-link>
        <router-link to="/scene">场景生成</router-link>
        <router-link to="/materials">素材库</router-link>
      </nav>
      <div class="user-area">
        <el-button type="primary">登录</el-button>
      </div>
    </header>

    <main class="app-main">
      <router-view />
    </main>

    <footer class="app-footer">
      <p>© 2023 AI剧本生成系统 - 版权所有</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
// 组件导入和逻辑将在这里
</script>

<style lang="scss">
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  .logo {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
  }

  .main-nav {
    display: flex;
    gap: 1.5rem;

    a {
      text-decoration: none;
      color: #333;
      font-weight: 500;
      padding: 0.5rem 0;
      position: relative;

      &.router-link-active {
        color: #409eff;

        &:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #409eff;
        }
      }
    }
  }
}

.app-main {
  flex: 1;
  padding: 2rem;
}

.app-footer {
  text-align: center;
  padding: 1rem;
  background-color: #f5f5f5;
  margin-top: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    padding: 1rem;

    .main-nav {
      margin: 1rem 0;
      width: 100%;
      justify-content: center;
      flex-wrap: wrap;
    }
  }
}
</style>