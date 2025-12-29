const express = require('express');
const ccxt = require('ccxt');
const cors = require('cors');
require('dotenv').config(); 

const app = express();
app.use(cors());

// --- DİKKAT: .env dosyasından okuyamazsa diye kontrol ---
const apiKey = process.env.BYBIT_API_KEY; 
const secret = process.env.BYBIT_SECRET;

// Eğer terminalde bu satırda "undefined" görüyorsan .env dosyası okunmuyor demektir.
console.log("API Key Kontrol (İlk 3 hane):", apiKey ? apiKey.substring(0, 3) : "YOK!");

const exchange = new ccxt.bybit({
    apiKey: apiKey, 
    secret: secret, 
    options: { 
        'defaultType': 'linear',
        'recvWindow': 10000, // ZAMANLAMA HATASINI ÇÖZER: 10 saniyelik esneklik
        'adjustForTimeDifference': true // Bilgisayar saati ile sunucu saatini eşle
    } 
});

// 1. Bakiye
app.get('/api/balance', async (req, res) => {
    try {
        console.log("--- Bakiye İsteği ---");
        const balance = await exchange.fetchBalance();
        const usdt = balance['USDT'] ? balance['USDT'].total : 0;
        console.log(`Bakiye Başarılı: ${usdt} USDT`); // Başarılı olursa bunu görürüz
        res.json({ total: usdt });
    } catch (error) {
        console.error("Bybit Hatası:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// 2. Pozisyonlar
app.get('/api/positions', async (req, res) => {
    try {
        const positions = await exchange.fetchPositions();
        // Hata ayıklama için kaç tane ham veri geldiğini görelim
        // console.log("Ham Pozisyon Sayısı:", positions.length); 
        
        const activePositions = positions.filter(pos => parseFloat(pos.contracts) > 0);
        res.json(activePositions);
    } catch (error) {
        console.error("Pozisyon Hatası:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// 3. Emirler
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await exchange.fetchOpenOrders();
        res.json(orders);
    } catch (error) {
        console.error("Emir Hatası:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// 4. USDT/TRY Kuru
app.get('/api/rate', async (req, res) => {
    try {
        // Bybit üzerinde USDT/TRY paritesini kontrol ediyoruz
        const ticker = await exchange.fetchTicker('USDT/TRY');
        res.json({ rate: ticker.last });
    } catch (error) {
        console.error("Kur Hatası:", error.message);
        // Eğer Bybit'te yoksa veya hata olursa manuel bir değer veya hata dönebiliriz
        // Fallback olarak 35 gibi bir değer dönmek yerine null dönüp frontend'de yönetelim
        res.status(500).json({ error: "Kur bilgisi alınamadı", rate: null });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda hazır.`);
});