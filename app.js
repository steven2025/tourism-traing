// ===================== 基础配置 =====================
// 部署腾讯云函数后，把下面两个地址改成你的 API 网关地址。
const API = {
  // 部署腾讯云 API 网关后，把下面两个地址替换成你的公网接口地址。
  submitResult: "https://1311686407-lt026fsrhz.ap-guangzhou.tencentscf.com",
  getClassStats: "https://1311686407-074lcayymp.ap-guangzhou.tencentscf.com"
};

const state = {
  currentPage: "login",
  currentJob: JSON.parse(localStorage.getItem("currentJob") || "null"),
  student: JSON.parse(localStorage.getItem("studentInfo") || "null"),
  lastResult: JSON.parse(localStorage.getItem("lastResult") || "null"),
  evaluationDraft: JSON.parse(localStorage.getItem("evaluationDraft") || "{}"),
  activeModule: null,
  activeDimension: "海外运营管理",
  radarChart: null,
  barChart: null
};

const jobModules = {
  "海外客源开发模块": [
    ["海外区域销售主管", "负责特定海外区域旅游产品销售团队管理，统筹线下渠道合作与客户开发。"],
    ["跨境营销专员（主管级）", "带领小团队执行海外社交媒体营销、旅游电商平台运营，管控营销活动落地与效果跟踪。"],
    ["高端客户维护主管", "管理VIP客户服务小组，制定个性化服务方案，协调资源解决高端客户出行需求与问题。"]
  ],
  "旅游产品设计模块": [
    ["海外产品研发主管", "带领产品小组调研海外目的地资源，设计主题旅游产品，管控产品成本与定价。"],
    ["行程优化经理（基层）", "负责细化海外旅游行程，协调酒店、交通、导游等资源，优化体验与效率。"],
    ["定制游项目主管", "管理定制游服务团队，对接客户个性化需求，统筹行程设计、执行与质量把控。"],
    ["海外供应商管理主管", "维护海外酒店、车队、景点等供应商关系，谈判条款，保障服务质量。"]
  ],
  "客户服务执行模块": [
    ["海外领队管理主管", "管理海外领队团队日常、培训与考核，协调处理客户出行突发问题。"],
    ["客户服务中心主管", "管理咨询与投诉团队，制定服务标准，提升响应速度与解决率。"],
    ["签证服务主管", "带领签证小组，熟悉各国政策，统筹材料审核、提交与进度跟踪。"],
    ["机场/口岸服务主管", "管理口岸服务团队，负责出入境引导、行李协调、紧急情况处理。"],
    ["售后回访主管", "组织出行后回访，收集反馈，推动服务流程优化。"]
  ],
  "海外运营管理模块": [
    ["海外目的地运营主管", "驻海外管理当地服务团队，协调资源，保障团队顺利接待。"],
    ["跨境行程协调主管", "统筹多国行程衔接，协调目的地团队，解决衔接问题。"],
    ["海外安全管理主管", "制定安全制度，开展风险排查，处理海外安全突发事件。"],
    ["多语言服务主管", "管理英/日/法等多语言团队，保障跨国客户沟通与服务体验。"]
  ],
  "支持保障模块": [
    ["海外业务财务主管（基层）", "负责海外业务核算、费用管控、财务对接与资金结算。"],
    ["中基层人才发展主管", "制定培训计划，组织技能培训与轮岗，跟踪干部成长。"],
    ["海外数据运营主管", "收集分析市场与客户数据，输出报告支撑业务决策。"],
    ["合规管理主管（基层）", "研究旅游法规、签证政策，确保业务合规运营。"]
  ]
};

