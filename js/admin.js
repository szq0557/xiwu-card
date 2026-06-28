const STORAGE_KEYS = {
    products: 'xiwu_products_data',
    company: 'xiwu_company_data',
    about: 'xiwu_about_data',
    contact: 'xiwu_contact_data',
    share: 'xiwu_share_data',
    password: 'xiwu_admin_password',
    visitRecords: 'xiwu_visit_records'
};

let currentPage = 'dashboard';
let currentProductId = null;
let filteredProducts = [];

function getStoredData(key, defaultVal) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultVal;
    } catch (e) {
        return defaultVal;
    }
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getProducts() {
    return getStoredData(STORAGE_KEYS.products, products);
}

function saveProducts(productsData) {
    saveData(STORAGE_KEYS.products, productsData);
}

function getCompanyInfo() {
    return getStoredData(STORAGE_KEYS.company, companyInfo);
}

function saveCompanyInfoData(data) {
    saveData(STORAGE_KEYS.company, data);
}

function getAboutContent() {
    const defaultAbout = {
        text1: "惜物工坊成立于2018年，是一家致力于传统手工艺传承与创新的工作室。我们相信每一件物品都有其独特的价值，通过匠心独运的设计与制作，让传统工艺在现代生活中焕发新生。",
        text2: "我们的团队由资深手工艺人和年轻设计师组成，融合传统技艺与现代美学，打造既有文化底蕴又符合当代审美的产品。",
        features: [
            { icon: "🎨", title: "匠心设计", desc: "每一件产品都经过精心设计" },
            { icon: "🌿", title: "天然材质", desc: "精选天然环保材料" },
            { icon: "✨", title: "品质保证", desc: "严格的质量把控标准" }
        ]
    };
    return getStoredData(STORAGE_KEYS.about, defaultAbout);
}

function saveAboutContentData(data) {
    saveData(STORAGE_KEYS.about, data);
}

function getContactInfo() {
    const defaultContact = {
        address: "中国·某某市某某区惜物路88号",
        phone: "400-888-8888",
        email: "hello@xiwugongfang.com",
        wechat: "xiwugongfang2018"
    };
    return getStoredData(STORAGE_KEYS.contact, defaultContact);
}

function saveContactInfoData(data) {
    saveData(STORAGE_KEYS.contact, data);
}

function getShareSettings() {
    const defaultShare = {
        title: "惜物工坊 - 匠心传承，物尽其用",
        desc: "专注于传统手工艺与现代设计的完美融合，手工陶瓷、竹编、木艺、苏绣等匠心产品",
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=traditional%20craft%20workshop%20logo%20elegant%20chinese%20style%20gold%20brown&image_size=square_hd",
        url: ""
    };
    return getStoredData(STORAGE_KEYS.share, defaultShare);
}

function saveShareSettingsData(data) {
    saveData(STORAGE_KEYS.share, data);
}

function getAdminPassword() {
    return getStoredData(STORAGE_KEYS.password, adminConfig.password);
}

function saveAdminPassword(pwd) {
    saveData(STORAGE_KEYS.password, pwd);
}

function adminLogin() {
    const password = document.getElementById('adminPassword').value;
    const errorEl = document.getElementById('loginError');
    
    if (password === getAdminPassword()) {
        sessionStorage.setItem('admin_logged_in', 'true');
        showDashboard();
    } else {
        errorEl.textContent = '密码错误，请重试';
        errorEl.style.display = 'block';
    }
}

function adminLogout() {
    sessionStorage.removeItem('admin_logged_in');
    document.getElementById('adminLayout').style.display = 'none';
    document.getElementById('loginSection').style.display = 'flex';
    document.getElementById('adminPassword').value = '';
    document.getElementById('loginError').style.display = 'none';
}

function showDashboard() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('adminLayout').style.display = 'flex';
    loadDashboardData();
}

function switchPage(page, menuItem) {
    currentPage = page;
    
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    if (menuItem) menuItem.classList.add('active');
    
    document.querySelectorAll('.page-container').forEach(p => {
        p.style.display = 'none';
    });
    document.getElementById('page' + page.charAt(0).toUpperCase() + page.slice(1)).style.display = 'block';
    
    if (page === 'dashboard') {
        loadDashboardData();
    } else if (page === 'products') {
        loadProductsList();
    } else if (page === 'content') {
        loadContentSettings();
    }
}

