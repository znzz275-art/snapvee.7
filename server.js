const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ده نفس المحرك اللي بتستخدمه تطبيقات التحميل المشهورة
app.post('/api/download', async (req, res) => {
    try {
        let { url } = req.body;
        if (!url) return res.status(400).json({ error: "فين الرابط؟" });

        // تنظيف الرابط آلياً من أي حروف غريبة
        const cleanUrl = url.trim().replace(/^['"/]+/, '');

        // استخدام محرك معالجة احترافي (API) لتجاوز حماية المنصات
        const response = await axios.get(https://api.vkrdown.com/api/item.php?url=${encodeURIComponent(cleanUrl)});

        if (response.data && response.data.data && response.data.data.url) {
            // بنجيب أعلى جودة متاحة للفيديو
            const videoData = response.data.data.url[0];
            res.json({ url: videoData.url, title: response.data.data.title });
        } else {
            res.status(400).json({ error: "الموقع ده محمي أو الرابط غلط" });
        }
    } catch (error) {
        res.status(500).json({ error: "السيرفر العالمي عليه ضغط، جرب كمان دقيقة" });
    }
});

module.exports = app;