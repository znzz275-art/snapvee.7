const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(express.json());

// تشغيل الصفحة الرئيسية
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// محرك التحميل العالمي
app.post('/api/download', async (req, res) => {
    let { url } = req.body;
    if (!url) return res.status(400).json({ error: "الرابط مطلوب" });

    url = url.trim().replace(/^[^h]+/, ''); 

    try {
        const response = await axios.post('https://api.cobalt.tools/api/json', {
            url: url,
            videoQuality: '720'
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (response.data && response.data.url) {
            res.json({ url: response.data.url });
        } else {
            res.status(400).json({ error: "فشل استخراج الفيديو" });
        }
    } catch (e) {
        res.status(500).json({ error: "السيرفر مضغوط، حاول مجدداً" });
    }
});

// التعديل المهم لـ Vercel
module.exports = app;