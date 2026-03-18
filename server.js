const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/download', async (req, res) => {
    let { url } = req.body;
    if (!url) return res.status(400).json({ error: "الرابط مطلوب" });

    try {
        console.log("🚀 محاولة السحب عبر المحرك البديل...");
        
        // استخدام محرك معالجة مختلف لتجنب خطأ 403
        const response = await axios({
            method: 'post',
            url: 'https://worker.jaced.com/api/json', // سيرفر معالجة بديل
            data: { url: url, vQuality: '720' },
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (response.data && response.data.url) {
            res.json({ url: response.data.url });
        } else {
            // محاولة أخيرة لو المحرك الأول فشل
            res.status(400).json({ error: "المحرك الحالي لا يستجيب، جرب بعد دقيقة" });
        }
    } catch (e) {
        console.log("❌ خطأ السيرفر: " + (e.response ? e.response.status : e.message));
        res.status(500).json({ error: "عذراً، الرابط محمي أو السيرفر مشغول" });
    }
});

module.exports = app;