const FRONT_STORAGE_KEYS = {
    products: 'xiwu_products_data',
    company: 'xiwu_company_data',
    about: 'xiwu_about_data',
    contact: 'xiwu_contact_data',
    share: 'xiwu_share_data',
    visitRecords: 'xiwu_visit_records'
};

function getFrontData(key, defaultVal) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultVal;
    } catch (e) {
        return defaultVal;
    }
}

function getFrontProducts() {
    return getFrontData(FRONT_STORAGE_KEYS.products, products);
}

function getFrontCompany() {
    return getFrontData(FRONT_STORAGE_KEYS.company, companyInfo);
}

function getFrontAbout() {
    const defaultAbout = {
        text1: "惜物工坊成立于2018年，是一家致力于传统手工艺传承与创新的工作室。我们相信每一件物品都有其独特的价值，通过匠心独运的设计与制作，让传统工艺在现代生活中焕发新生。",
        text2: "我们的团队由资深手工艺人和年轻设计师组成，融合传统技艺与现代美学，打造既有文化底蕴又符合当代审美的产品。",
        features: [
            { icon: "🎨", title: "匠心设计", desc: "每一件产品都经过精心设计" },
            { icon: "🌿", title: "天然材质", desc: "精选天然环保材料" },
            { icon: "✨", title: "品质保证", desc: "严格的质量把控标准" }
        ]
    };
    return getFrontData(FRONT_STORAGE_KEYS.about, defaultAbout);
}

function getFrontContact() {
    const defaultContact = {
        phone: "400-888-8888",
        wechat: "xiwugongfang2018"
    };
    return getFrontData(FRONT_STORAGE_KEYS.contact, defaultContact);
}

function getFrontShare() {
    const defaultShare = {
        title: "",
        desc: "",
        image: "",
        url: ""
    };
    return getFrontData(FRONT_STORAGE_KEYS.share, defaultShare);
}

function initPageContent() {
    const company = getFrontCompany();
    const about = getFrontAbout();
    const contact = getFrontContact();
    const share = getFrontShare();

    if (company.name) {
        document.title = company.name + ' - ' + (company.slogan || '');
        document.querySelector('.logo').textContent = company.name;
        document.querySelector('.hero-content h1').textContent = company.name;
    }
    if (company.slogan) {
        document.querySelector('.tagline').textContent = company.slogan;
    }
    if (company.description) {
        document.querySelector('.hero-desc').textContent = company.description;
    }

    const aboutTexts = document.querySelectorAll('.about-text p');
    if (about.text1 && aboutTexts[0]) {
        aboutTexts[0].textContent = about.text1;
    }
    if (about.text2 && aboutTexts[1]) {
        aboutTexts[1].textContent = about.text2;
    }

    const features = document.querySelectorAll('.feature');
    if (about.features && features.length >= 3) {
        about.features.forEach((f, i) => {
            if (features[i]) {
                if (f.icon) features[i].querySelector('.feature-icon').textContent = f.icon;
                if (f.title) features[i].querySelector('h3').textContent = f.title;
                if (f.desc) features[i].querySelector('p').textContent = f.desc;
            }
        });
    }

    const contactItems = document.querySelectorAll('.contact-item');
    if (contactItems.length >= 3) {
        if (contact.phone) contactItems[0].querySelector('p').textContent = contact.phone;
        if (contact.email) contactItems[1].querySelector('p').textContent = contact.email;
        if (contact.wechat) contactItems[2].querySelector('p').textContent = contact.wechat;
    }

    if (share.title) {
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', share.title);
    }
    if (share.desc) {
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', share.desc);
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', share.desc);
    }
    if (share.image) {
        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) ogImage.setAttribute('content', share.image);
        const itemImage = document.querySelector('meta[itemprop="image"]');
        if (itemImage) itemImage.setAttribute('content', share.image);
    }
    if (share.url) {
        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute('content', share.url);
    }
}

