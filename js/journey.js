/**
 * 人生轨迹地图模块
 * 可手动修改 lifePoints 数组来添加/编辑轨迹节点
 */

// ============ 配置区域：在此处编辑你的人生轨迹 ============
const lifeJourneyConfig = {
  // 人生轨迹节点数据
  // phase: 'childhood' | 'school' | 'work' （决定颜色）
  // city: 城市名称
  // lnglat: [经度, 纬度] - 可使用 https://lbs.amap.com/console/show/picker 获取
  lifePoints: [
    {
      id: 1,
      city: '北京',
      lnglat: [116.407526, 39.90403],
      period: '1995-2005',
      phase: 'childhood',
      title: '童年时光',
      description: '出生并度过快乐的童年，就读于北京市第一实验小学'
    },
    {
      id: 2,
      city: '上海',
      lnglat: [121.473701, 31.230416],
      period: '2005-2011',
      phase: 'school',
      title: '中学时代',
      description: '就读于上海某重点中学，培养了编程兴趣'
    },
    {
      id: 3,
      city: '杭州',
      lnglat: [120.15507, 30.274084],
      period: '2011-2015',
      phase: 'school',
      title: '大学时光',
      description: '浙江大学计算机系，本科四年，主修软件工程'
    },
    {
      id: 4,
      city: '深圳',
      lnglat: [114.057868, 22.543099],
      period: '2015-2018',
      phase: 'work',
      title: '初入职场',
      description: '腾讯公司，从事后端开发工作'
    },
    {
      id: 5,
      city: '成都',
      lnglat: [104.066541, 30.572269],
      period: '2018-至今',
      phase: 'work',
      title: '新生活',
      description: '加入字节跳动成都分部，享受慢节奏生活'
    }
  ],

  // 阶段颜色配置
  phaseColors: {
    childhood: '#4CAF50',  // 绿色 - 童年
    school: '#2196F3',     // 蓝色 - 求学
    work: '#FF9800'        // 橙色 - 工作
  },

  // 阶段名称
  phaseNames: {
    childhood: '童年时期',
    school: '求学阶段',
    work: '工作时期'
  }
};

// ============ 地图核心逻辑 ============
class LifeJourneyMap {
  constructor() {
    this.map = null;
    this.markers = [];
    this.lines = [];
    this.animationLine = null;
  }

  init() {
    // 检查地图容器是否存在
    const mapContainer = document.getElementById('journey-map');
    if (!mapContainer) {
      console.error('Map container not found');
      return;
    }

    // 初始化地图
    try {
      this.map = new AMap.Map('journey-map', {
        zoom: 5,
        center: [110, 35], // 中国中心
        viewMode: '2D',
        mapStyle: 'amap://styles/whitesmoke' // 简约浅色风格
      });

      // 添加地图控件
      this.map.addControl(new AMap.Scale());
      this.map.addControl(new AMap.ToolBar({
        position: 'RB'
      }));

      // 等待地图加载完成后绘制轨迹
      this.map.on('complete', () => {
        this.drawJourney();
      });

    } catch (error) {
      console.error('Map initialization failed:', error);
      mapContainer.innerHTML = '<div style="text-align: center; padding: 50px; color: #999;">' +
        '<p>地图加载失败，请检查网络连接或API Key配置</p>' +
        '<p style="font-size: 12px;">错误信息: ' + error.message + '</p>' +
        '</div>';
    }
  }

  // 绘制轨迹
  drawJourney() {
    const points = lifeJourneyConfig.lifePoints;

    if (points.length === 0) {
      console.warn('No journey points configured');
      return;
    }

    // 准备路径数据（按顺序连接所有点）
    const path = points.map(p => p.lnglat);

    // 创建分段折线（不同颜色表示不同阶段）
    this.drawSegmentedLines(points);

    // 创建标记点
    this.createMarkers(points);

    // 调整地图视角以显示所有轨迹点
    this.fitBounds();

    // 添加动画效果（如果点多于1个）
    if (points.length > 1) {
      this.animatePath(path);
    }
  }

  // 绘制分阶段轨迹线
  drawSegmentedLines(points) {
    const colors = lifeJourneyConfig.phaseColors;

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];

      // 创建折线
      const line = new AMap.Polyline({
        path: [current.lnglat, next.lnglat],
        strokeColor: colors[current.phase],
        strokeWeight: 5,
        strokeOpacity: 0.85,
        strokeStyle: 'solid',
        lineJoin: 'round',
        showDir: true, // 显示方向箭头
        dirColor: colors[current.phase],
        extData: { segmentIndex: i, from: current.city, to: next.city }
      });

