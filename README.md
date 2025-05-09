# Dish Picker - Random Food Selection System
# 美食抽取系统

[English](#english) | [中文](#中文)

# English

A modern web application that helps you randomly select dishes from your food collection, perfect for solving the daily "what to eat" dilemma.

## Features

- **Random Dish Selection**: One-click random selection from your food collection
- **Food Management**: Add, edit, and delete dishes with images
- **Responsive Design**: Works seamlessly on both desktop and mobile devices
- **Modern UI**: Built with Vue 3 and Vite, featuring a clean and intuitive interface

## Tech Stack

- Frontend: Vue 3 + Vite
- UI Framework: Custom CSS
- Image Storage: Local storage
- Data Management: JSON

## Project Structure

```
meishi/
├── src/                # Source code
│   ├── components/     # Vue components
│   ├── pages/         # Page components
│   ├── assets/        # Static assets
│   └── style.css      # Global styles
├── public/            # Public resources
│   ├── foods/         # Food images
│   └── foods.json     # Food data
└── index.html         # Main entry
```

## Getting Started

1. **Clone the repository**
```bash
git clone https://github.com/nxyxs/DishPicker.git
cd DishPicker
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Build for production**
```bash
npm run build
```

## Usage

1. **Random Selection**
   - Open the main page
   - Click the "Random Pick" button
   - Get a random dish suggestion

2. **Food Management**
   - Access the admin page
   - Add new dishes with images
   - Edit or delete existing dishes

## Development

- **Main Page**: `index.html`
- **Admin Page**: `admin.html`
- **Entry Points**: 
  - Main: `src/main.js`
  - Admin: `src/admin-entry.js`

## License

MIT License

## Author

nxyxs

---

# 中文

一个极简美观的美食抽取前端项目，支持本地图片上传、静态打包部署，适合个人娱乐、聚会点餐、公司团建等场景。
本项目基于 Vue3 + Vite 开发，支持美食图片网格展示与随机抽取动画，所有数据和图片均可本地管理，打包后可直接静态部署，无需后端支持。

## 项目特色

- **极简界面**：美食图片网格排列，中央大按钮一键抽取
- **本地管理**：支持本地上传美食图片和数据，自动打包进 dist
- **静态部署**：打包后所有资源均为静态文件，支持任意静态服务器托管
- **动画流畅**：抽取时高亮美食，动画效果美观
- **移动端适配**：PC、手机端均可良好展示

## 安装与运行

### 1. 克隆项目

```bash
git clone https://github.com/nxyxs/DishPicker.git
cd DishPicker
```

### 2. 安装依赖

```bash
npm install
```

### 3. 本地运行（开发模式）

```bash
npm run dev
```

浏览器自动打开 [http://localhost:5174](http://localhost:5174)（端口号以实际为准）。

## 构建与部署

### 1. 打包构建

```bash
npm run build
```

打包完成后，所有静态文件会生成在 `dist/` 目录下。

### 2. 部署到服务器

将 `dist/` 目录下的所有文件（包括 foods/ 图片文件夹、foods.json、index.html、assets/ 等）上传到你的静态服务器（如 Nginx、Apache、Vercel、Netlify、GitHub Pages 等）即可。

## 管理后台（可选）

- 访问 `/admin.html` 进入管理后台页面
- 支持本地上传美食图片、编辑和删除美食数据
- 所有数据和图片均保存在本地，打包后自动进入 `dist/` 目录

## 目录结构说明

```
dist/
  ├── index.html         # 前端主页面
  ├── admin.html         # 管理后台页面
  ├── foods.json         # 美食数据
  ├── foods/             # 美食图片文件夹
  └── assets/            # 打包生成的静态资源
```

## 常见问题

- **图片或数据未更新？**  
  请清理浏览器缓存或使用无痕窗口访问，或刷新服务器/CDN 缓存。

- **如何添加美食？**  
  进入管理后台上传图片和填写美食信息，保存后重新打包即可。

## 开源协议

本项目采用 MIT 协议，欢迎自由使用和二次开发。

---

如有问题欢迎提 Issue 或 PR！
