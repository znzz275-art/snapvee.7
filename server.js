const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(express.json());

// تشغيل الصفحة الرئيسية
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// المحرك اللي هيسحب الفيديو (تعديل للعمل على Vercel)
app.post('/api/download', async (req, res) => {
    try {
        let { url } = req.body;
        if (!url) return res.status(400).json({ error: "الرابط مطلوب" });

        // تنظيف الرابط
        const cleanUrl = url.trim().replace(/^['"/]+/, '');

        // محرك سحب الفيديو الجديد
        const response = await axios.get(https://api.vkrdown.com/api/item.php?url=${encodeURIComponent(cleanUrl)});

        if (response.data && response.data.data && response.data.data.url) {
            res.json({ url: response.data.data.url[0].url });
        } else {
            res.status(400).json({ error: "لم يتم العثور على فيديو" });
        }
    } catch (error) {
        res.status(500).json({ error: "مشكلة في السيرفر، حاول مجدداً" });
    }
});

// السطر ده هو اللي بيخلي Vercel يفهم الكود
module.exports = app;