function trackVisit() {
    const visitData = {
        id: Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        visitTime: new Date().toISOString(),
        userAgent: navigator.userAgent,
        language: navigator.language,
        screenWidth: screen.width,
        screenHeight: screen.height,
        referrer: document.referrer || '直接访问',
        page: window.location.href,
        ip: '未知',
        duration: 0,
        browseDepth: 1
    };

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                visitData.latitude = position.coords.latitude;
                visitData.longitude = position.coords.longitude;
            },
            () => {
            },
            { timeout: 3000 }
        );
    }

    const records = getVisitRecords();
    records.unshift(visitData);
    if (records.length > 1000) {
        records.pop();
    }
    localStorage.setItem(adminConfig.visitRecordStorageKey, JSON.stringify(records));

    let startTime = Date.now();
    window.addEventListener('beforeunload', () => {
        const duration = Math.floor((Date.now() - startTime) / 1000);
        const updatedRecords = getVisitRecords();
        if (updatedRecords.length > 0 && updatedRecords[0].id === visitData.id) {
            updatedRecords[0].duration = duration;
            localStorage.setItem(adminConfig.visitRecordStorageKey, JSON.stringify(updatedRecords));
        }
    });

    let maxDepth = 1;
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' && e.target.getAttribute('href')?.startsWith('#')) {
            maxDepth++;
            const updatedRecords = getVisitRecords();
            if (updatedRecords.length > 0 && updatedRecords[0].id === visitData.id) {
                updatedRecords[0].browseDepth = maxDepth;
                localStorage.setItem(adminConfig.visitRecordStorageKey, JSON.stringify(updatedRecords));
            }
        }
    });
}

function getVisitRecords() {
    try {
        return JSON.parse(localStorage.getItem(adminConfig.visitRecordStorageKey)) || [];
    } catch (e) {
        return [];
    }
}

function formatPrice(product) {
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

function renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    const productsData = getFrontProducts();

    grid.innerHTML = productsData.map(product => `
        <div class="product-card" onclick="openProductModal(${product.id})">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <span class="product-category">${product.category}</span>
                ${product.hasVideo ? '<span class="product-video-badge">▶ 视频</span>' : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${formatPrice(product)}</p>
                <p class="product-desc">${product.description}</p>
                <div class="product-features">
                    ${(product.features || []).map(f => `<span class="feature-tag">${f}</span>`).join('')}
                </div>
                <div class="product-view-detail">
                    查看详情 <span>→</span>
                </div>
            </div>
        </div>
    `).join('');
}

