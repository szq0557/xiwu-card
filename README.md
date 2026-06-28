# 惜物工坊 - 公司名片系统

## 📁 项目结构

```
公司名片系统/
├── index.html          # 前端展示页面
├── admin.html          # 后台管理页面
├── css/
│   └── style.css       # 样式文件
└── js/
    ├── data.js         # 产品数据和配置
    ├── main.js         # 前端逻辑和访问追踪
    └── admin.js        # 后台管理逻辑
```

## 🚀 本地预览

直接双击 `index.html` 即可在浏览器中打开预览。

- 前台首页: `index.html`
- 后台管理: `admin.html` （默认密码: `admin123`）

## ⚙️ 配置说明

### 修改公司信息和产品

编辑 `js/data.js` 文件：

```javascript
const companyInfo = {
    name: "惜物工坊",
    slogan: "匠心传承 · 物尽其用",
    // ... 其他信息
};

const products = [
    {
        id: 1,
        name: "产品名称",
        category: "分类",
        priceMin: 99,      // 最低价格
        priceMax: 199,     // 最高价格（和priceMin相同则显示单价格）
        hasVideo: false,   // 是否有视频
        image: "封面图URL",
        images: [          // 产品图片列表（支持多张）
            "图片1URL",
            "图片2URL"
        ],
        videoUrl: "",      // 视频URL（hasVideo为true时填）
        description: "产品描述",
        features: ["特点1", "特点2"],
        specs: ["规格1", "规格2"]  // 规格参数
    },
    // ... 更多产品
];
```

### 产品价格配置说明

| 配置方式 | 显示效果 |
|---------|---------|
| `priceMin: 100, priceMax: 100` | ¥100 |
| `priceMin: 100, priceMax: 200` | ¥100 - ¥200 |
| 只填 `priceMin: 100` | ¥100 起 |
| 都不填 | 价格面议 |

### 产品视频配置

1. 将 `hasVideo` 设为 `true`
2. 在 `videoUrl` 中填入视频地址（支持 MP4 格式，建议上传到腾讯云 COS 获取 URL）
3. 产品卡片右上角会显示「视频」标识
4. 点击产品详情后可在图片/视频之间切换

### 修改管理密码

在 `js/data.js` 中修改：

```javascript
const adminConfig = {
    password: "你的密码",
    visitRecordStorageKey: "xiwu_visit_records"
};
```

### 添加工坊视频

在 `index.html` 中找到视频标签，修改 `src`：

```html
<video controls poster="封面图URL">
    <source src="你的视频URL.mp4" type="video/mp4">
</video>
```

### 微信分享卡片配置

发送到微信时显示卡片效果（标题、描述、图片），需要配置 `index.html` 中的 OG 标签：

```html
<meta property="og:title" content="惜物工坊 - 匠心传承，物尽其用">
<meta property="og:description" content="专注于传统手工艺与现代设计的完美融合">
<meta property="og:image" content="分享卡片图片URL">
<meta property="og:url" content="https://你的域名.com">
```

**配置建议：**
- `og:image` 建议尺寸 300x300 像素以上，正方形或 5:4 比例效果最佳
- 图片必须是公网可访问的 URL（上传到腾讯云 COS 获取）
- `og:url` 部署后填上你的正式域名
- 分享标题建议控制在 20 字以内，描述控制在 30 字以内

**注意：**
- 微信分享卡片需要域名已备案且在微信公众平台配置了 JS 接口安全域名才能完全生效
- 如果只是普通链接分享，OG 标签也能让微信抓取到标题和图片

---

## ☁️ 腾讯云部署方案

### 方案一：腾讯云 COS 静态网站托管（推荐，低成本）

适合纯静态页面，访问记录存储在 CloudBase 云开发数据库。

#### 步骤 1：创建 COS 存储桶

