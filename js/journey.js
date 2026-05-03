/**
 * 人生轨迹数据入口
 *
 * 第一版保持空数组，不公开任何真实个人经历。
 * 后续只需要在 journeyEvents 中添加城市、年月、事件和 SVG 百分比坐标。
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
const journeyEvents = [];

class JourneyTimeline {
  constructor(events) {
    this.events = events
      .filter((event) => this.isValidEvent(event))
      .sort((a, b) => a.date.localeCompare(b.date));
    this.activeIndex = 0;
    this.routeEl = document.getElementById("journey-route");
    this.pointsEl = document.getElementById("journey-points");
    this.timelineEl = document.getElementById("journey-timeline");
    this.emptyEl = document.getElementById("journey-empty");
    this.countEl = document.getElementById("journey-count");
    this.detailTitleEl = document.getElementById("journey-detail-title");
    this.detailDateEl = document.getElementById("journey-detail-date");
    this.detailCityEl = document.getElementById("journey-detail-city");
    this.detailDescriptionEl = document.getElementById("journey-detail-description");
  }

  init() {
    if (!this.routeEl || !this.pointsEl || !this.timelineEl) return;

    this.updateCount();

    if (this.events.length === 0) {
      this.showEmptyState();
      return;
    }

    this.hideEmptyState();
    this.renderRoute();
    this.renderPoints();
    this.renderTimeline();
    this.selectEvent(0);
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

  updateCount() {
    if (this.countEl) {
      this.countEl.textContent = `${this.events.length} 个节点`;
    }
  }

  showEmptyState() {
    this.emptyEl?.classList.remove("is-hidden");
    this.routeEl?.classList.add("is-hidden");
    this.pointsEl?.classList.add("is-hidden");
  }

  hideEmptyState() {
    this.emptyEl?.classList.add("is-hidden");
    this.routeEl?.classList.remove("is-hidden");
    this.pointsEl?.classList.remove("is-hidden");
  }

  renderRoute() {
    if (this.events.length < 2) {
      this.routeEl.setAttribute("d", "");
      return;
    }

    const [firstX, firstY] = this.events[0].coords;
    const segments = [`M ${firstX} ${firstY}`];

    for (let index = 1; index < this.events.length; index++) {
      const [prevX, prevY] = this.events[index - 1].coords;
      const [x, y] = this.events[index].coords;
      const midX = (prevX + x) / 2;
      const midY = (prevY + y) / 2;
      const distanceX = x - prevX;
      const distanceY = y - prevY;
      const curveStrength = Math.min(9, Math.max(4, Math.hypot(distanceX, distanceY) * 0.18));
      const controlX = midX - Math.sign(distanceY || 1) * curveStrength;
      const controlY = midY + Math.sign(distanceX || 1) * curveStrength;

      segments.push(`Q ${controlX.toFixed(2)} ${controlY.toFixed(2)} ${x} ${y}`);
    }

    this.routeEl.setAttribute("d", segments.join(" "));
  }

  renderPoints() {
    this.pointsEl.innerHTML = "";

    this.events.forEach((event, index) => {
      const [x, y] = event.coords;
      const group = this.createSvgElement("g", {
        class: "journey-point",
        tabindex: "0",
        role: "button",
        "aria-label": `${event.date} ${event.city} ${event.title}`,
        "data-index": String(index)
      });

      const ring = this.createSvgElement("circle", {
        class: "journey-point-ring",
        cx: x,
        cy: y,
        r: 3.2
      });
      const dot = this.createSvgElement("circle", {
        class: "journey-point-dot",
        cx: x,
        cy: y,
        r: 1.45
      });
      const label = this.createSvgElement("text", {
        class: "journey-point-label",
        x,
        y: y - 5,
        "text-anchor": "middle"
      });
      label.textContent = event.city;

      const date = this.createSvgElement("text", {
        class: "journey-point-date",
        x,
        y: y + 6.1,
        "text-anchor": "middle"
      });
      date.textContent = event.date;

      group.append(ring, dot, label, date);
      group.addEventListener("click", () => this.selectEvent(index));
      group.addEventListener("keydown", (keyboardEvent) => {
        if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
          keyboardEvent.preventDefault();
          this.selectEvent(index);
        }
      });

      this.pointsEl.appendChild(group);
    });
  }

  renderTimeline() {
    this.timelineEl.innerHTML = "";

    this.events.forEach((event, index) => {
      const button = document.createElement("button");
      button.className = "timeline-item";
      button.type = "button";
      button.dataset.index = String(index);
      button.innerHTML = `
        <span class="timeline-date">${this.escapeHtml(event.date)}</span>
        <span class="timeline-main">
          <strong>${this.escapeHtml(event.city)} · ${this.escapeHtml(event.title)}</strong>
          <span>${this.escapeHtml(event.description)}</span>
        </span>
      `;
      button.addEventListener("click", () => this.selectEvent(index));
      this.timelineEl.appendChild(button);
    });
  }

  selectEvent(index) {
    const event = this.events[index];
    if (!event) return;

    this.activeIndex = index;
    this.detailTitleEl.textContent = event.title;
    this.detailDateEl.textContent = event.date;
    this.detailCityEl.textContent = event.city;
    this.detailDescriptionEl.textContent = event.description;

    this.pointsEl.querySelectorAll(".journey-point").forEach((point) => {
      point.classList.toggle("is-active", Number(point.dataset.index) === index);
    });

    this.timelineEl.querySelectorAll(".timeline-item").forEach((item) => {
      item.classList.toggle("is-active", Number(item.dataset.index) === index);
    });
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
  new JourneyTimeline(journeyEvents).init();
});
