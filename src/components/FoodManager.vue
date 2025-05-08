<template>
  <div class="food-manager">
    <!-- 添加卡片 -->
    <form @submit.prevent="addFood" class="card-bar">
      <input v-model="newFood.name" placeholder="输入美食名称" required class="input-modern add-input" />
      <label class="upload-label-bar">
        <input type="file" accept="image/*" @change="onImageChange" />
        上传图片
        </label>
      <button type="submit" class="btn-bar" style="margin-left:0.5rem;">添加</button>
    </form>

    <!-- 搜索卡片 -->
    <div class="card-bar">
      <input 
        v-model="searchQuery" 
        placeholder="搜索美食名称..." 
        class="input-modern search-input"
        @keyup.enter="handleSearch"
      />
      <button class="btn-bar" @click="handleSearch">搜索</button>
    </div>

    <div class="food-list-container">
      <div v-if="filteredFoods.length === 0" class="empty-state">
        <p>{{ searchQuery ? '没有找到相关美食' : '暂无美食数据，请添加美食' }}</p>
      </div>
      <div v-else class="food-list">
        <div v-for="(food, idx) in pagedFilteredFoods" :key="food.name + idx" class="food-card">
          <div class="food-image-container">
          <img v-if="food.image" :src="food.image" alt="美食图片" class="food-img" />
            <div v-else class="no-image">暂无图片</div>
          </div>
          <div class="food-card-content">
            <div v-if="editIndex !== getGlobalIndex(idx)" class="food-info">
          <span class="food-name">{{ food.name }}</span>
              <div class="card-actions">
                <button @click="startEdit(getGlobalIndex(idx))" class="btn-modern btn-edit">编辑</button>
                <button @click="removeFood(getGlobalIndex(idx))" class="btn-modern btn-delete">删除</button>
              </div>
            </div>
            <div v-else class="edit-form">
              <input v-model="editFood.name" class="edit-input" />
              <label class="edit-upload-label">
                <input type="file" accept="image/*" @change="onEditImageChange" />
                更换图片
          </label>
              <div class="edit-actions">
                <button @click="saveEdit(getGlobalIndex(idx))" class="btn-modern btn-save">保存</button>
                <button @click="cancelEdit" class="btn-modern btn-cancel">取消</button>
              </div>
            </div>
          </div>
        </div>
      </div>
        </div>

    <div v-if="filteredFoods.length > 0" class="pagination">
      <button :disabled="currentPage === 1" @click="prevPage" class="btn-modern page-btn">上一页</button>
      <span class="pagination-info">第{{ currentPage }}页 / 共{{ totalPages }}页</span>
      <button :disabled="currentPage === totalPages" @click="nextPage" class="btn-modern page-btn">下一页</button>
    </div>

    <div v-if="uploadSuccess" class="upload-success show">图片上传成功！</div>
    <div v-if="addSuccess" class="upload-success show">美食添加成功！</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newFood: {
        name: '',
        image: ''
      },
      foods: [],
      filteredFoods: [],
      searchQuery: '',
      editIndex: null,
      editFood: {
        name: '',
        image: ''
      },
      uploadSuccess: false,
      addSuccess: false,
      currentPage: 1,
      pageSize: 8
    };
  },
  computed: {
    pagedFilteredFoods() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredFoods.slice(start, end);
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.filteredFoods.length / this.pageSize));
    }
  },
  mounted() {
    this.loadFoods();
  },
  methods: {
    getGlobalIndex(localIndex) {
      return (this.currentPage - 1) * this.pageSize + localIndex;
    },
    async loadFoods() {
      try {
        const res = await fetch('http://localhost:3001/api/foods');
        const data = await res.json();
        this.foods = data.reverse();
        this.filteredFoods = [...this.foods];
      } catch (e) {
        this.foods = [];
        this.filteredFoods = [];
      }
    },
    handleSearch() {
      if (!this.searchQuery.trim()) {
        this.filteredFoods = [...this.foods];
      } else {
        const query = this.searchQuery.toLowerCase();
        this.filteredFoods = this.foods.filter(food => 
          food.name.toLowerCase().includes(query)
        );
      }
      this.currentPage = 1;
    },
    async onImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          const res = await fetch('http://localhost:3001/api/upload', {
            method: 'POST',
            body: formData
          });
          const data = await res.json();
          if (data.url) {
            this.newFood.image = data.url;
          this.uploadSuccess = true;
            setTimeout(() => {
              this.uploadSuccess = false;
            }, 2000);
          }
        } catch (error) {
          console.error('图片上传失败:', error);
        }
      }
    },
    async onEditImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          const res = await fetch('http://localhost:3001/api/upload', {
            method: 'POST',
            body: formData
          });
          const data = await res.json();
          if (data.url) {
            this.editFood.image = data.url;
      this.uploadSuccess = true;
            setTimeout(() => {
              this.uploadSuccess = false;
            }, 2000);
          }
        } catch (error) {
          console.error('图片上传失败:', error);
        }
      }
    },
    async addFood() {
      if (this.newFood.name.trim() === '' || !this.newFood.image) return;
      try {
        await fetch('http://localhost:3001/api/foods', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: this.newFood.name, image: this.newFood.image })
        });
        this.newFood = { name: '', image: '' };
        this.addSuccess = true;
        setTimeout(() => {
          this.addSuccess = false;
        }, 2000);
        this.loadFoods();
      } catch (e) {
        alert('添加失败');
      }
    },
    startEdit(idx) {
      this.editIndex = idx;
      this.editFood = { ...this.foods[idx] };
    },
    async saveEdit(idx) {
      if (this.editFood.name.trim() === '') return;
      try {
        await fetch(`http://localhost:3001/api/foods/${idx}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.editFood)
        });
      this.editIndex = null;
        this.loadFoods();
      } catch (e) {
        alert('保存失败');
      }
    },
    async removeFood(idx) {
      if (confirm('确认删除当前美食吗？')) {
        try {
          await fetch(`http://localhost:3001/api/foods/${idx}`, {
            method: 'DELETE'
          });
          this.loadFoods();
          if (this.pagedFilteredFoods.length === 0 && this.currentPage > 1) {
            this.currentPage--;
          }
        } catch (e) {
          alert('删除失败');
        }
      }
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    cancelEdit() {
      this.editIndex = null;
    }
  }
};
</script>