1. 登录 [腾讯云 COS 控制台](https://console.cloud.tencent.com/cos)
2. 点击「创建存储桶」
3. 名称自定义，地域选择就近节点
4. 访问权限选择「公有读私有写」
5. 点击创建

#### 步骤 2：开启静态网站

1. 进入存储桶 → 「基础配置」→ 「静态网站」
2. 开启「静态网站」开关
3. 索引文档填 `index.html`
4. 错误文档填 `index.html`（可选）
5. 保存，记下访问域名

#### 步骤 3：上传文件

1. 进入「文件列表」
2. 将所有文件按目录结构上传：
   - 根目录上传 `index.html`、`admin.html`
   - 新建 `css/` 目录，上传 `style.css`
   - 新建 `js/` 目录，上传 `data.js`、`main.js`、`admin.js`

### 方案二：接入 CloudBase 云开发（推荐，有数据库）

如果需要把访问记录存储在云端而不是本地 localStorage，请按以下步骤操作：

#### 步骤 1：开通 CloudBase

1. 登录 [云开发 CloudBase 控制台](https://console.cloud.tencent.com/tcb)
2. 新建环境，选择「按量计费」或「包年包月」
3. 环境名称自定义，等待环境初始化

#### 步骤 2：创建数据库集合

1. 进入环境 → 「数据库」
2. 新建集合，命名为 `visit_records`
3. 在「权限设置」中设置为「所有用户可读，仅创建者可写」或自定义安全规则

#### 步骤 3：修改代码接入云开发

在 `index.html` 的 `</body>` 前添加：

```html
<script src="https://static.cloudbase.net/cloudbase-js-sdk/2.7.1/cloudbase.full.js"></script>
<script>
const app = cloudbase.init({
    env: "你的环境ID" // 替换为你的云开发环境ID
});
const db = app.database();
</script>
```

修改 `js/main.js` 中的 `trackVisit` 函数，把 localStorage 存储改为数据库存储：

```javascript
async function trackVisit() {
    const visitData = {
        visitTime: new Date(),
        userAgent: navigator.userAgent,
        // ... 其他字段
    };
    
    // 写入云数据库
    try {
        await db.collection("visit_records").add(visitData);
    } catch (e) {
        console.error("记录访问失败:", e);
    }
}
```

在 `js/admin.js` 中修改读取逻辑：

```javascript
async function loadData() {
    try {
        const res = await db.collection("visit_records")
            .orderBy("visitTime", "desc")
            .limit(100)
            .get();
        allRecords = res.data;
        // ... 后续逻辑
    } catch (e) {
        console.error("加载数据失败:", e);
    }
}
```

#### 步骤 4：部署静态网站

1. 进入云开发环境 → 「静态网站托管」
2. 开启服务，选择默认配置
3. 上传所有文件到托管空间
4. 使用提供的默认域名或绑定自定义域名

### 方案三：绑定自定义域名

1. 准备已备案的域名
2. 在 COS 或 CloudBase 静态托管中「添加自定义域名」
3. 按提示配置 DNS 解析（CNAME 记录）
4. 配置 HTTPS 证书（腾讯云提供免费证书）

---

## 📊 访问记录功能说明

### 当前版本（localStorage 存储）

- 优点：无需后端，开箱即用
- 缺点：数据存储在用户浏览器本地，换设备看不到

### 记录的数据字段

| 字段 | 说明 |
|------|------|
| visitTime | 访问时间 |
| userAgent | 浏览器信息 |
| language | 浏览器语言 |
| screenWidth/Height | 屏幕尺寸 |
| referrer | 来源页面 |
| duration | 停留时长（秒） |
| browseDepth | 浏览深度（点击了几个锚点链接） |
| clickedProduct | 点击的产品名称 |
| latitude/longitude | 地理位置（需用户授权） |

### 后台功能

- 总访问量统计
- 今日访问统计
- 平均停留时长
- 移动端占比
- 最近7天访问趋势图
- 访问来源分布图
- 访问记录明细表格
- 搜索和筛选
- 数据导出（CSV格式）
- 详情弹窗查看

---

## 🎨 自定义样式

修改 `css/style.css` 中的 CSS 变量可快速调整主题色：

```css
:root {
    --primary-color: #8B6914;    /* 主色调 */
    --primary-light: #B8956E;    /* 浅色 */
    --primary-dark: #6B4F0F;     /* 深色 */
    --bg-color: #FDF8F0;         /* 背景色 */
    --accent-gold: #C9A962;      /* 点缀金色 */
}
```

---

## 📱 响应式说明

已适配以下屏幕尺寸：
- 桌面端（>1024px）：三栏布局
- 平板（768px-1024px）：两栏布局
- 手机（<768px）：单栏布局
- 小屏手机（<480px）：字体优化

---

## 🔒 安全建议

1. 上线前务必修改 `adminConfig.password` 的默认密码
2. 建议把后台页面 `admin.html` 重命名为不容易猜到的名称
3. 如果使用 CloudBase，设置好数据库安全规则
4. 敏感数据不要放在前端 JS 文件中

---

## ❓ 常见问题

**Q: 为什么访问记录在别的电脑上看不到？**
A: 当前版本使用 localStorage 存储，数据只保存在当前浏览器中。需要云端存储请参考「接入 CloudBase 云开发」。

**Q: 怎么添加更多产品？**
A: 编辑 `js/data.js` 中的 `products` 数组，按格式添加即可。

**Q: 产品图片怎么替换？**
A: 把图片上传到腾讯云 COS，获取图片 URL，替换 `products` 数组中 `image` 字段的值。

**Q: 视频怎么上传？**
A: 视频文件较大，建议上传到 COS 或腾讯云点播，获取播放地址后填入 video 标签的 src 中。