const competencyMap = {
  "海外运营管理": ["海外目的地资源整合与管理", "跨境旅游行程优化设计", "海外合作伙伴关系维护", "多语言服务流程标准化"],
  "客户服务提升": ["高端客户需求洞察与响应", "客户投诉高效处理技巧", "海外服务质量标准执行", "客户满意度提升策略"],
  "数字化营销": ["旅游电商平台运营技巧", "社交媒体营销（抖音 / 小红书 / INS）", "大数据客户画像分析", "直播带货与线上推广"],
  "安全应急管理": ["海外旅游安全风险预警", "突发事件应急处置流程", "医疗救援协调能力", "跨境安全事件沟通技巧"],
  "团队建设管理": ["一线员工激励与考核", "跨部门协作协调技巧", "工作目标分解与执行", "团队绩效提升方法"],
  "跨文化沟通": ["主要客源国文化习俗认知", "商务礼仪与跨文化谈判", "多语言基础沟通能力", "文化冲突化解技巧"],
  "产品创新设计": ["定制化旅游产品开发", "主题旅游产品设计（康养 / 研学 / 探险）", "旅游 + 产业融合创新", "产品成本控制与定价策略"],
  "合规风险管理": ["海外签证政策解读与应用", "旅游行业法律法规执行", "数据安全与客户隐私保护", "汇率风险与财务合规"]
};

const dimensions = Object.keys(competencyMap);
const skills = Object.entries(competencyMap).flatMap(([dimension, list]) => list.map(skill => ({ dimension, skill })));
const jobs = Object.entries(jobModules).flatMap(([moduleName, list], index) => list.map((item, i) => ({
  id: `${index + 1}-${i + 1}`,
  moduleName,
  title: item[0],
  description: item[1]
})));
const mainArea = document.getElementById("mainArea");

// ===================== 页面导航 =====================
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => switchPage(btn.dataset.page));
});
document.getElementById("closeModal").addEventListener("click", closeModal);
document.getElementById("confirmRead").addEventListener("click", () => {
  closeModal();
  switchPage("evaluation");
});

function switchPage(page) {
  state.currentPage = page;
  document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.page === page));
  if (page === "login") renderLogin();
  if (page === "jobs") renderJobs();
  if (page === "evaluation") renderEvaluation();
  if (page === "myResult") renderMyResult();
  if (page === "classStats") renderClassStats();
  if (page === "help") renderHelp();
}

function requireStudent() {
  if (!state.student) {
    mainArea.innerHTML = `<section class="card"><h2>请先完成学生登录</h2><p class="notice">填写姓名、学号和班级后，才能进行岗位评估与提交结果。</p></section>`;
    return false;
  }
  return true;
}

