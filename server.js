const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(express.json());

// تشغيل الموقع من الفولدر
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// المحرك الاحترافي لتجاوز حظر يوتيوب وتيك توك
app.post('/api/download', async (req, res) => {
    let { url } = req.body;
    if (!url) return res.status(400).json({ error: "الرابط مطلوب" });

    try {
        // تنظيف الرابط آلياً من أي علامات إضافية (مثل الشرطة المائلة /)
        const cleanUrl = url.trim().replace(/^[^h]+/, '');
        console.log("🚀 محاولة سحب الفيديو من: " + cleanUrl);

        const response = await axios.post('https://api.cobalt.tools/api/json', {
            url: cleanUrl,
            videoQuality: '720'
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                // إيهام الموقع بأننا متصفح حقيقي لتجنب الرفض
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (response.data && response.data.url) {
            console.log("✅ نجحنا في استخراج الفيديو!");
            res.json({ url: response.data.url });
        } else {
            res.status(400).json({ error: "المحرك لم يجد فيديو، جرب رابط آخر" });
        }
    } catch (e) {
        console.log("❌ خطأ من المصدر: " + (e.response ? e.response.status : e.message));
        res.status(500).json({ error: "السيرفر الخارجي لا يستجيب حالياً" });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log("===============================");
    console.log("🔥 SnapVee is ONLINE & READY!");
    console.log("🔗 http://localhost:3000");
    console.log("===============================");
});