      this.map.add(line);
      this.lines.push(line);
    }
  }

  // 创建标记点
  createMarkers(points) {
    const colors = lifeJourneyConfig.phaseColors;

    points.forEach((point, index) => {
      const color = colors[point.phase];

      // 创建自定义标记内容
      const markerContent = document.createElement('div');
      markerContent.className = 'journey-marker';
      markerContent.innerHTML = `
        <div style="color: ${color}; font-size: 16px; margin-bottom: 2px;">
          <i class="iconfont icon-location-fill"></i>
        </div>
        <div style="font-weight: 600; color: #333;">${point.city}</div>
        <div style="font-size: 11px; color: #666;">${point.period}</div>
      `;

      // 创建标记
      const marker = new AMap.Marker({
        position: point.lnglat,
        content: markerContent,
        offset: new AMap.Pixel(0, -10),
        extData: point,
        anchor: 'bottom-center'
      });

      // 创建信息窗口
      const infoWindow = new AMap.InfoWindow({
        content: this.createInfoWindowContent(point),
        offset: new AMap.Pixel(0, -50),
        closeWhenClickMap: true
      });

      // 点击标记显示信息窗口
      marker.on('click', () => {
        infoWindow.open(this.map, marker.getPosition());
      });

      // 鼠标悬停效果
      marker.on('mouseover', () => {
        markerContent.style.transform = 'scale(1.05) translateY(-2px)';
      });

      marker.on('mouseout', () => {
        markerContent.style.transform = 'scale(1) translateY(0)';
      });

      this.map.add(marker);
      this.markers.push(marker);
    });
  }

  // 创建信息窗口内容
  createInfoWindowContent(point) {
    const colors = lifeJourneyConfig.phaseColors;
    const color = colors[point.phase];
    const phaseName = lifeJourneyConfig.phaseNames[point.phase];

    return `
      <div class="journey-info-window">
        <h4 style="border-left: 4px solid ${color}; padding-left: 10px; margin-bottom: 12px;">
          ${point.city}
        </h4>
        <div style="margin-bottom: 8px;">
          <span style="display: inline-block; background: ${color}; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">
            ${phaseName}
          </span>
          <span style="color: #666; font-size: 13px; margin-left: 8px;">${point.period}</span>
        </div>
        <div style="font-weight: 600; color: #333; margin-bottom: 6px;">${point.title}</div>
        <p style="color: #666; font-size: 13px; line-height: 1.5;">${point.description}</p>
      </div>
    `;
  }

  // 轨迹动画
  animatePath(path) {
    // 创建动画轨迹线
    this.animationLine = new AMap.Polyline({
      path: [path[0]], // 从起点开始
      strokeColor: '#E91E63',
      strokeWeight: 7,
      strokeOpacity: 0.7,
      strokeStyle: 'dashed',
      lineDash: [10, 5],
      showDir: true,
      zIndex: 100
    });

    this.map.add(this.animationLine);

    // 动画参数
    let currentIndex = 0;
    const totalSegments = path.length - 1;
    const animationDuration = 1500; // 每段动画时长 ms
    const framesPerSegment = 60;

    const animate = () => {
      if (currentIndex >= totalSegments) {
        // 动画完成，闪烁几下后移除
        this.blinkAndRemoveAnimationLine();
        return;
      }

      const start = path[currentIndex];
      const end = path[currentIndex + 1];
      let frame = 0;

      const segmentAnimate = () => {
        frame++;
        const progress = frame / framesPerSegment;

        if (progress <= 1) {
          // 插值计算当前位置
          const currentLng = start[0] + (end[0] - start[0]) * progress;
          const currentLat = start[1] + (end[1] - start[1]) * progress;

          // 更新路径
          const currentPath = path.slice(0, currentIndex + 1).concat([[currentLng, currentLat]]);
          this.animationLine.setPath(currentPath);

          requestAnimationFrame(segmentAnimate);
        } else {
          currentIndex++;
          setTimeout(animate, 200); // 段与段之间的停顿
        }
      };

      segmentAnimate();
    };

    // 延迟开始动画，等待地图加载
    setTimeout(animate, 800);
  }

  // 动画线闪烁后移除
  blinkAndRemoveAnimationLine() {
    let blinkCount = 0;
    const maxBlinks = 3;

    const blink = () => {
      if (blinkCount >= maxBlinks * 2) {
        this.animationLine.hide();
        return;
      }

      if (blinkCount % 2 === 0) {
        this.animationLine.hide();
      } else {
        this.animationLine.show();
      }

      blinkCount++;
      setTimeout(blink, 300);
    };

    blink();
  }

  // 调整地图视角以显示所有轨迹点
  fitBounds() {
    if (this.markers.length === 0) return;

    // 使用 setFitView 自动调整视野
    this.map.setFitView(this.markers, false, [60, 60, 60, 60], 10);
  }
}

// 页面加载完成后初始化地图
document.addEventListener('DOMContentLoaded', () => {
  // 检查 AMap 是否已加载
  if (typeof AMap === 'undefined') {
    console.error('AMap library not loaded. Please check your API key.');
    const mapContainer = document.getElementById('journey-map');
    if (mapContainer) {
      mapContainer.innerHTML = '<div style="text-align: center; padding: 50px; color: #999;">' +
        '<p>地图库加载失败，请检查高德地图 API Key 是否正确配置</p>' +
        '<p style="font-size: 14px; margin-top: 10px;">在 journey/index.html 中替换 YOUR_KEY 为有效的高德地图 Key</p>' +
        '</div>';
    }
    return;
  }

  const journeyMap = new LifeJourneyMap();
  journeyMap.init();
});