function escapeHtml(str = "") {
  return String(str).replace(/[&<>"]/g, s => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[s]));
}

// ===================== 登录模块 =====================
function renderLogin() {
  const s = state.student || { name: "", studentId: "", className: "" };
  mainArea.innerHTML = `
    <section class="card">
      <h1>学生登录</h1>
      <p class="notice">本模块不使用密码，仅用于课堂练习身份记录。信息会保存在浏览器 localStorage，并随评估结果提交到云函数。</p>
      <div class="form-row"><label>姓名</label><input id="name" value="${escapeHtml(s.name || "")}" placeholder="请输入姓名" /></div>
      <div class="form-row"><label>学号</label><input id="studentId" value="${escapeHtml(s.studentId || "")}" placeholder="请输入学号" /></div>
      <div class="form-row"><label>班级</label><input id="className" value="${escapeHtml(s.className || "")}" placeholder="例如：旅游管理 2301" /></div>
      <div class="actions">
        <button id="saveStudent" class="primary-btn">确认登录</button>
        <button id="clearStudent" class="danger-btn">清空身份</button>
      </div>
    </section>
  `;
  document.getElementById("saveStudent").addEventListener("click", () => {
    const student = {
      name: document.getElementById("name").value.trim(),
      studentId: document.getElementById("studentId").value.trim(),
      className: document.getElementById("className").value.trim()
    };
    if (!student.name || !student.studentId || !student.className) return alert("请完整填写姓名、学号和班级。");
    state.student = student;
    localStorage.setItem("studentInfo", JSON.stringify(student));
    alert("登录成功，请选择岗位。此处仅作为课堂练习身份记录。");
    switchPage("jobs");
  });
  document.getElementById("clearStudent").addEventListener("click", () => {
    localStorage.removeItem("studentInfo");
    state.student = null;
    renderLogin();
  });
}

// ===================== 岗位选择：五个模块横排抽屉 =====================
function renderJobs() {
  if (!requireStudent()) return;
  const moduleNames = Object.keys(jobModules);
  mainArea.innerHTML = `
    <section class="card">
      <h1>岗位选择</h1>
      <p class="notice">五个岗位模块采用抽屉式展开。点击模块名称展开岗位，再次点击同一模块可收回。选择岗位后必须阅读职责，才能进入培训评估。</p>
      <div class="module-tabs">
        ${moduleNames.map(moduleName => `<button class="module-tab ${state.activeModule === moduleName ? "active" : ""}" data-module="${moduleName}">${moduleName.replace("模块", "")}</button>`).join("")}
      </div>
      <div id="jobDrawer">${state.activeModule ? renderJobDrawer(state.activeModule) : `<div class="job-drawer"><p class="notice">请选择上方一个模块，查看该模块下的岗位。</p></div>`}</div>
    </section>
  `;
  document.querySelectorAll(".module-tab").forEach(btn => {
    btn.addEventListener("click", () => {
      state.activeModule = state.activeModule === btn.dataset.module ? null : btn.dataset.module;
      renderJobs();
    });
  });
  bindJobCards();
}

function renderJobDrawer(moduleName) {
  const moduleJobs = jobs.filter(j => j.moduleName === moduleName);
  return `
    <div class="job-drawer">
      <h2>${moduleName}</h2>
      <div class="job-grid">
        ${moduleJobs.map(job => `
          <div class="job-card ${state.currentJob && state.currentJob.id === job.id ? "selected" : ""}" data-job-id="${job.id}">
            <h3>${job.title}</h3>
            <p>${job.description}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function bindJobCards() {
  document.querySelectorAll(".job-card").forEach(card => card.addEventListener("click", () => {
    const job = jobs.find(j => j.id === card.dataset.jobId);
    state.currentJob = job;
    state.evaluationDraft = {};
    localStorage.setItem("currentJob", JSON.stringify(job));
    localStorage.removeItem("evaluationDraft");
    showJobDescription(job);
  }));
}

function showJobDescription(job) {
  document.getElementById("modalTitle").textContent = job.title;
  document.getElementById("modalText").textContent = job.description;
  document.getElementById("modal").classList.remove("hidden");
}
function closeModal() { document.getElementById("modal").classList.add("hidden"); }

// ===================== 培训评估：左侧维度导航 + 右侧技能卡片 =====================
function renderEvaluation() {
  if (!requireStudent()) return;
  if (!state.currentJob) {
    mainArea.innerHTML = `<section class="card"><h2>请先选择岗位</h2><p class="notice">进入岗位选择页面，阅读岗位职责后再进行评估。</p></section>`;
    return;
  }
  if (!dimensions.includes(state.activeDimension)) state.activeDimension = dimensions[0];
  mainArea.innerHTML = `
    <section class="evaluation-shell">
      <aside class="eval-sidebar">
        <div class="card job-info-card">
          <h2>当前岗位</h2>
          <p><strong>${state.currentJob.title}</strong></p>
          <p>${state.currentJob.description}</p>
          <p class="progress-text">整体完成度：${getCompletedCount()}/32</p>
          <div class="progress-bar"><div id="progressFill" class="progress-fill" style="width:${getCompletedPercent()}%"></div></div>
          <div class="actions">
            <button id="submitEvaluation" class="primary-btn">提交评估</button>
            <button id="resetEvaluation" class="secondary-btn">重置评分</button>
          </div>
        </div>
        <div class="card">
          <h2>能力维度</h2>
          <div class="dimension-nav">
            ${dimensions.map(dim => renderDimensionButton(dim)).join("")}
          </div>
        </div>
      </aside>
      <section class="eval-main">
        <div class="card">
          <div class="eval-panel-title">
            <h1>${state.activeDimension}</h1>
            <span class="progress-text">本维度完成：${getDimensionCompleted(state.activeDimension)}/4</span>
          </div>
          <div class="score-help">
            <div><strong>岗位必需程度</strong><br>0 = 不需要；1 = 很低；2 = 较低；3 = 一般；4 = 较高；5 = 非常关键。</div>
            <div><strong>你目前掌握程度</strong><br>0 = 完全不会；1 = 很弱；2 = 较弱；3 = 一般；4 = 较熟练；5 = 非常熟练。</div>
          </div>
          <div id="skillList">${renderSkillCards(state.activeDimension)}</div>
          <div class="dimension-actions">
            <button id="prevDimension" class="secondary-btn">上一个维度</button>
            <button id="nextDimension" class="primary-btn">下一个维度</button>
          </div>
        </div>
      </section>
    </section>
  `;
  bindEvaluationEvents();
}

function renderDimensionButton(dim) {
  const done = getDimensionCompleted(dim);
  const active = state.activeDimension === dim;
  return `<button class="dimension-btn ${active ? "active" : ""} ${done === 4 ? "done" : ""}" data-dimension="${dim}">
    <span>${done === 4 ? "✓" : "○"} ${dim}</span><span class="dimension-count">${done}/4</span>
  </button>`;
}

function renderSkillCards(dimension) {
  return competencyMap[dimension].map(skill => {
    const required = getDraftScore(skill, "requiredScore");
    const personal = getDraftScore(skill, "personalScore");
    return `
      <div class="skill-card" data-skill="${skill}" data-dimension="${dimension}">
        <div class="skill-title">${skill}</div>
        ${renderScoreRow(skill, "requiredScore", "岗位必需程度", required)}
        ${renderScoreRow(skill, "personalScore", "你目前掌握程度", personal)}
      </div>
    `;
  }).join("");
}

function renderScoreRow(skill, field, label, value) {
  return `<div class="score-row">
    <div>${label}</div>
    <div class="score-options" role="group" aria-label="${label}">
      ${[0,1,2,3,4,5].map(n => `<button class="score-btn ${Number(value) === n ? "selected" : ""}" data-skill="${skill}" data-field="${field}" data-score="${n}" type="button">${n}</button>`).join("")}
    </div>
  </div>`;
}

function bindEvaluationEvents() {
  document.querySelectorAll(".dimension-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      state.activeDimension = btn.dataset.dimension;
      renderEvaluation();
    });
  });
  document.querySelectorAll(".score-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      setDraftScore(btn.dataset.skill, btn.dataset.field, Number(btn.dataset.score));
      const currentCompletedBefore = getDimensionCompleted(state.activeDimension);
      renderEvaluation();
      if (currentCompletedBefore === 4) maybeAutoAdvance();
    });
  });
  document.getElementById("prevDimension").addEventListener("click", () => moveDimension(-1));
  document.getElementById("nextDimension").addEventListener("click", () => moveDimension(1));
  document.getElementById("submitEvaluation").addEventListener("click", submitEvaluation);
  document.getElementById("resetEvaluation").addEventListener("click", () => {
    if (!confirm("确定要清空当前岗位的全部评分吗？")) return;
    state.evaluationDraft = {};
    localStorage.removeItem("evaluationDraft");
    renderEvaluation();
  });
}

