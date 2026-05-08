/**
 * 人生轨迹数据入口
 *
 * 只需要在 journeyEvents 中添加城市、年月、事件和实际坐标。
 * 鼠标划过城市点时，会显示对应时间和事件。
 *
 * 数据格式：
 * {
 *   city: "深圳",
 *   date: "2024-09",
 *   title: "开始新的工作阶段",
 *   description: "来到深圳，进入新的技术方向。",
 *   position: [113.93041, 22.53122]
 * }
 */
const journeyEvents = [
  {
    city: "深圳",
    date: "2024-09",
    title: "开始新的工作阶段",
    description: "来到深圳，进入新的技术方向。",
    position: [113.93041, 22.53122],
    coords: [74, 78]
  }
];

class JourneyMap {
  constructor(events) {
    this.events = events
      .filter((event) => this.isValidEvent(event))
      .sort((a, b) => a.date.localeCompare(b.date));
    this.svg = document.getElementById("journey-map");
    this.canvas = document.getElementById("map-canvas");
    this.amapContainer = document.getElementById("amap-container");
    this.tooltipEl = document.getElementById("map-tooltip");
    this.zoomInEl = document.getElementById("map-zoom-in");
    this.zoomOutEl = document.getElementById("map-zoom-out");
    this.resetEl = document.getElementById("map-reset");
    this.map = null;
    this.leafletMap = null;
    this.infoWindow = null;
    this.isAmapInitialized = false;
  }

  init() {
    if (!this.canvas || !this.amapContainer) return;
    this.initMap();
    this.bindZoomControls();
  }

  initMap() {
    if (window.AMap) {
      this.initAmap();
    } else {
      this.initLeaflet();
    }
  }

  initAmap() {
    if (this.isAmapInitialized || !this.amapContainer) return;
    this.clearMapContainer();
    this.hideFallbackSvg();

    try {
      this.map = new AMap.Map(this.amapContainer, {
        mapStyle: "amap://styles/whitesmoke",
        center: [104.195393, 35.86166],
        zoom: 4,
        zoomEnable: false,
        dragEnable: true,
        viewMode: "2D",
        pitch: 0
      });
    } catch (error) {
      console.warn("高德地图初始化失败，启用备用地图：", error);
      this.initLeaflet();
      return;
    }

    this.isAmapInitialized = true;
    this.renderAmapRoute();
    this.renderAmapMarkers();
  }

  initLeaflet() {
    if (!this.amapContainer) return;
    if (this.leafletMap) return;

    this.clearMapContainer();
    this.hideFallbackSvg();

    this.leafletMap = L.map(this.amapContainer, {
      center: [35.86166, 104.195393],
      zoom: 4,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.leafletMap);

    L.polyline(
      this.events.map((event) => [event.position[1], event.position[0]]),
      {
        color: "#0052d9",
        weight: 4,
        opacity: 0.8,
        lineJoin: "round"
      }
    ).addTo(this.leafletMap);

    this.events.forEach((event) => {
      const marker = L.circleMarker([event.position[1], event.position[0]], {
        radius: 8,
        fillColor: "#0052d9",
        color: "#ffffff",
        weight: 2,
        opacity: 1,
        fillOpacity: 1
      }).addTo(this.leafletMap);

      marker.bindPopup(this.buildPopupContent(event), {
        closeButton: false,
        autoClose: false,
        closeOnClick: false
      });

      marker.on("mouseover", () => marker.openPopup());
      marker.on("mouseout", () => marker.closePopup());
    });
  }

  renderAmapRoute() {
    if (!this.map || !window.AMap) return;

    new AMap.Polyline({
      path: this.events.map((event) => event.position),
      strokeColor: "#0052d9",
      strokeWeight: 4,
      strokeOpacity: 0.8,
      lineJoin: "round",
      showDir: false,
      map: this.map
    });
  }

  renderAmapMarkers() {
    if (!this.map || !window.AMap) return;

    this.events.forEach((event) => {
      const marker = new AMap.Marker({
        position: event.position,
        title: event.city,
        map: this.map,
        icon: new AMap.Icon({
          image: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
          size: new AMap.Size(24, 34),
          imageSize: new AMap.Size(24, 34)
        })
      });

      marker.on("click", () => {
        this.openAmapInfoWindow(event, marker.getPosition());
      });
      marker.on("mouseover", () => {
        marker.setIcon(new AMap.Icon({
          image: "https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png",
          size: new AMap.Size(24, 34),
          imageSize: new AMap.Size(24, 34)
        }));
      });
      marker.on("mouseout", () => {
        marker.setIcon(new AMap.Icon({
          image: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
          size: new AMap.Size(24, 34),
          imageSize: new AMap.Size(24, 34)
        }));
      });
    });
  }

  openAmapInfoWindow(event, position) {
    if (!window.AMap || !this.map) return;

    if (!this.infoWindow) {
      this.infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(0, -28),
        closeWhenClickMap: true
      });
    }

    this.infoWindow.setContent(this.buildPopupContent(event));
    this.infoWindow.open(this.map, position);
  }

  bindZoomControls() {
    this.zoomInEl?.addEventListener("click", () => this.zoomIn());
    this.zoomOutEl?.addEventListener("click", () => this.zoomOut());
    this.resetEl?.addEventListener("click", () => this.resetView());
  }

  zoomIn() {
    if (this.isAmapInitialized && this.map) {
      this.map.setZoom(Math.min(this.map.getZoom() + 1, 18));
    } else if (this.leafletMap) {
      this.leafletMap.setZoom(Math.min(this.leafletMap.getZoom() + 1, 18));
    }
  }

  zoomOut() {
    if (this.isAmapInitialized && this.map) {
      this.map.setZoom(Math.max(this.map.getZoom() - 1, 3));
    } else if (this.leafletMap) {
      this.leafletMap.setZoom(Math.max(this.leafletMap.getZoom() - 1, 3));
    }
  }

  resetView() {
    if (this.isAmapInitialized && this.map) {
      this.map.setZoomAndCenter(4, [104.195393, 35.86166]);
    } else if (this.leafletMap) {
      this.leafletMap.setView([35.86166, 104.195393], 4);
    }
  }

  clearMapContainer() {
    if (!this.amapContainer) return;
    if (this.leafletMap) {
      this.leafletMap.remove();
      this.leafletMap = null;
    }
    this.amapContainer.innerHTML = "";
  }

  hideFallbackSvg() {
    if (this.svg) {
      this.svg.style.display = "none";
    }
  }

  buildPopupContent(event) {
    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height:1.4;">
        <strong style="display:block; color:#0052d9; margin-bottom:4px;">${this.escapeHtml(event.city)} · ${this.escapeHtml(event.title)}</strong>
        <div style="font-size:0.95rem; color:#1f2937; margin-bottom:6px;">${this.escapeHtml(event.date)}</div>
        <div style="font-size:0.88rem; color:#475467;">${this.escapeHtml(event.description)}</div>
      </div>
    `;
  }

  isValidEvent(event) {
    return Boolean(
      event &&
      typeof event.city === "string" &&
      typeof event.date === "string" &&
      typeof event.title === "string" &&
      typeof event.description === "string" &&
      Array.isArray(event.position) &&
      event.position.length === 2 &&
      Number.isFinite(event.position[0]) &&
      Number.isFinite(event.position[1])
    );
  }

  escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const journeyMap = new JourneyMap(journeyEvents);
  window.__journeyMap = journeyMap;
  window.initAMap = () => journeyMap.initAmap();
  journeyMap.init();
});