function switchContentTab(tab, btn) {
    document.querySelectorAll('.content-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.content-panel').forEach(p => p.style.display = 'none');
    
    btn.classList.add('active');
    document.getElementById('panel' + tab.charAt(0).toUpperCase() + tab.slice(1)).style.display = 'block';
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show toast-' + type;
    setTimeout(() => {
        toast.className = 'toast';
    }, 2500);
}

let allRecords = [];
let filteredRecords = [];
let currentRecordPage = 1;
const recordPageSize = 20;

function loadDashboardData() {
    allRecords = getVisitRecords();
    filteredRecords = [...allRecords];
    updateStats();
    renderWeekChart();
    renderSourceChart();
    renderRecordsTable();
}

function getVisitRecords() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.visitRecords)) || [];
    } catch (e) {
        return [];
    }
}

function updateStats() {
    const total = allRecords.length;
    document.getElementById('totalVisits').textContent = total;

    const today = new Date().toDateString();
    const todayCount = allRecords.filter(r => new Date(r.visitTime).toDateString() === today).length;
    document.getElementById('todayVisits').textContent = todayCount;

    const recordsWithDuration = allRecords.filter(r => r.duration > 0);
    const avgDuration = recordsWithDuration.length > 0
        ? Math.floor(recordsWithDuration.reduce((sum, r) => sum + r.duration, 0) / recordsWithDuration.length)
        : 0;
    document.getElementById('avgDuration').textContent = formatDuration(avgDuration);

    const mobileCount = allRecords.filter(r => isMobile(r.userAgent)).length;
    const mobileRate = total > 0 ? Math.round((mobileCount / total) * 100) : 0;
    document.getElementById('mobileRate').textContent = mobileRate + '%';
}

function formatDuration(seconds) {
    if (seconds < 60) return seconds + 's';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins + 'm' + secs + 's';
}

function isMobile(userAgent) {
    return /Mobile|Android|iPhone|iPad|iPod/i.test(userAgent);
}

function getDeviceType(userAgent) {
    if (/Mobile|Android|iPhone|iPod/i.test(userAgent)) return '📱 手机';
    if (/iPad|Tablet/i.test(userAgent)) return '📱 平板';
    return '💻 电脑';
}

function renderWeekChart() {
    const chartEl = document.getElementById('weekChart');
    const days = [];
    const counts = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();
        const dayLabel = (date.getMonth() + 1) + '/' + date.getDate();
        days.push(dayLabel);
        const count = allRecords.filter(r => new Date(r.visitTime).toDateString() === dateStr).length;
        counts.push(count);
    }

    const maxCount = Math.max(...counts, 1);
    chartEl.innerHTML = `
        <div class="bar-chart">
            ${days.map((day, i) => `
                <div class="bar-item">
                    <div class="bar-label">${counts[i]}</div>
                    <div class="bar-wrapper">
                        <div class="bar" style="height: ${(counts[i] / maxCount) * 100}%"></div>
                    </div>
                    <div class="bar-day">${day}</div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderSourceChart() {
    const chartEl = document.getElementById('sourceChart');
    const sources = {};
    
    allRecords.forEach(r => {
        const source = r.referrer || '直接访问';
        sources[source] = (sources[source] || 0) + 1;
    });

    const sourceList = Object.entries(sources)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);

    const total = allRecords.length || 1;

    chartEl.innerHTML = `
        <div class="source-list">
            ${sourceList.map(([source, count]) => {
                const shortSource = source.length > 20 ? source.substring(0, 20) + '...' : source;
                const percentage = Math.round((count / total) * 100);
                return `
                    <div class="source-item">
                        <div class="source-label">
                            <span>${shortSource}</span>
                            <span>${count} (${percentage}%)</span>
                        </div>
                        <div class="source-bar-bg">
                            <div class="source-bar" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                `;
            }).join('')}
            ${sourceList.length === 0 ? '<p class="empty-text">暂无数据</p>' : ''}
        </div>
    `;
}

function filterRecords() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    filteredRecords = allRecords.filter(r => {
        const matchSearch = !searchTerm || 
            (r.referrer && r.referrer.toLowerCase().includes(searchTerm)) ||
            (r.clickedProduct && r.clickedProduct.toLowerCase().includes(searchTerm)) ||
            (r.userAgent && r.userAgent.toLowerCase().includes(searchTerm));
        return matchSearch;
    });
    
    currentRecordPage = 1;
    renderRecordsTable();
}

