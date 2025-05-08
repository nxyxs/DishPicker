<template>
  <div class="random-picker">
    <div class="picker-container">
      <div class="food-grid">
        <div v-for="(food, idx) in foods" 
             :key="idx" 
             class="food-item"
             :class="{ 'highlight': currentIndex === idx }"
             :style="{ 'animation-delay': `${idx * 0.05}s` }">
          <img v-if="food.image" :src="food.image" :alt="food.name" />
          <div class="food-name">{{ food.name }}</div>
        </div>
      </div>

      <button @click="pickFood" 
              :disabled="foods.length === 0 || isPicking" 
              class="pick-button">
        <span class="btn-text">抽取<br>美食</span>
      </button>
    </div>

    <!-- 结果弹窗 -->
    <div v-if="showResult" class="result-modal" @click="closeResult">
      <div class="result-content" @click.stop>
        <div class="result-image" v-if="selectedFood && selectedFood.image">
          <img :src="selectedFood.image" :alt="selectedFood.name">
        </div>
        <div class="result-name">{{ selectedFood ? selectedFood.name : '' }}</div>
      </div>
    </div>

    <!-- 当前高亮美食名字 -->
    <div v-if="currentIndex !== -1" class="current-food-name">
      {{ currentFood ? currentFood.name : '' }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'RandomPicker',
  data() {
    return {
      foods: [],
      allFoods: [],
      isPicking: false,
      currentIndex: -1,
      selectedFood: null,
      showResult: false,
      intervalId: null
    }
  },
  computed: {
    currentFood() {
      if (this.currentIndex === -1) return null;
      return this.foods[this.currentIndex];
    }
  },
  methods: {
    async loadFoods() {
      try {
        const res = await fetch('/foods.json');
        const all = await res.json();
        this.allFoods = all;
        this.foods = this.getRandomFoods(all, 45);
      } catch (e) {
        this.foods = [];
        this.allFoods = [];
      }
    },
    getRandomFoods(arr, n) {
      const shuffled = arr.slice().sort(() => 0.5 - Math.random());
      return shuffled.slice(0, n);
    },
    pickFood() {
      if (this.allFoods.length === 0 || this.isPicking) return;
      this.isPicking = true;
      let count = 0;
      const duration = 5000; // 5秒
      const interval = 60; // 闪动间隔
      const maxCount = Math.floor(duration / interval);
      const animate = () => {
        if (count < maxCount) {
          // 随机切换顶部美食名称
          this.currentIndex = Math.floor(Math.random() * this.foods.length);
          count++;
          this.intervalId = setTimeout(animate, interval);
        } else {
          const finalIndex = Math.floor(Math.random() * this.allFoods.length);
          this.selectedFood = this.allFoods[finalIndex];
          this.currentIndex = this.foods.findIndex(f => f.name === this.selectedFood.name);
          this.isPicking = false;
          setTimeout(() => {
            this.showResult = true;
          }, 400);
        }
      };
      animate();
    },
    closeResult() {
      this.showResult = false;
      this.currentIndex = -1;
    }
  },
  mounted() {
    this.loadFoods();
  },
  beforeUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
</script>

<style scoped>
.random-picker {
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  overflow: hidden;
  position: relative;
}

.picker-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.food-grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: auto;
  display: grid;
  grid-template-columns: repeat(9, 180px);
  justify-content: center;
  gap: 1.2rem;
  padding: 2.5rem 2rem 2.5rem 2rem;
  box-sizing: border-box;
  overflow: hidden;
  align-items: stretch;
  justify-items: stretch;
  margin: 0 auto;
  z-index: 1;
}

@media (max-width: 1400px) {
  .food-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    padding: 1.5rem 0.5rem;
  }
}

.food-item {
  width: 180px;
  height: 150px;
  aspect-ratio: unset;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  opacity: 0;
  animation: fadeIn 0.5s ease forwards;
  border: 4px solid white;
  background: white;
  min-width: 0;
  min-height: 0;
  display: block;
}

/* 兼容性兜底方案 */
.food-item::before {
  content: '';
  display: block;
  padding-top: 100%;
}

.food-item img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.food-item.highlight {
  transform: scale(1.1);
  box-shadow: 0 8px 16px rgba(231, 76, 60, 0.3);
  z-index: 10;
}

.food-name {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.8rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 1rem;
  text-align: center;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.food-item:hover .food-name {
  transform: translateY(0);
}

.pick-button {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: #e74c3c;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1002;
  font-size: 2rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
  margin: 0;
}

.pick-button:hover {
  transform: translate(-50%, -50%) scale(1.05);
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
}

.pick-button:active {
  transform: translate(-50%, -50%) scale(0.95);
}

.pick-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-text {
  display: block;
  text-align: center;
  font-size: 40px;
  font-weight: bold;
  line-height: 1.2;
  letter-spacing: 2px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 结果弹窗样式 */
.result-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

.result-content {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  animation: popIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.result-image {
  width: 300px;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.result-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.result-name {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
}

@keyframes popIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.current-food-name {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -180px); /* 与按钮垂直居中对齐，按钮高度150+间距30 */
  background: rgba(255, 255, 255, 0.95);
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.5rem;
  font-weight: bold;
  color: #e74c3c;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  pointer-events: none;
}

/* 顶部美食名字 */
.global-food-name {
  position: fixed;
  left: 50%;
  top: 40px;
  transform: translateX(-50%);
  font-size: 38px;
  color: #e74c3c;
  font-weight: bold;
  background: rgba(255,255,255,0.95);
  padding: 10px 36px;
  border-radius: 22px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.10);
  z-index: 1000;
  pointer-events: none;
}
</style>