function maybeAutoAdvance() {
  const index = dimensions.indexOf(state.activeDimension);
  if (getDimensionCompleted(state.activeDimension) === 4 && index < dimensions.length - 1) {
    state.activeDimension = dimensions[index + 1];
    renderEvaluation();
  }
}

function moveDimension(offset) {
  const index = dimensions.indexOf(state.activeDimension);
  const nextIndex = Math.min(dimensions.length - 1, Math.max(0, index + offset));
  state.activeDimension = dimensions[nextIndex];
  renderEvaluation();
}

function getDraftScore(skill, field) {
  return state.evaluationDraft[skill] ? state.evaluationDraft[skill][field] : undefined;
}
function setDraftScore(skill, field, score) {
  if (!state.evaluationDraft[skill]) state.evaluationDraft[skill] = {};
  state.evaluationDraft[skill][field] = score;
  localStorage.setItem("evaluationDraft", JSON.stringify(state.evaluationDraft));
}
function isSkillComplete(skill) {
  const item = state.evaluationDraft[skill];
  return item && item.requiredScore !== undefined && item.personalScore !== undefined;
}
function getDimensionCompleted(dimension) {
  return competencyMap[dimension].filter(skill => isSkillComplete(skill)).length;
}
function getCompletedCount() {
  return skills.filter(item => isSkillComplete(item.skill)).length;
}
function getCompletedPercent() {
  return Math.round((getCompletedCount() / skills.length) * 100);
}