function openProductModal(productId) {
    const productsData = getFrontProducts();
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    const modalBody = document.getElementById('productModalBody');
    const images = product.images && product.images.length > 0 ? product.images : [product.image];
    
    modalBody.innerHTML = `
        <div class="product-detail-grid">
            <div class="product-detail-media">
                <div class="product-main-media">
                    <div class="main-image-wrapper" id="mainImageWrapper">
                        <img id="mainProductImage" src="${images[0]}" alt="${product.name}">
                    </div>
                    ${product.hasVideo && product.videoUrl ? `
                        <div class="video-wrapper" id="videoWrapper" style="display:none;">
                            ${isBilibiliVideo(product.videoUrl) ? `
                                <div class="bilibili-embed">
                                    <iframe id="bilibiliPlayer" src="${getBilibiliEmbedUrl(product.videoUrl)}" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>
                                </div>
                            ` : `
                                <video id="productVideo" controls poster="${product.image}">
                                    <source src="${product.videoUrl}" type="video/mp4">
                                    您的浏览器不支持视频播放
                                </video>
                            `}
                        </div>
                    ` : ''}
                </div>
                ${product.hasVideo && product.videoUrl ? `
                    <div class="product-media-tabs">
                        <button class="media-tab active" onclick="switchMedia('image', this)">
                            🖼️ 图片 ${images.length > 1 ? '(' + images.length + ')' : ''}
                        </button>
                        <button class="media-tab" onclick="switchMedia('video', this)">
                            ▶️ 视频
                        </button>
                    </div>
                ` : ''}
                ${images.length > 1 ? `
                    <div class="product-thumbs">
                        ${images.map((img, i) => `
                            <div class="thumb-item ${i === 0 ? 'active' : ''}" onclick="changeMainImage('${img}', this)">
                                <img src="${img}" alt="图${i + 1}">
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
            <div class="product-detail-info">
                <span class="product-detail-category">${product.category}</span>
                <h2 class="product-detail-name">${product.name}</h2>
                <div class="product-detail-price">
                    <span class="price-label">价格</span>
                    <span class="price-value">${formatPrice(product)}</span>
                </div>
                <div class="product-detail-desc">
                    <h4>产品介绍</h4>
                    <p>${product.description}</p>
                </div>
                ${product.features && product.features.length > 0 ? `
                    <div class="product-detail-features">
                        <h4>产品特点</h4>
                        <div class="feature-list">
                            ${product.features.map(f => `
                                <div class="feature-item">
                                    <span class="feature-dot">◆</span>
                                    <span>${f}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                ${product.specs && product.specs.length > 0 ? `
                    <div class="product-detail-specs">
                        <h4>规格参数</h4>
                        <ul class="spec-list">
                            ${product.specs.map(s => `<li>${s}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                <div class="product-detail-actions">
                    <a href="#contact" class="btn-primary btn-contact" onclick="closeProductModal()">
                        📞 咨询购买
                    </a>
                </div>
            </div>
        </div>
    `;

    document.getElementById('productModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    
    const records = getVisitRecords();
    if (records.length > 0) {
        records[0].clickedProduct = product.name;
        records[0].viewedDetail = true;
        localStorage.setItem(adminConfig.visitRecordStorageKey, JSON.stringify(records));
    }
}

function isBilibiliVideo(url) {
    if (!url) return false;
    return url.includes('bilibili.com') || url.includes('BV1') || url.includes('av');
}

function getBilibiliEmbedUrl(url) {
    if (!url) return '';
    
    let bvid = '';
    const bvMatch = url.match(/BV[a-zA-Z0-9]+/);
    if (bvMatch) {
        bvid = bvMatch[0];
    } else {
        const avMatch = url.match(/av(\d+)/i);
        if (avMatch) {
            bvid = avMatch[0];
        }
    }
    
    if (bvid) {
        return '//player.bilibili.com/player.html?bvid=' + bvid + '&page=1&autoplay=0';
    }
    return url;
}

function switchMedia(type, btn) {
    const tabs = btn.parentElement.querySelectorAll('.media-tab');
    tabs.forEach(t => t.classList.remove('active'));
    btn.classList.add('active');

    const imageWrapper = document.getElementById('mainImageWrapper');
    const videoWrapper = document.getElementById('videoWrapper');
    const thumbs = document.querySelector('.product-thumbs');

    if (type === 'image') {
        imageWrapper.style.display = 'block';
        if (videoWrapper) videoWrapper.style.display = 'none';
        if (thumbs) thumbs.style.display = 'flex';
    } else {
        imageWrapper.style.display = 'none';
        if (videoWrapper) videoWrapper.style.display = 'block';
        if (thumbs) thumbs.style.display = 'none';
        const video = document.getElementById('productVideo');
        if (video) video.play();
    }
}

function changeMainImage(src, thumbEl) {
    const mainImg = document.getElementById('mainProductImage');
    if (mainImg) {
        mainImg.style.opacity = '0';
        setTimeout(() => {
            mainImg.src = src;
            mainImg.style.opacity = '1';
        }, 150);
    }
    
    const thumbs = thumbEl.parentElement.querySelectorAll('.thumb-item');
    thumbs.forEach(t => t.classList.remove('active'));
    thumbEl.classList.add('active');
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    const video = document.getElementById('productVideo');
    if (video) video.pause();
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProductModal();
    }
});

function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initHeaderScroll() {
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initPageContent();
    trackVisit();
    renderProducts();
    smoothScroll();
    initHeaderScroll();
});