/**
 * 人生轨迹数据入口
 *
 * 只需要在 journeyEvents 中添加城市、年月、事件和 SVG 百分比坐标。
 * 鼠标划过城市点时，会显示对应时间和事件。
 *
 * 数据格式：
 * {
 *   city: "深圳",
 *   date: "2024-09",
 *   title: "开始新的工作阶段",
 *   description: "来到深圳，进入新的技术方向。",
 *   coords: [74, 78]
 * }
 *
 * 常见城市坐标参考，coords 范围为 0-100：
 * 北京 [63, 33]，上海 [78, 57]，深圳 [72, 82]，广州 [69, 79]，成都 [47, 64]
 * 杭州 [76, 59]，武汉 [62, 61]，西安 [52, 50]，南京 [73, 55]，重庆 [51, 67]
 */
const journeyEvents = [
  {
    city: "深圳",
    date: "2024-09",
    title: "开始新的工作阶段",
    description: "来到深圳，进入新的技术方向。",
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
    this.viewport = document.getElementById("map-viewport");
    this.routeEl = document.getElementById("journey-route");
    this.pointsEl = document.getElementById("journey-points");
    this.tooltipEl = document.getElementById("map-tooltip");
    this.zoomInEl = document.getElementById("map-zoom-in");
    this.zoomOutEl = document.getElementById("map-zoom-out");
    this.resetEl = document.getElementById("map-reset");
    this.view = { scale: 1, x: 0, y: 0 };
    this.drag = { active: false, startX: 0, startY: 0, originX: 0, originY: 0 };
  }

  init() {
    if (!this.svg || !this.viewport || !this.pointsEl || !this.canvas) return;

    this.renderRoute();
    this.renderPoints();
    this.bindZoomControls();
    this.bindPanControls();
    this.applyTransform();
  }

  isValidEvent(event) {
    return Boolean(
      event &&
      typeof event.city === "string" &&
      typeof event.date === "string" &&
      typeof event.title === "string" &&
      typeof event.description === "string" &&
      Array.isArray(event.coords) &&
      event.coords.length === 2 &&
      Number.isFinite(event.coords[0]) &&
      Number.isFinite(event.coords[1])
    );
  }

  renderRoute() {
    if (!this.routeEl || this.events.length < 2) {
      this.routeEl?.classList.add("is-hidden");
      return;
    }

    this.routeEl.classList.remove("is-hidden");
    const [firstX, firstY] = this.events[0].coords;
    const segments = [`M ${firstX} ${firstY}`];

    for (let index = 1; index < this.events.length; index++) {
      const [prevX, prevY] = this.events[index - 1].coords;
      const [x, y] = this.events[index].coords;
      const midX = (prevX + x) / 2;
      const midY = (prevY + y) / 2;
      const curveStrength = Math.min(9, Math.max(4, Math.hypot(x - prevX, y - prevY) * 0.18));
      const controlX = midX - Math.sign(y - prevY || 1) * curveStrength;
      const controlY = midY + Math.sign(x - prevX || 1) * curveStrength;
      segments.push(`Q ${controlX.toFixed(2)} ${controlY.toFixed(2)} ${x} ${y}`);
    }

    this.routeEl.setAttribute("d", segments.join(" "));
  }

  renderPoints() {
    this.pointsEl.innerHTML = "";

    this.events.forEach((event) => {
      const [x, y] = event.coords;
      const group = this.createSvgElement("g", {
        class: "journey-point",
        tabindex: "0",
        role: "button",
        "aria-label": `${event.date} ${event.city} ${event.title}`
      });

      const ring = this.createSvgElement("circle", {
        class: "journey-point-ring",
        cx: x,
        cy: y,
        r: 3.6
      });
      const dot = this.createSvgElement("circle", {
        class: "journey-point-dot",
        cx: x,
        cy: y,
        r: 1.55
      });
      const label = this.createSvgElement("text", {
        class: "journey-point-label",
        x,
        y: y - 5.4,
        "text-anchor": "middle"
      });
      label.textContent = event.city;

      group.append(ring, dot, label);
      group.addEventListener("mouseenter", (pointerEvent) => this.showTooltip(event, pointerEvent));
      group.addEventListener("mousemove", (pointerEvent) => this.moveTooltip(pointerEvent));
      group.addEventListener("mouseleave", () => this.hideTooltip());
      group.addEventListener("focus", () => this.showTooltipAtPoint(event, x, y));
      group.addEventListener("blur", () => this.hideTooltip());

      this.pointsEl.appendChild(group);
    });
  }

  bindZoomControls() {
    this.zoomInEl?.addEventListener("click", () => this.zoomBy(1.18));
    this.zoomOutEl?.addEventListener("click", () => this.zoomBy(0.84));
    this.resetEl?.addEventListener("click", () => {
      this.view = { scale: 1, x: 0, y: 0 };
      this.applyTransform();
    });

    this.canvas.addEventListener("wheel", (event) => {
      event.preventDefault();
      const factor = event.deltaY < 0 ? 1.12 : 0.9;
      this.zoomBy(factor);
    }, { passive: false });
  }

  bindPanControls() {
    this.canvas.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      this.drag = {
        active: true,
        startX: event.clientX,
        startY: event.clientY,
        originX: this.view.x,
        originY: this.view.y
      };
      this.canvas.classList.add("is-dragging");
      this.canvas.setPointerCapture(event.pointerId);
    });

    this.canvas.addEventListener("pointermove", (event) => {
      if (!this.drag.active) return;
      const rect = this.svg.getBoundingClientRect();
      const dx = ((event.clientX - this.drag.startX) / rect.width) * 100;
      const dy = ((event.clientY - this.drag.startY) / rect.height) * 100;
      this.view.x = this.drag.originX + dx;
      this.view.y = this.drag.originY + dy;
      this.applyTransform();
    });

    this.canvas.addEventListener("pointerup", (event) => this.endDrag(event));
    this.canvas.addEventListener("pointercancel", (event) => this.endDrag(event));
    this.canvas.addEventListener("pointerleave", () => {
      if (!this.drag.active) return;
      this.drag.active = false;
      this.canvas.classList.remove("is-dragging");
    });
  }

  endDrag(event) {
    this.drag.active = false;
    this.canvas.classList.remove("is-dragging");
    if (this.canvas.hasPointerCapture?.(event.pointerId)) {
      this.canvas.releasePointerCapture(event.pointerId);
    }
  }

  zoomBy(factor) {
    const nextScale = Math.min(4, Math.max(0.75, this.view.scale * factor));
    this.view.scale = Number(nextScale.toFixed(3));
    this.applyTransform();
  }

  applyTransform() {
    this.viewport.setAttribute(
      "transform",
      `translate(${this.view.x.toFixed(2)} ${this.view.y.toFixed(2)}) scale(${this.view.scale})`
    );
  }

  showTooltip(event, pointerEvent) {
    this.tooltipEl.innerHTML = `
      <strong>${this.escapeHtml(event.city)} · ${this.escapeHtml(event.title)}</strong>
      <span>${this.escapeHtml(event.date)}</span>
      <p>${this.escapeHtml(event.description)}</p>
    `;
    this.tooltipEl.classList.add("is-visible");
    this.moveTooltip(pointerEvent);
  }

  showTooltipAtPoint(event, x, y) {
    const svgPoint = this.svg.createSVGPoint();
    svgPoint.x = x;
    svgPoint.y = y;
    const screenPoint = svgPoint.matrixTransform(this.viewport.getScreenCTM());
    this.showTooltip(event, { clientX: screenPoint.x, clientY: screenPoint.y });
  }

  moveTooltip(pointerEvent) {
    const stageRect = document.querySelector(".journey-map-stage").getBoundingClientRect();
    const x = pointerEvent.clientX - stageRect.left;
    const y = pointerEvent.clientY - stageRect.top;
    this.tooltipEl.style.left = `${Math.min(Math.max(x, 24), stageRect.width - 24)}px`;
    this.tooltipEl.style.top = `${Math.min(Math.max(y, 24), stageRect.height - 24)}px`;
  }

  hideTooltip() {
    this.tooltipEl.classList.remove("is-visible");
  }

  createSvgElement(tagName, attributes) {
    const element = document.createElementNS("http://www.w3.org/2000/svg", tagName);
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, String(value));
    });
    return element;
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
  new JourneyMap(journeyEvents).init();
});