async function submitEvaluation() {
  const records = [];
  for (const item of skills) {
    const draft = state.evaluationDraft[item.skill];
    if (!draft || draft.requiredScore === undefined || draft.personalScore === undefined) {
      state.activeDimension = item.dimension;
      renderEvaluation();
      return alert(`请先完成“${item.dimension}”中的“${item.skill}”评分。`);
    }
    records.push({
      dimension: item.dimension,
      skill: item.skill,
      requiredScore: Number(draft.requiredScore),
      personalScore: Number(draft.personalScore),
      gap: Number(draft.personalScore) - Number(draft.requiredScore)
    });
  }
  const result = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    student: state.student,
    job: state.currentJob,
    records,
    createdAt: new Date().toISOString()
  };
  state.lastResult = result;
  localStorage.setItem("lastResult", JSON.stringify(result));

  try {
    const res = await fetch(API.submitResult, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.ok === false) throw new Error(data.message || "提交失败");
    alert("提交成功，数据已保存到 COS。若同一学号重复提交，将以最新结果为准。");
  } catch (e) {
    alert("云端提交失败，但本地结果已保存。请检查 API 地址或跨域配置。");
  }
  switchPage("myResult");
}

// ===================== 我的结果 =====================
function renderMyResult() {
  const result = state.lastResult;
  if (!result) {
    mainArea.innerHTML = `<section class="card"><h2>暂无个人结果</h2><p class="notice">完成并提交评估后，这里会展示个人差距表和 8 大能力雷达图。</p></section>`;
    return;
  }
  const sorted = [...result.records].sort((a,b) => Math.abs(b.gap) - Math.abs(a.gap));
  mainArea.innerHTML = `
    <section class="card">
      <h1>我的评估结果</h1>
      <p><strong>${result.student.name}</strong>｜${result.student.studentId}｜${result.job.title}</p>
      <p class="notice"><strong>岗位职责：</strong>${result.job.description}</p>
    </section>
    <section class="result-layout">
      <div class="card">
        <h2>个人差距表</h2>
        ${renderResultTable(sorted)}
      </div>
      <div class="card chart-box">
        <h2>8 大能力雷达图</h2>
        <canvas id="radarCanvas"></canvas>
      </div>
    </section>
  `;
  renderRadar(result.records);
}

function renderResultTable(records) {
  return `<div class="table-wrap"><table><thead><tr><th>技能</th><th>岗位分</th><th>个人分</th><th>差距</th><th>培训优先级</th></tr></thead><tbody>
    ${records.map(r => `<tr><td>${r.skill}</td><td>${r.requiredScore}</td><td>${r.personalScore}</td><td class="${gapClass(r.gap)}">${r.gap}</td><td>${priorityText(r.gap)}</td></tr>`).join("")}
  </tbody></table></div>`;
}
function gapClass(gap) { return gap < 0 ? "gap-neg" : gap > 0 ? "gap-pos" : "gap-zero"; }
function priorityText(gap) { return gap < 0 ? `需要培训，缺口 ${Math.abs(gap)}` : gap === 0 ? "达标" : "优势能力"; }

function renderRadar(records) {
  const labels = dimensions;
  const required = labels.map(dim => avg(records.filter(r => r.dimension === dim).map(r => r.requiredScore)));
  const personal = labels.map(dim => avg(records.filter(r => r.dimension === dim).map(r => r.personalScore)));
  if (state.radarChart) state.radarChart.destroy();
  state.radarChart = new Chart(document.getElementById("radarCanvas"), {
    type: "radar",
    data: { labels, datasets: [
      { label: "岗位要求", data: required },
      { label: "个人现状", data: personal }
    ]},
    options: { responsive: true, maintainAspectRatio: false, scales: { r: { min: 0, max: 5, ticks: { stepSize: 1 } } } }
  });
}
function avg(arr) { return Number((arr.reduce((a,b) => a + b, 0) / arr.length).toFixed(2)); }

// ===================== 全班统计 =====================
async function renderClassStats() {
  mainArea.innerHTML = `<section class="card"><h1>全班统计</h1><p class="notice">正在读取云端统计。若未部署云函数，可先查看浏览器本地保存的个人结果。</p></section>`;
  try {
    const className = state.student && state.student.className ? `?className=${encodeURIComponent(state.student.className)}` : "";
    const res = await fetch(API.getClassStats + className);
    const data = await res.json();
    if (!res.ok || data.ok === false) throw new Error(data.message || "读取统计失败");
    renderClassStatsView(data);
  } catch (e) {
    const fallback = state.lastResult ? buildStatsFromResults([state.lastResult]) : { students: [], stats: [] };
    renderClassStatsView(fallback, true);
  }
}

