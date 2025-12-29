import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [balance, setBalance] = useState(0);
  const [positions, setPositions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [currency, setCurrency] = useState('USD'); // 'USD' veya 'TRY'
  const [tryRate, setTryRate] = useState(0);
  const [language, setLanguage] = useState('tr'); // 'tr' veya 'en'

  const translations = {
    tr: {
      title: "Bybit Trader Paneli",
      totalAssets: "TOPLAM VARLIK",
      openPositions: "Açık Pozisyonlar",
      noPositions: "Açık pozisyon bulunmuyor.",
      symbol: "Sembol",
      side: "Yön",
      sizeVal: "Büyüklük (Değer)",
      entryPrice: "Giriş Fiyatı",
      markPrice: "Mark Fiyat",
      liq: "Liq",
      pnl: "PNL (Kâr/Zarar)",
      totalPosSize: "Toplam İşlem Boyutu",
      totalPnl: "Toplam PNL",
      openOrders: "Bekleyen Emirler",
      noOrders: "Bekleyen emir yok.",
      orderSymbolType: "SEMBOL / TÜR",
      orderSide: "YÖN",
      orderPrice: "FİYAT",
      orderQtyVal: "MİKTAR (DEĞER)",
      market: "Piyasa (Market)",
      trigger: "Tetik",
      refresh: "Verileri Güncelle",
      long: "Long",
      short: "Short",
      total: "Toplam"
    },
    en: {
      title: "Bybit Trader Panel",
      totalAssets: "TOTAL ASSETS",
      openPositions: "Open Positions",
      noPositions: "No open positions.",
      symbol: "Symbol",
      side: "Side",
      sizeVal: "Size (Value)",
      entryPrice: "Entry Price",
      markPrice: "Mark Price",
      liq: "Liq",
      pnl: "PNL (Profit/Loss)",
      totalPosSize: "Total Position Size",
      totalPnl: "Total PNL",
      openOrders: "Open Orders",
      noOrders: "No open orders.",
      orderSymbolType: "SYMBOL / TYPE",
      orderSide: "SIDE",
      orderPrice: "PRICE",
      orderQtyVal: "QTY (VALUE)",
      market: "Market",
      trigger: "Trigger",
      refresh: "Refresh Data",
      long: "Long",
      short: "Short",
      total: "Total"
    }
  };

  const t = translations[language];

  useEffect(() => {
    fetchData();
    // Otomatik yenileme istersen burayı açabilirsin (5 saniye)
    // const interval = setInterval(fetchData, 5000); return () => clearInterval(interval);
  }, []);

  // API Adresini belirle (Canlıda çevre değişkeninden al, lokalde localhost kullan)
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const fetchData = async () => {
    try {
      // 0. Kuru Çek
      const rateRes = await fetch(`${API_URL}/api/rate`);
      const rateData = await rateRes.json();
      if (rateData.rate) {
          setTryRate(parseFloat(rateData.rate));
      }

      const balRes = await fetch(`${API_URL}/api/balance`);
      const balData = await balRes.json();
      setBalance(balData.total || 0);

      const posRes = await fetch(`${API_URL}/api/positions`);
      const posData = await posRes.json();
      if (Array.isArray(posData)) {
        setPositions(posData);
      } else {
        setPositions([]);
      }

      const ordRes = await fetch(`${API_URL}/api/orders`);
      const ordData = await ordRes.json();
      if (Array.isArray(ordData)) {
         setOrders(ordData);
      }
      else setOrders([]);

    } catch (error) {
      console.error("Veri hatası:", error);
    }
  };

  // Para formatı (Binlik ayracı ve ondalık)
  const formatMoney = (amountUSD) => {
    if (currency === 'TRY' && tryRate > 0) {
        const val = amountUSD * tryRate;
        return val.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₺';
    }
    return amountUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' $';
  };

  // Fiyat formatı (Daha hassas)
  const convertPrice = (priceUSD) => {
      if (!priceUSD) return '-';
      const p = parseFloat(priceUSD);
      if (currency === 'TRY' && tryRate > 0) {
          return (p * tryRate).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
      }
      return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  };

  return (
    <div className="App">
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 10px'}}>
        <h1>{t.title}</h1>
        <div style={{display: 'flex', alignItems: 'center'}}>
            <div className="currency-toggle" style={{marginRight: '15px'}}>
                <button 
                    onClick={() => setCurrency('USD')} 
                    style={{
                        backgroundColor: currency === 'USD' ? '#f0b90b' : '#333',
                        color: currency === 'USD' ? '#000' : '#fff',
                        border: '1px solid #555',
                        padding: '5px 15px',
                        cursor: 'pointer',
                        marginRight: '5px',
                        borderRadius: '4px',
                        fontWeight: 'bold'
                    }}
                >
                    $
                </button>
                <button 
                    onClick={() => setCurrency('TRY')} 
                    style={{
                        backgroundColor: currency === 'TRY' ? '#f0b90b' : '#333',
                        color: currency === 'TRY' ? '#000' : '#fff',
                        border: '1px solid #555',
                        padding: '5px 15px',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        fontWeight: 'bold'
                    }}
                >
                    ₺
                </button>
            </div>
            <div className="language-toggle">
                <button 
                    onClick={() => setLanguage('tr')} 
                    style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1.5rem',
                        opacity: language === 'tr' ? 1 : 0.5,
                        marginRight: '5px'
                    }}
                    title="Türkçe"
                >
                    🇹🇷
                </button>
                <button 
                    onClick={() => setLanguage('en')} 
                    style={{
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1.5rem',
                        opacity: language === 'en' ? 1 : 0.5
                    }}
                    title="English"
                >
                    🇬🇧
                </button>
            </div>
        </div>
      </div>
      
      {/* 1. BAKİYE KARTI */}
      <div className="card balance-card">
        <div className="balance-label">{t.totalAssets} ({currency})</div>
        <div className="balance-amount">
          {balance ? formatMoney(balance) : formatMoney(0)}
        </div>
      </div>

      {/* 2. POZİSYONLAR TABLOSU */}
      <div className="card">
        <h2>{t.openPositions}</h2>
        {positions.length === 0 ? <p style={{color: '#555', textAlign: 'center'}}>{t.noPositions}</p> : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>{t.symbol}</th>
                  <th>{t.side}</th>
                  <th>{t.sizeVal}</th> {/* Başlığı güncelledik */}
                  <th>{t.entryPrice}</th>
                  <th>{t.markPrice}</th>
                      <th>{t.liq}</th>
                  <th style={{textAlign: 'right'}}>{t.pnl}</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((pos, index) => {
                   const pnl = parseFloat(pos.unrealizedPnl);
                   const isProfit = pnl >= 0;
                   
                   // Yön Kontrolü
                   const sideRaw = (pos.side || '').toString().toLowerCase().trim();
                   const isLong = sideRaw === 'buy' || sideRaw === 'long';

                   // --- YENİ HESAPLAMA: BÜYÜKLÜK ---
                   const coinName = pos.symbol.split('/')[0]; // "SOL/USDT" -> "SOL"
                   const quantity = parseFloat(pos.contracts);
                   const markPrice = parseFloat(pos.markPrice);
                   // Likidasyon fiyatı farklı alanlarda gelebilir; birkaç olası anahtar kontrol ediliyor
                   const liqRaw = pos.liquidationPrice ?? pos.liquidation_price ?? pos.liquidation ?? pos.liqPrice ?? null;
                   const liqPrice = liqRaw ? parseFloat(liqRaw) : null;
                   const totalValue = quantity * markPrice; // Toplam Dolar Karşılığı

                   return (
                    <tr key={index}>
                      <td style={{fontWeight: 'bold'}}>{coinName}</td>
                      <td>
                        <span className={isLong ? 'badge badge-long' : 'badge badge-short'}>
                          {isLong ? 'LONG' : 'SHORT'}
                        </span>
                      </td>
                      
                      {/* Büyüklük Sütunu: "125 SOL (25,000 $)" formatı */}
                      <td style={{fontWeight: '500'}}>
                        <span style={{color: '#fff'}}>{quantity} {coinName}</span>
                        <br/>
                        <span style={{color: '#848e9c', fontSize: '0.8rem'}}>
                          ({formatMoney(totalValue)})
                        </span>
                      </td>

                      <td>{convertPrice(pos.entryPrice)}</td>
                      <td>{convertPrice(markPrice)}</td>
                      <td>{liqPrice ? convertPrice(liqPrice) : '-'}</td>
                      <td style={{textAlign: 'right'}} className={isProfit ? 'text-green' : 'text-red'}>
                        {pnl > 0 ? '+' : ''}{formatMoney(pnl)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div style={{marginTop: '15px', borderTop: '1px solid #444', paddingTop: '10px', fontSize: '0.9rem'}}>
             {(() => {
                 let longSize = 0;
                 let shortSize = 0;
                 let longPnl = 0;
                 let shortPnl = 0;

                 positions.forEach(pos => {
                     const size = parseFloat(pos.contracts) * parseFloat(pos.markPrice);
                     const pnl = parseFloat(pos.unrealizedPnl);
                     const sideRaw = (pos.side || '').toString().toLowerCase().trim();
                     const isLong = sideRaw === 'buy' || sideRaw === 'long';

                     if (isLong) {
                         longSize += size;
                         longPnl += pnl;
                     } else {
                         shortSize += size;
                         shortPnl += pnl;
                     }
                 });
                 
                 const totalSize = longSize + shortSize;
                 const totalPnl = longPnl + shortPnl;

                 return (
                     <div style={{maxWidth: '400px', marginLeft: 'auto'}}>
                        {/* Long Satırı */}
                        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'4px'}}>
                            <span style={{color:'#aaa'}}>{t.long}:</span>
                            <div>
                                <span className="text-green" style={{marginRight:'10px'}}>{formatMoney(longSize)}</span>
                                <span className={longPnl >= 0 ? 'text-green' : 'text-red'} style={{fontSize:'0.85rem'}}>
                                    (PNL: {longPnl > 0 ? '+' : ''}{formatMoney(longPnl)})
                                </span>
                            </div>
                        </div>
                        {/* Short Satırı */}
                        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'4px'}}>
                            <span style={{color:'#aaa'}}>{t.short}:</span>
                            <div>
                                <span className="text-red" style={{marginRight:'10px'}}>{formatMoney(shortSize)}</span>
                                <span className={shortPnl >= 0 ? 'text-green' : 'text-red'} style={{fontSize:'0.85rem'}}>
                                    (PNL: {shortPnl > 0 ? '+' : ''}{formatMoney(shortPnl)})
                                </span>
                            </div>
                        </div>
                        {/* Toplam Satırı */}
                        <div style={{display:'flex', justifyContent:'space-between', borderTop:'1px dashed #444', paddingTop:'4px', marginTop:'4px'}}>
                            <span style={{color:'#fff', fontWeight:'bold'}}>{t.total}:</span>
                            <div>
                                <span style={{color:'#fff', fontWeight:'bold', marginRight:'10px'}}>{formatMoney(totalSize)}</span>
                                <span className={totalPnl >= 0 ? 'text-green' : 'text-red'} style={{fontWeight:'bold', fontSize:'0.85rem'}}>
                                    (PNL: {totalPnl > 0 ? '+' : ''}{formatMoney(totalPnl)})
                                </span>
                            </div>
                        </div>
                     </div>
                 )
             })()}
            </div>
          </div>
        )}
      </div>

      {/* 3. EMİRLER LİSTESİ */}
      <div className="card">
        <h2>{t.openOrders}</h2>
        {orders.length === 0 ? <p style={{color: '#555', textAlign: 'center'}}>{t.noOrders}</p> : (
          <>
          <ul className="order-list">
            <li className="order-item" style={{borderBottom: '1px solid #444', color: '#666', fontSize:'0.75rem', paddingBottom:'5px'}}>
               <span>{t.orderSymbolType}</span>
               <span>{t.orderSide}</span>
               <span>{t.orderPrice}</span>
               <span style={{textAlign:'right'}}>{t.orderQtyVal}</span>
            </li>

            {orders.map((order) => {
               const orderSide = (order.side || '').toString().toLowerCase().trim();
               const isBuy = orderSide === 'buy' || orderSide === 'long';

               // Fiyat Kontrolü
               let priceDisplay;
               let orderVal = 0;
               const price = parseFloat(order.price);
               const amount = parseFloat(order.amount);

               if (price > 0) {
                   priceDisplay = convertPrice(price) + (currency === 'TRY' ? ' ₺' : ' $');
                   orderVal = price * amount; // Limit emir ise değeri hesapla
               } else if (order.triggerPrice && parseFloat(order.triggerPrice) > 0) {
                   priceDisplay = convertPrice(order.triggerPrice) + (currency === 'TRY' ? ' ₺' : ' $') + ` (${t.trigger})`;
               } else {
                   priceDisplay = t.market;
               }
               
               // Coin ismini çek (SOL/USDT -> SOL)
               const coinName = order.symbol.split('/')[0];

               return (
                <li key={order.id} className="order-item">
                  <div>
                    <span className="order-symbol">{order.symbol}</span>
                    <span className="order-limit" style={{textTransform: 'capitalize'}}>
                      {order.type || 'Limit'}
                    </span>
                  </div>

                  <div className={`order-side ${isBuy ? 'text-green' : 'text-red'}`}>
                    {isBuy ? 'BUY' : 'SELL'}
                  </div>

                  <div className="order-price">
                    {priceDisplay}
                  </div>

                  {/* Miktar Sütunu: Değer varsa parantez içinde göster */}
                  <div className="order-amount">
                    <span style={{color:'#e0e0e0'}}>{amount} {coinName}</span>
                    {orderVal > 0 && (
                        <span style={{display:'block', fontSize:'0.75rem', color:'#848e9c'}}>
                            ({formatMoney(orderVal)})
                        </span>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
          <div style={{marginTop: '15px', borderTop: '1px solid #444', paddingTop: '10px', fontSize: '0.9rem'}}>
             {(() => {
                 let longTotal = 0;
                 let shortTotal = 0;
                 orders.forEach(o => {
                     const p = parseFloat(o.price);
                     const a = parseFloat(o.amount);
                     // Sadece fiyatı belli olan (Limit) emirleri topla, tetik emirleri (price=0 veya triggerPrice olanlar) hariç
                     if (p > 0) { 
                         const val = p * a;
                         const s = (o.side || '').toLowerCase();
                         if (s === 'buy' || s === 'long') longTotal += val;
                         else shortTotal += val;
                     }
                 });
                 
                 return (
                     <div style={{maxWidth: '300px', marginLeft: 'auto'}}>
                        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'4px'}}>
                            <span style={{color:'#aaa'}}>{t.long}:</span>
                            <span className="text-green">{formatMoney(longTotal)}</span>
                        </div>
                        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'4px'}}>
                            <span style={{color:'#aaa'}}>{t.short}:</span>
                            <span className="text-red">{formatMoney(shortTotal)}</span>
                        </div>
                        <div style={{display:'flex', justifyContent:'space-between', borderTop:'1px dashed #444', paddingTop:'4px', marginTop:'4px'}}>
                            <span style={{color:'#fff', fontWeight:'bold'}}>{t.total}:</span>
                            <span style={{color:'#fff', fontWeight:'bold'}}>{formatMoney(longTotal + shortTotal)}</span>
                        </div>
                     </div>
                 )
             })()}
          </div>
          </>
        )}
      </div>
      
      <button onClick={fetchData} className="refresh-btn">
        {t.refresh}
      </button>
    </div>
  );
}

export default App;