<style scoped>
.food-manager {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  box-sizing: border-box;
}

.card-bar {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto 1.5rem auto;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  min-height: 80px;
  box-sizing: border-box;
}

.search-input, .add-input {
  flex: 1;
  min-width: 0;
  padding: 1rem;
  font-size: 1.1rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.btn-bar {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  background: #4f46e5;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 48px;
  min-width: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-bar:hover {
  background: #4338ca;
}

.upload-label-bar {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  background: #f3f4f6;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 48px;
  min-width: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-sizing: border-box;
}
.upload-label-bar:hover {
  background: #e5e7eb;
}
.upload-label-bar input[type="file"] {
  display: none;
}

.food-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.food-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.food-card:hover {
  transform: translateY(-5px);
}

.food-card-content {
  padding: 1rem;
}

.food-image-container {
  position: relative;
  padding-top: 75%;
  margin-bottom: 1rem;
  background: #f3f4f6;
  border-radius: 8px;
  overflow: hidden;
}

.food-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 0.9rem;
}

.food-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.food-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.card-actions .btn-modern {
  flex: 1;
  padding: 0.6rem;
  font-size: 0.95rem;
}

.edit-form {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.edit-input {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.edit-input:focus {
  border-color: #4f46e5;
  outline: none;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.edit-upload-label {
  display: block;
  padding: 0.8rem;
  background: #f3f4f6;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  color: #4b5563;
}

.edit-upload-label:hover {
  background: #e5e7eb;
}

.edit-upload-label input[type="file"] {
  display: none;
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-actions .btn-modern {
  flex: 1;
  padding: 0.8rem;
  font-weight: 600;
  font-size: 1rem;
}

.btn-save {
  background: #10b981;
  color: white;
}

.btn-save:hover {
  background: #059669;
}

.btn-cancel {
  background: #6b7280;
  color: white;
}

.btn-cancel:hover {
  background: #4b5563;
}

.page-btn {
  min-width: 100px;
  background: #4f46e5;
  color: white;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  padding: 0.8rem 1.5rem;
  margin: 0 0.5rem;
  transition: all 0.3s ease;
}
.page-btn:disabled {
  background: #e0e0e0;
  color: #888;
  cursor: not-allowed;
}
.page-btn:hover:not(:disabled) {
  background: #4338ca;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2rem;
}
.pagination-info {
  min-width: 110px;
  text-align: center;
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
}

.upload-success {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #10b981;
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.upload-success.show {
  opacity: 1;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.empty-state p {
  color: #6b7280;
  font-size: 1.1rem;
}

.btn-modern {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-modern:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-edit {
  background: #3b82f6;
  color: white;
}

.btn-edit:hover {
  background: #2563eb;
}

.btn-delete {
  background: #ef4444;
  color: white;
}

.btn-delete:hover {
  background: #dc2626;
}
</style>