function renderRecordsTable() {
    const tbody = document.getElementById('recordsTableBody');
    const start = (currentRecordPage - 1) * recordPageSize;
    const pageRecords = filteredRecords.slice(start, start + recordPageSize);

    tbody.innerHTML = pageRecords.map((record, index) => `
        <tr>
            <td>${start + index + 1}</td>
            <td>${formatDate(record.visitTime)}</td>
            <td class="referrer-cell" title="${record.referrer}">${truncateText(record.referrer, 25)}</td>
            <td>${getDeviceType(record.userAgent)}</td>
            <td>${formatDuration(record.duration || 0)}</td>
            <td>${record.browseDepth || 1}</td>
            <td>${record.clickedProduct || '-'}</td>
            <td>
                <button class="btn-small btn-info" onclick="viewDetail('${record.id}')">详情</button>
            </td>
        </tr>
    `).join('');

    renderPagination();
}

function truncateText(text, maxLen) {
    if (!text) return '-';
    return text.length > maxLen ? text.substring(0, maxLen) + '...' : text;
}

function formatDate(isoString) {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0') + ' ' +
        String(date.getHours()).padStart(2, '0') + ':' +
        String(date.getMinutes()).padStart(2, '0') + ':' +
        String(date.getSeconds()).padStart(2, '0');
}

function renderPagination() {
    const totalPages = Math.ceil(filteredRecords.length / recordPageSize);
    const paginationEl = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        paginationEl.innerHTML = '';
        return;
    }

    let html = '';
    html += `<button class="page-btn" ${currentRecordPage === 1 ? 'disabled' : ''} onclick="goToRecordPage(${currentRecordPage - 1})">上一页</button>`;
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentRecordPage - 2 && i <= currentRecordPage + 2)) {
            html += `<button class="page-btn ${i === currentRecordPage ? 'active' : ''}" onclick="goToRecordPage(${i})">${i}</button>`;
        } else if (i === currentRecordPage - 3 || i === currentRecordPage + 3) {
            html += '<span class="page-ellipsis">...</span>';
        }
    }
    
    html += `<button class="page-btn" ${currentRecordPage === totalPages ? 'disabled' : ''} onclick="goToRecordPage(${currentRecordPage + 1})">下一页</button>`;
    html += `<span class="page-info">共 ${filteredRecords.length} 条，第 ${currentRecordPage}/${totalPages} 页</span>`;
    
    paginationEl.innerHTML = html;
}

function goToRecordPage(page) {
    currentRecordPage = page;
    renderRecordsTable();
}