function renderClassStatsView(data, isFallback = false) {
  const students = data.students || [];
  const stats = data.stats || [];
  mainArea.innerHTML = `
    <section class="card"><h1>全班练习结果</h1>${isFallback ? `<p class="notice">当前为本地演示数据。部署云函数后会显示全班数据。</p>` : `<p class="notice">当前统计范围：${escapeHtml(data.className || (state.student && state.student.className) || "全部班级")}</p>`}</section>
    <section class="stats-layout">
      <div class="card">
        <h2>学生岗位列表</h2>
        <div class="table-wrap"><table><thead><tr><th>姓名</th><th>学号</th><th>岗位</th></tr></thead><tbody>
          ${students.map(s => `<tr><td>${s.name}</td><td>${s.studentId}</td><td>${s.jobTitle}</td></tr>`).join("") || `<tr><td colspan="3">暂无提交数据</td></tr>`}
        </tbody></table></div>
      </div>
      <div class="card">
        <h2>培训需求统计</h2>
        <p>按全班各技能差距总和排序，差距总和越负，培训需求越优先。</p>
        ${renderStatsTable(stats)}
        <div class="chart-box"><canvas id="barCanvas"></canvas></div>
      </div>
    </section>
  `;
  renderBar(stats.slice(0, 10));
}

function renderStatsTable(stats) {
  return `<div class="table-wrap"><table><thead><tr><th>排名</th><th>能力维度</th><th>技能</th><th>提交人数</th><th>差距总和</th></tr></thead><tbody>
    ${stats.map((r, i) => `<tr><td>${i+1}</td><td>${r.dimension}</td><td>${r.skill}</td><td>${r.count}</td><td class="${gapClass(r.gapSum)}">${r.gapSum}</td></tr>`).join("") || `<tr><td colspan="5">暂无统计数据</td></tr>`}
  </tbody></table></div>`;
}

function renderBar(stats) {
  const canvas = document.getElementById("barCanvas");
  if (!canvas || !stats.length) return;
  if (state.barChart) state.barChart.destroy();
  state.barChart = new Chart(canvas, {
    type: "bar",
    data: { labels: stats.map(s => s.skill), datasets: [{ label: "差距总和", data: stats.map(s => s.gapSum) }] },
    options: { responsive: true, maintainAspectRatio: false, indexAxis: "y" }
  });
}

function buildStatsFromResults(results) {
  const map = new Map();
  const students = results.map(r => ({ name: r.student.name, studentId: r.student.studentId, jobTitle: r.job.title }));
  results.forEach(result => result.records.forEach(r => {
    if (!map.has(r.skill)) map.set(r.skill, { dimension: r.dimension, skill: r.skill, count: 0, gapSum: 0, requiredSum: 0, personalSum: 0 });
    const item = map.get(r.skill);
    item.count += 1; item.gapSum += r.gap; item.requiredSum += r.requiredScore; item.personalSum += r.personalScore;
  }));
  const stats = [...map.values()].sort((a,b) => a.gapSum - b.gapSum);
  return { students, stats };
}

// ===================== 帮助 =====================
function renderHelp() {
  mainArea.innerHTML = `
    <section class="card">
      <h1>使用说明</h1>
      <ol>
        <li>学生填写姓名、学号、班级。</li>
        <li>在岗位选择页点击五个横排模块按钮，展开后选择具体岗位。</li>
        <li>阅读岗位职责后进入培训评估。</li>
        <li>评估页左侧为 8 大能力维度导航，右侧为该维度下的 4 项技能评分。</li>
        <li>岗位必需程度与个人掌握程度均采用 0-5 分按钮评分。</li>
        <li>提交后查看个人差距表和 8 大能力雷达图。</li>
        <li>全班统计页面展示学生岗位分布和全班培训需求排序。</li>
      </ol>
      <p class="notice">正式课堂使用时，请先部署腾讯云函数，并把 app.js 顶部 API 地址改成 API 网关地址。</p>
    </section>
  `;
}

switchPage(state.student ? "jobs" : "login");
