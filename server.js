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

    url = url.trim();

    try {
        console.log("🚀 محاولة السحب عبر المحرك الاحترافي الجديد...");
        
        // ده API محرك تاني خالص بيستخدمه مواقع التحميل الكبيرة
        const response = await axios({
            method: 'GET',
            url: https://api.vkrdown.com/api/item.php?url=${encodeURIComponent(url)},
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        // هنا بنشوف النتيجة اللي راجعة من المحرك
        if (response.data && response.data.data && response.data.data.url) {
            console.log("✅ نجحنا أخيراً!");
            res.json({ url: response.data.data.url[0].url }); // بياخد أول رابط متاح
        } else {
            res.status(400).json({ error: "المحرك لم يجد فيديو، جرب رابط آخر" });
        }
    } catch (e) {
        console.log("❌ خطأ: " + e.message);
        res.status(500).json({ error: "السيرفر مشغول، حاول لاحقاً" });
    }
});

module.exports = app;