function viewDetail(id) {
    const record = allRecords.find(r => r.id === id);
    if (!record) return;

    const detailContent = document.getElementById('detailContent');
    detailContent.innerHTML = `
        <div class="detail-grid">
            <div class="detail-item">
                <label>访问时间</label>
                <span>${formatDate(record.visitTime)}</span>
            </div>
            <div class="detail-item">
                <label>来源页面</label>
                <span class="break-word">${record.referrer || '-'}</span>
            </div>
            <div class="detail-item">
                <label>访问页面</label>
                <span class="break-word">${record.page || '-'}</span>
            </div>
            <div class="detail-item">
                <label>停留时长</label>
                <span>${formatDuration(record.duration || 0)}</span>
            </div>
            <div class="detail-item">
                <label>浏览深度</label>
                <span>${record.browseDepth || 1}</span>
            </div>
            <div class="detail-item">
                <label>点击产品</label>
                <span>${record.clickedProduct || '-'}</span>
            </div>
            <div class="detail-item">
                <label>设备类型</label>
                <span>${getDeviceType(record.userAgent)}</span>
            </div>
            <div class="detail-item">
                <label>屏幕尺寸</label>
                <span>${record.screenWidth || '-'} x ${record.screenHeight || '-'}</span>
            </div>
            <div class="detail-item">
                <label>浏览器语言</label>
                <span>${record.language || '-'}</span>
            </div>
            <div class="detail-item">
                <label>地理位置</label>
                <span>${record.latitude && record.longitude ? record.latitude.toFixed(4) + ', ' + record.longitude.toFixed(4) : '未授权'}</span>
            </div>
            <div class="detail-item detail-full">
                <label>User Agent</label>
                <span class="break-word">${record.userAgent || '-'}</span>
            </div>
        </div>
    `;
    
    document.getElementById('detailModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('detailModal').style.display = 'none';
}

function exportData() {
    if (allRecords.length === 0) {
        showToast('暂无数据可导出', 'error');
        return;
    }
    
    const csvContent = [
        ['序号', '访问时间', '来源', '设备类型', '停留时长(秒)', '浏览深度', '点击产品', '屏幕尺寸', '浏览器语言'].join(','),
        ...allRecords.map((r, i) => [
            i + 1,
            formatDate(r.visitTime),
            '"' + (r.referrer || '') + '"',
            getDeviceType(r.userAgent),
            r.duration || 0,
            r.browseDepth || 1,
            r.clickedProduct || '',
            (r.screenWidth || '') + 'x' + (r.screenHeight || ''),
            r.language || ''
        ].join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = '访问记录_' + new Date().toISOString().slice(0, 10) + '.csv';
    link.click();
    showToast('导出成功');
}

function clearData() {
    if (confirm('确定要清空所有访问记录吗？此操作不可恢复！')) {
        localStorage.removeItem(STORAGE_KEYS.visitRecords);
        loadDashboardData();
        showToast('记录已清空');
    }
}

function backToSite() {
    window.open('index.html', '_blank');
}

function loadProductsList() {
    const productsList = getProducts();
    filteredProducts = [...productsList];
    document.getElementById('productCount').textContent = productsList.length;
    renderProductsList();
}

function filterProducts() {
    const search = document.getElementById('productSearch').value.toLowerCase();
    const allProducts = getProducts();
    filteredProducts = allProducts.filter(p => 
        p.name.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search)
    );
    renderProductsList();
}

function renderProductsList() {
    const listEl = document.getElementById('productsList');
    
    if (filteredProducts.length === 0) {
        listEl.innerHTML = '<div class="empty-products">暂无产品，点击右上角"添加产品"开始添加</div>';
        return;
    }

    listEl.innerHTML = filteredProducts.map(product => `
        <div class="product-manage-card">
            <div class="product-manage-img">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23eee%22 width=%22100%22 height=%22100%22/><text x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22>无图</text></svg>'">
            </div>
            <div class="product-manage-info">
                <div class="product-manage-title">
                    <h4>${product.name}</h4>
                    <span class="product-manage-category">${product.category || '未分类'}</span>
                </div>
                <div class="product-manage-price">
                    ${formatProductPrice(product)}
                </div>
                <p class="product-manage-desc">${product.description || '暂无描述'}</p>
                ${product.hasVideo ? '<span class="video-tag">有视频</span>' : ''}
            </div>
            <div class="product-manage-actions">
                <button class="btn-small btn-info" onclick="editProduct(${product.id})">编辑</button>
                <button class="btn-small btn-up" onclick="moveProduct(${product.id}, 'up')">↑</button>
                <button class="btn-small btn-down" onclick="moveProduct(${product.id}, 'down')">↓</button>
                <button class="btn-small btn-danger" onclick="deleteProduct(${product.id})">删除</button>
            </div>
        </div>
    `).join('');
}

function formatProductPrice(product) {
    if (product.priceMin && product.priceMax) {
        if (product.priceMin === product.priceMax) {
            return '¥' + product.priceMin;
        }
        return '¥' + product.priceMin + ' - ¥' + product.priceMax;
    }
    if (product.priceMin) {
        return '¥' + product.priceMin + ' 起';
    }
    return product.price || '价格面议';
}

function openProductEditor(productId = null) {
    currentProductId = productId;
    const modal = document.getElementById('productEditorModal');
    const titleEl = document.getElementById('productEditorTitle');
    
    if (productId) {
        const product = getProducts().find(p => p.id === productId);
        if (!product) return;
        titleEl.textContent = '编辑产品';
        document.getElementById('editProductName').value = product.name || '';
        document.getElementById('editProductCategory').value = product.category || '';
        document.getElementById('editPriceMin').value = product.priceMin || '';
        document.getElementById('editPriceMax').value = product.priceMax || '';
        document.getElementById('editProductImage').value = product.image || '';
        document.getElementById('editProductImages').value = (product.images || []).join('\n');
        document.getElementById('editHasVideo').checked = !!product.hasVideo;
        document.getElementById('editVideoUrl').value = product.videoUrl || '';
        document.getElementById('editProductDesc').value = product.description || '';
        document.getElementById('editProductFeatures').value = (product.features || []).join(', ');
        document.getElementById('editProductSpecs').value = (product.specs || []).join(', ');
        toggleVideoInput();
    } else {
        titleEl.textContent = '添加产品';
        document.getElementById('editProductName').value = '';
        document.getElementById('editProductCategory').value = '';
        document.getElementById('editPriceMin').value = '';
        document.getElementById('editPriceMax').value = '';
        document.getElementById('editProductImage').value = '';
        document.getElementById('editProductImages').value = '';
        document.getElementById('editHasVideo').checked = false;
        document.getElementById('editVideoUrl').value = '';
        document.getElementById('editProductDesc').value = '';
        document.getElementById('editProductFeatures').value = '';
        document.getElementById('editProductSpecs').value = '';
        toggleVideoInput();
    }
    
    modal.style.display = 'flex';
}

function editProduct(id) {
    openProductEditor(id);
}

function closeProductEditor() {
    document.getElementById('productEditorModal').style.display = 'none';
    currentProductId = null;
}

function toggleVideoInput() {
    const hasVideo = document.getElementById('editHasVideo').checked;
    document.getElementById('videoInputRow').style.display = hasVideo ? 'block' : 'none';
}

function saveProduct() {
    const name = document.getElementById('editProductName').value.trim();
    if (!name) {
        showToast('请输入产品名称', 'error');
        return;
    }
    
    const image = document.getElementById('editProductImage').value.trim();
    if (!image) {
        showToast('请输入封面图URL', 'error');
        return;
    }

    const imagesText = document.getElementById('editProductImages').value.trim();
    const images = imagesText ? imagesText.split('\n').map(s => s.trim()).filter(s => s) : [image];
    
    const hasVideo = document.getElementById('editHasVideo').checked;
    const videoUrl = hasVideo ? document.getElementById('editVideoUrl').value.trim() : '';
    
    const featuresText = document.getElementById('editProductFeatures').value.trim();
    const features = featuresText ? featuresText.split(/[,，]/).map(s => s.trim()).filter(s => s) : [];
    
    const specsText = document.getElementById('editProductSpecs').value.trim();
    const specs = specsText ? specsText.split(/[,，]/).map(s => s.trim()).filter(s => s) : [];

    const productData = {
        name,
        category: document.getElementById('editProductCategory').value.trim(),
        priceMin: parseInt(document.getElementById('editPriceMin').value) || null,
        priceMax: parseInt(document.getElementById('editPriceMax').value) || null,
        image,
        images,
        hasVideo,
        videoUrl,
        description: document.getElementById('editProductDesc').value.trim(),
        features,
        specs
    };

    const productsList = getProducts();
    
    if (currentProductId) {
        const index = productsList.findIndex(p => p.id === currentProductId);
        if (index > -1) {
            productsList[index] = { ...productsList[index], ...productData };
        }
        showToast('产品已更新');
    } else {
        productData.id = Date.now();
        productsList.push(productData);
        showToast('产品已添加');
    }

    saveProducts(productsList);
    closeProductEditor();
    loadProductsList();
}

function deleteProduct(id) {
    if (!confirm('确定要删除这个产品吗？')) return;
    
    const productsList = getProducts().filter(p => p.id !== id);
    saveProducts(productsList);
    loadProductsList();
    showToast('产品已删除');
}

function moveProduct(id, direction) {
    const productsList = getProducts();
    const index = productsList.findIndex(p => p.id === id);
    if (index === -1) return;
    
    if (direction === 'up' && index > 0) {
        [productsList[index], productsList[index - 1]] = [productsList[index - 1], productsList[index]];
    } else if (direction === 'down' && index < productsList.length - 1) {
        [productsList[index], productsList[index + 1]] = [productsList[index + 1], productsList[index]];
    } else {
        return;
    }
    
    saveProducts(productsList);
    loadProductsList();
}

function loadContentSettings() {
    const company = getCompanyInfo();
    document.getElementById('companyName').value = company.name || '';
    document.getElementById('companySlogan').value = company.slogan || '';
    document.getElementById('companyDesc').value = company.description || '';

    const about = getAboutContent();
    document.getElementById('aboutText1').value = about.text1 || '';
    document.getElementById('aboutText2').value = about.text2 || '';
    if (about.features && about.features.length >= 3) {
        document.getElementById('feature1Icon').value = about.features[0].icon || '';
        document.getElementById('feature1Title').value = about.features[0].title || '';
        document.getElementById('feature1Desc').value = about.features[0].desc || '';
        document.getElementById('feature2Icon').value = about.features[1].icon || '';
        document.getElementById('feature2Title').value = about.features[1].title || '';
        document.getElementById('feature2Desc').value = about.features[1].desc || '';
        document.getElementById('feature3Icon').value = about.features[2].icon || '';
        document.getElementById('feature3Title').value = about.features[2].title || '';
        document.getElementById('feature3Desc').value = about.features[2].desc || '';
    }

    const contact = getContactInfo();
    document.getElementById('contactPhone').value = contact.phone || '';
    document.getElementById('contactEmail').value = contact.email || '';
    document.getElementById('contactWechat').value = contact.wechat || '';

    const share = getShareSettings();
    document.getElementById('shareTitle').value = share.title || '';
    document.getElementById('shareDesc').value = share.desc || '';
    document.getElementById('shareImage').value = share.image || '';
    document.getElementById('shareUrl').value = share.url || '';
}

function saveCompanyInfo() {
    const data = {
        name: document.getElementById('companyName').value.trim(),
        slogan: document.getElementById('companySlogan').value.trim(),
        description: document.getElementById('companyDesc').value.trim()
    };
    saveCompanyInfoData(data);
    showToast('公司信息已保存');
}

function saveAboutContent() {
    const data = {
        text1: document.getElementById('aboutText1').value.trim(),
        text2: document.getElementById('aboutText2').value.trim(),
        features: [
            {
                icon: document.getElementById('feature1Icon').value.trim(),
                title: document.getElementById('feature1Title').value.trim(),
                desc: document.getElementById('feature1Desc').value.trim()
            },
            {
                icon: document.getElementById('feature2Icon').value.trim(),
                title: document.getElementById('feature2Title').value.trim(),
                desc: document.getElementById('feature2Desc').value.trim()
            },
            {
                icon: document.getElementById('feature3Icon').value.trim(),
                title: document.getElementById('feature3Title').value.trim(),
                desc: document.getElementById('feature3Desc').value.trim()
            }
        ]
    };
    saveAboutContentData(data);
    showToast('关于我们已保存');
}

function saveContactInfo() {
    const data = {
        phone: document.getElementById('contactPhone').value.trim(),
        wechat: document.getElementById('contactWechat').value.trim()
    };
    saveContactInfoData(data);
    showToast('联系方式已保存');
}

function saveShareSettings() {
    const data = {
        title: document.getElementById('shareTitle').value.trim(),
        desc: document.getElementById('shareDesc').value.trim(),
        image: document.getElementById('shareImage').value.trim(),
        url: document.getElementById('shareUrl').value.trim()
    };
    saveShareSettingsData(data);
    showToast('分享设置已保存');
}

function changePassword() {
    const oldPwd = document.getElementById('oldPassword').value;
    const newPwd = document.getElementById('newPassword').value;
    const confirmPwd = document.getElementById('confirmPassword').value;

    if (oldPwd !== getAdminPassword()) {
        showToast('当前密码不正确', 'error');
        return;
    }
    if (!newPwd || newPwd.length < 4) {
        showToast('新密码至少4位', 'error');
        return;
    }
    if (newPwd !== confirmPwd) {
        showToast('两次输入的新密码不一致', 'error');
        return;
    }

    saveAdminPassword(newPwd);
    document.getElementById('oldPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    showToast('密码修改成功');
}

function exportAllData() {
    const data = {
        version: '1.0',
        exportTime: new Date().toISOString(),
        products: getProducts(),
        company: getCompanyInfo(),
        about: getAboutContent(),
        contact: getContactInfo(),
        share: getShareSettings()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = '惜物工坊数据备份_' + new Date().toISOString().slice(0, 10) + '.json';
    link.click();
    showToast('数据导出成功');
}

function importAllData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.products) saveProducts(data.products);
            if (data.company) saveCompanyInfoData(data.company);
            if (data.about) saveAboutContentData(data.about);
            if (data.contact) saveContactInfoData(data.contact);
            if (data.share) saveShareSettingsData(data.share);
            showToast('数据导入成功');
            if (currentPage === 'products') loadProductsList();
            if (currentPage === 'content') loadContentSettings();
        } catch (err) {
            showToast('导入失败，文件格式不正确', 'error');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function resetAllData() {
    if (!confirm('确定要恢复所有默认数据吗？自定义内容将被清除！')) return;
    
    Object.values(STORAGE_KEYS).forEach(key => {
        if (key !== STORAGE_KEYS.visitRecords && key !== STORAGE_KEYS.password) {
            localStorage.removeItem(key);
        }
    });
    
    showToast('已恢复默认数据');
    if (currentPage === 'products') loadProductsList();
    if (currentPage === 'content') loadContentSettings();
}

function uploadImage(targetId) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async function(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            showToast('图片大小不能超过5MB', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('smfile', file);

        try {
            showToast('正在上传图片...');
            
            const response = await fetch('https://sm.ms/api/v2/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            const result = await response.json();

            if (result.code === 'success') {
                const imageUrl = result.data.url;
                
                const target = document.getElementById(targetId);
                if (target) {
                    if (target.tagName === 'TEXTAREA') {
                        const currentValue = target.value.trim();
                        target.value = currentValue ? currentValue + '\n' + imageUrl : imageUrl;
                    } else {
                        target.value = imageUrl;
                        showImagePreview(imageUrl);
                    }
                }
                
                showToast('图片上传成功');
            } else {
                showToast('上传失败：' + result.message, 'error');
            }
        } catch (error) {
            showToast('上传失败，请重试', 'error');
            console.error('Upload error:', error);
        }
    };
    input.click();
}

function showImagePreview(url) {
    const previewContainer = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImage');
    
    if (previewContainer && previewImg) {
        previewImg.src = url;
        previewContainer.style.display = 'flex';
        previewContainer.style.alignItems = 'center';
    }
}

function clearPreview() {
    const previewContainer = document.getElementById('imagePreview');
    const previewImg = document.getElementById('previewImage');
    const input = document.getElementById('editProductImage');
    
    if (previewContainer) previewContainer.style.display = 'none';
    if (previewImg) previewImg.src = '';
    if (input) input.value = '';
}

function uploadVideo() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = async function(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 50 * 1024 * 1024) {
            showToast('视频大小不能超过50MB', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            showToast('正在上传视频...');
            
            const response = await fetch('https://api.streamable.com/upload', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.status === 1) {
                const videoUrl = 'https://streamable.com/' + result.shortcode;
                
                const target = document.getElementById('editVideoUrl');
                if (target) {
                    target.value = videoUrl;
                    showVideoPreview(videoUrl);
                }
                
                showToast('视频上传成功');
            } else {
                showToast('上传失败：' + (result.message || '未知错误'), 'error');
            }
        } catch (error) {
            showToast('上传失败，请重试', 'error');
            console.error('Video upload error:', error);
        }
    };
    input.click();
}

function showVideoPreview(url) {
    const previewContainer = document.getElementById('videoPreview');
    const previewVideo = document.getElementById('previewVideo');
    const previewSource = document.getElementById('previewVideoSource');
    
    if (previewContainer && previewVideo && previewSource) {
        previewSource.src = url.replace('streamable.com/', 'streamable.com/o/');
        previewVideo.load();
        previewContainer.style.display = 'flex';
        previewContainer.style.alignItems = 'center';
    }
}

function clearVideoPreview() {
    const previewContainer = document.getElementById('videoPreview');
    const previewVideo = document.getElementById('previewVideo');
    const previewSource = document.getElementById('previewVideoSource');
    const input = document.getElementById('editVideoUrl');
    
    if (previewContainer) previewContainer.style.display = 'none';
    if (previewSource) previewSource.src = '';
    if (previewVideo) previewVideo.pause();
    if (input) input.value = '';
}

document.getElementById('adminPassword')?.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        adminLogin();
    }
});

document.getElementById('detailModal')?.addEventListener('click', function (e) {
    if (e.target === this) closeModal();
});

document.getElementById('productEditorModal')?.addEventListener('click', function (e) {
    if (e.target === this) closeProductEditor();
});

document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('admin_logged_in') === 'true') {
        showDashboard();
    }
});