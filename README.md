# Heroes of Turkey - Köy Düzeni

World of Warcraft: The War Within için interaktif köy haritası uygulaması. Guild üyelerinin Razorwind Shores housing bölgesindeki plot konumlarını görselleştirir.

## Özellikler

- **Interaktif Harita**: Zoom in/out ve sürükleme desteği (masaüstü ve mobil)
- **Oyuncu Listesi**: Arama ve filtreleme özellikleri
- **Çift Yönlü Vurgulama**: Haritadaki noktaya veya listedeki oyuncuya hover yapıldığında karşılıklı vurgulama
- **Armory Bağlantısı**: Oyuncu isimlerine tıklayarak WoW Armory sayfasına erişim
- **Google Sheets Entegrasyonu**: Oyuncu verileri Google Sheets'ten otomatik çekilir
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu

## Kurulum

1. Dosyaları bir web sunucusuna yükleyin
2. `app.js` dosyasında Google Sheets ayarlarını yapın:

```javascript
const SHEET_ID = 'your-google-sheet-id';
const SHEET_NAME = 'Sheet1';
```

3. Google Sheets'i "Web'de yayınla" seçeneği ile paylaşın

## Google Sheets Formatı

| Slot Number | Member Name |
|-------------|-------------|
| 0           | Oyuncu1     |
| 1           | Oyuncu2     |
| 2           |             |
| ...         | ...         |

- **Slot Number**: Plot numarası (0-54)
- **Member Name**: Oyuncu adı (boş bırakılabilir)

## Kullanım

- **Zoom**: Mouse tekerleği veya +/- butonları (mobilde pinch-to-zoom)
- **Sürükleme**: Sol tık basılı tutup sürükle (mobilde parmakla sürükle)
- **Arama**: Oyuncu adı veya slot numarası ile arama
- **Filtre**: Boş/Dolu slotları göster/gizle

## Dosya Yapısı

```
├── index.html      # Ana HTML dosyası
├── styles.css      # Stil dosyası
├── app.js          # JavaScript uygulaması
├── wow_logo.svg    # WoW logosu
└── README.md       # Bu dosya
```

## Koordinat Sistemi

Plot koordinatları 1024x681 piksel harita boyutuna göre ayarlanmıştır. Koordinatlar WoWDB haritasından alınıp dönüştürülmüştür.

## Geliştirici

[kladenets-codes](https://github.com/kladenets-codes)

## Lisans

MIT
