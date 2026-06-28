const companyInfo = {
    name: "惜物工坊",
    slogan: "匠心传承 · 物尽其用",
    description: "专注于传统手工艺与现代设计的完美融合",
    founded: 2018,
    address: "中国·某某市某某区惜物路88号",
    phone: "400-888-8888",
    email: "hello@xiwugongfang.com",
    wechat: "xiwugongfang2018"
};

const products = [
    {
        id: 1,
        name: "手工陶瓷茶杯",
        category: "陶瓷系列",
        priceMin: 198,
        priceMax: 398,
        hasVideo: false,
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=handmade%20ceramic%20tea%20cup%20traditional%20chinese%20style%20elegant&image_size=square_hd",
        images: [
            "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=handmade%20ceramic%20tea%20cup%20traditional%20chinese%20style%20elegant&image_size=square_hd",
            "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=ceramic%20tea%20cup%20detail%20shot%20glaze%20texture%20closeup&image_size=square_hd"
        ],
        videoUrl: "",
        description: "采用传统手拉坯工艺，经1280度高温烧制而成。每一件都是独一无二的艺术品，手感温润，品茗佳品。",
        features: ["手工拉坯", "原矿釉料", "独一无二"],
        specs: ["容量：200ml", "材质：高岭土", "工艺：手工拉坯"]
    },
    {
        id: 2,
        name: "竹编收纳篮",
        category: "竹编系列",
        priceMin: 128,
        priceMax: 268,
        hasVideo: false,
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=handwoven%20bamboo%20storage%20basket%20traditional%20craft%20natural&image_size=square_hd",
        images: [
            "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=handwoven%20bamboo%20storage%20basket%20traditional%20craft%20natural&image_size=square_hd"
        ],
        videoUrl: "",
        description: "精选安吉高山毛竹，由老艺人手工编织。纹理细腻，结实耐用，兼具实用性与装饰性。",
        features: ["天然竹材", "手工编织", "环保实用"],
        specs: ["尺寸：30x20x15cm", "材质：安吉毛竹", "工艺：手工编织"]
    },
    {
        id: 3,
        name: "檀木书签套装",
        category: "木艺系列",
        priceMin: 88,
        priceMax: 258,
        hasVideo: false,
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sandalwood%20bookmark%20set%20chinese%20traditional%20carved%20wood&image_size=square_hd",
        images: [
            "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sandalwood%20bookmark%20set%20chinese%20traditional%20carved%20wood&image_size=square_hd"
        ],
        videoUrl: "",
        description: "选用名贵小叶紫檀，纯手工雕刻打磨。木纹细腻，香气淡雅，是文人雅士的收藏佳品。",
        features: ["名贵檀木", "手工雕刻", "收藏级"],
        specs: ["材质：小叶紫檀", "工艺：手工雕刻", "套装：2支装"]
    },
    {
        id: 4,
        name: "苏绣手帕",
        category: "刺绣系列",
        priceMin: 288,
        priceMax: 588,
        hasVideo: true,
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=suzhou%20embroidery%20handkerchief%20silk%20floral%20pattern%20traditional%20chinese&image_size=square_hd",
        images: [
            "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=suzhou%20embroidery%20handkerchief%20silk%20floral%20pattern%20traditional%20chinese&image_size=square_hd"
        ],
        videoUrl: "",
        description: "非遗苏绣工艺，绣娘手工一针一线绣制。图案精美，丝线光泽细腻，是馈赠佳品。",
        features: ["非遗工艺", "手工刺绣", "真丝面料"],
        specs: ["尺寸：30x30cm", "材质：桑蚕丝", "工艺：手工苏绣"]
    },
    {
        id: 5,
        name: "青瓷花瓶",
        category: "陶瓷系列",
        priceMin: 388,
        priceMax: 888,
        hasVideo: true,
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=celadon%20porcelain%20vase%20chinese%20traditional%20elegant%20green%20glaze&image_size=square_hd",
        images: [
            "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=celadon%20porcelain%20vase%20chinese%20traditional%20elegant%20green%20glaze&image_size=square_hd"
        ],
        videoUrl: "",
        description: "龙泉青瓷传统烧制技艺，粉青釉色温润如玉。器型典雅，是家居装饰的点睛之笔。",
        features: ["龙泉青瓷", "粉青釉色", "经典器型"],
        specs: ["高度：25cm", "材质：龙泉青瓷", "工艺：1300度烧制"]
    },
    {
        id: 6,
        name: "棉麻布艺抱枕",
        category: "布艺系列",
        priceMin: 68,
        priceMax: 158,
        hasVideo: false,
        image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cotton%20linen%20throw%20pillow%20natural%20fabric%20minimalist%20cozy&image_size=square_hd",
        images: [
            "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cotton%20linen%20throw%20pillow%20natural%20fabric%20minimalist%20cozy&image_size=square_hd"
        ],
        videoUrl: "",
        description: "天然棉麻面料，植物染色，手工缝制。亲肤透气，为家居增添自然温馨的氛围。",
        features: ["天然棉麻", "植物染色", "手工缝制"],
        specs: ["尺寸：45x45cm", "材质：棉麻混纺", "工艺：手工缝制"]
    }
];

const adminConfig = {
    password: "admin123",
    visitRecordStorageKey: "xiwu_visit_records"
};