.food-item {
  width: 180px;
  aspect-ratio: 1;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  opacity: 0;
  animation: fadeIn 0.5s ease forwards;
  border: 4px solid white;
  background: #fff;
  min-width: 0;
  min-height: 0;
  display: block;
}

.food-item:before {
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