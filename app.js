// =====================================================
// CONFIGURATION - Google Sheets Ayarları
// =====================================================
const SHEET_ID = '1t8VZOpwYjYZcxUqtGvpw7g8sYvybISByBcpf8f4bYX4';
const SHEET_NAME = 'Sheet1'; // Sayfa adı

// =====================================================
// COLUMN MAPPING - Sütun Eşleştirmesi
// Google Sheets'teki sütun isimlerini buraya yazın
// =====================================================
const COLUMNS = {
    SPOT_NUMBER: 'Slot Number',    // Sıra numarası sütunu
    PLAYER_NAME: 'Member Name',    // Oyuncu adı sütunu
};

// =====================================================
// KOORDINATLAR - Her sıra numarasının haritadaki konumu
// Format: sıraNo: { x: pikselX, y: pikselY }
// Koordinatlar WoWDB haritasından alınmıştır (orijinal: ~800x600 viewport)
// =====================================================
const SPOT_COORDINATES = {
    0: { x: 489, y: 427 },
    1: { x: 685, y: 489 },
    2: { x: 505, y: 350 },
    3: { x: 651, y: 489 },
    4: { x: 654, y: 393 },
    5: { x: 671, y: 495 },
    6: { x: 621, y: 507 },
    7: { x: 657, y: 514 },
    8: { x: 705, y: 420 },
    9: { x: 493, y: 381 },
    10: { x: 646, y: 432 },
    11: { x: 519, y: 453 },
    12: { x: 546, y: 520 },
    13: { x: 692, y: 475 },
    14: { x: 704, y: 438 },
    15: { x: 712, y: 328 },
    16: { x: 627, y: 400 },
    17: { x: 521, y: 472 },
    18: { x: 503, y: 393 },
    19: { x: 633, y: 539 },
    20: { x: 684, y: 361 },
    21: { x: 647, y: 378 },
    22: { x: 589, y: 519 },
    23: { x: 708, y: 346 },
    24: { x: 543, y: 558 },
    25: { x: 542, y: 356 },
    26: { x: 500, y: 457 },
    27: { x: 564, y: 439 },
    28: { x: 509, y: 380 },
    29: { x: 607, y: 445 },
    30: { x: 562, y: 469 },
    31: { x: 658, y: 328 },
    32: { x: 576, y: 502 },
    33: { x: 528, y: 443 },
    34: { x: 632, y: 421 },
    35: { x: 742, y: 366 },
    36: { x: 547, y: 369 },
    37: { x: 611, y: 549 },
    38: { x: 729, y: 354 },
    39: { x: 731, y: 311 },
    40: { x: 603, y: 463 },
    41: { x: 553, y: 419 },
    42: { x: 728, y: 374 },
    43: { x: 536, y: 508 },
    44: { x: 677, y: 349 },
    45: { x: 659, y: 356 },
    46: { x: 690, y: 306 },
    47: { x: 609, y: 414 },
    48: { x: 620, y: 434 },
    49: { x: 604, y: 533 },
    50: { x: 544, y: 457 },
    51: { x: 639, y: 509 },
    52: { x: 706, y: 385 },
    53: { x: 691, y: 389 },
    54: { x: 524, y: 496 },
};

// WoWDB Leaflet viewport boyutları (koordinatların alındığı kaynak)
const SOURCE_MAP_WIDTH = 800;
const SOURCE_MAP_HEIGHT = 600;

// Offset ayarları (koordinatları kaydırmak için)
const X_OFFSET = -11;
const Y_OFFSET = -3;

// Scale faktörü (1.0 = normal, 1.05 = %5 zoom-in)
let SCALE = 1.05;

// =====================================================
// DOM Elements
// =====================================================
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const contentEl = document.getElementById('content');
const mapImage = document.getElementById('mapImage');
const markersContainer = document.getElementById('markersContainer');
const playerList = document.getElementById('playerList');
const searchInput = document.getElementById('searchInput');
const toggleEmptyBtn = document.getElementById('toggleEmpty');
const toggleFilledBtn = document.getElementById('toggleFilled');
const tooltip = document.getElementById('tooltip');
const totalSpotsEl = document.getElementById('totalSpots');
const resizer = document.getElementById('resizer');
const listSection = document.getElementById('listSection');

// =====================================================
// Global State
// =====================================================
let allData = [];
let markers = {};
let playerItems = {};

// =====================================================
// Google Sheets Data Fetching
// =====================================================
function getSheetURL() {
    return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`;
}

async function fetchData() {
    try {
        const response = await fetch(getSheetURL());
        const text = await response.text();

        // Parse Google Visualization API response
        const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?/);
        if (!jsonMatch || !jsonMatch[1]) {
            throw new Error('Geçersiz veri formatı');
        }

        const data = JSON.parse(jsonMatch[1]);
        if (data.status === 'error') {
            throw new Error(data.errors[0].message);
        }

        return parseGoogleData(data);
    } catch (error) {
        console.error('Veri çekme hatası:', error);
        throw error;
    }
}

function parseGoogleData(data) {
    const table = data.table;
    const headers = table.cols.map((col, index) => {
        // İlk sütun için her zaman 'Slot Number' kullan
        if (index === 0) return 'Slot Number';
        // İkinci sütun için her zaman 'Member Name' kullan
        if (index === 1) return 'Member Name';
        // Diğerleri için label veya id kullan
        return col.label || col.id || `Column${index}`;
    });

    const rows = table.rows.map(row => {
        const rowData = {};
        row.c.forEach((cell, index) => {
            const header = headers[index];
            rowData[header] = cell ? (cell.v !== null ? cell.v : '') : '';
        });
        return rowData;
    });

    return rows;
}

// =====================================================
// Map Markers
// =====================================================
function createMarkers() {
    markersContainer.innerHTML = '';
    markers = {};

    allData.forEach(spot => {
        const spotNumber = spot[COLUMNS.SPOT_NUMBER];
        const playerName = spot[COLUMNS.PLAYER_NAME];

        // Koordinatları SPOT_COORDINATES'dan al
        const coords = SPOT_COORDINATES[spotNumber];
        if (!coords) return;

        // Koordinatları kaynak haritadan hedef haritaya oranla
        let xPercent = (coords.x / SOURCE_MAP_WIDTH) * 100;
        let yPercent = (coords.y / SOURCE_MAP_HEIGHT) * 100;

        // Scale uygula (merkeze doğru zoom)
        const centerX = 50 + X_OFFSET;
        const centerY = 50 + Y_OFFSET;
        xPercent = centerX + (xPercent - 50) * SCALE + X_OFFSET;
        yPercent = centerY + (yPercent - 50) * SCALE + Y_OFFSET;

        const marker = document.createElement('div');
        marker.className = 'marker' + (playerName ? '' : ' empty');
        marker.style.left = `${xPercent}%`;
        marker.style.top = `${yPercent}%`;
        marker.dataset.spot = spotNumber;

        // Marker events
        marker.addEventListener('mouseenter', (e) => {
            showTooltip(e, spot);
            highlightPlayerItem(spotNumber, true);
        });

        marker.addEventListener('mouseleave', () => {
            hideTooltip();
            highlightPlayerItem(spotNumber, false);
        });

        marker.addEventListener('click', () => {
            scrollToPlayerItem(spotNumber);
        });

        markersContainer.appendChild(marker);
        markers[spotNumber] = marker;
    });
}

function highlightMarker(spotNumber, highlight) {
    const marker = markers[spotNumber];
    if (marker) {
        if (highlight) {
            marker.classList.add('highlighted');
        } else {
            marker.classList.remove('highlighted');
        }
    }
}

// =====================================================
// Player List
// =====================================================
const ARMORY_BASE_URL = 'https://worldofwarcraft.blizzard.com/en-gb/character/eu/twisting-nether/';

function renderPlayerList(data) {
    playerList.innerHTML = '';
    playerItems = {};

    if (data.length === 0) {
        playerList.innerHTML = '<div class="no-results">Oyuncu bulunamadı</div>';
        return;
    }

    data.forEach(spot => {
        const spotNumber = spot[COLUMNS.SPOT_NUMBER];
        const playerName = spot[COLUMNS.PLAYER_NAME];
        const isEmpty = !playerName;

        const item = document.createElement('div');
        item.className = 'player-item' + (isEmpty ? ' empty' : '');
        item.dataset.spot = spotNumber;

        // Ek bilgileri topla (Slot Number ve Member Name hariç, boş olmayanlar)
        const excludeKeys = [COLUMNS.SPOT_NUMBER, COLUMNS.PLAYER_NAME, ''];
        const extraFields = Object.entries(spot)
            .filter(([key, value]) => !excludeKeys.includes(key) && value !== '' && value !== null && value !== undefined)
            .map(([key, value]) => `<span class="extra-field">${key}: ${value}</span>`)
            .join('');

        // Armory link
        const armoryLink = playerName
            ? `<a href="${ARMORY_BASE_URL}${encodeURIComponent(playerName)}" target="_blank" class="armory-link" onclick="event.stopPropagation()">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
                Armory
              </a>`
            : '';

        // Boş slot için farklı görünüm
        if (isEmpty) {
            item.innerHTML = `
                <img src="wow_logo.svg" alt="WoW" class="slot-logo">
                <span class="slot-number">${spotNumber}</span>
                <span class="empty-slot-text">Boştur.</span>
            `;
        } else {
            item.innerHTML = `
                <img src="wow_logo.svg" alt="WoW" class="slot-logo">
                <span class="slot-number">${spotNumber}</span>
                <span class="player-name-value">${playerName}</span>
                ${extraFields}
                ${armoryLink}
            `;
        }

        // Player item events
        item.addEventListener('mouseenter', () => {
            highlightMarker(spotNumber, true);
        });

        item.addEventListener('mouseleave', () => {
            highlightMarker(spotNumber, false);
        });

        item.addEventListener('click', () => {
            scrollToMarker(spotNumber);
        });

        playerList.appendChild(item);
        playerItems[spotNumber] = item;
    });
}

function highlightPlayerItem(spotNumber, highlight) {
    const item = playerItems[spotNumber];
    if (item) {
        if (highlight) {
            item.classList.add('highlighted');
        } else {
            item.classList.remove('highlighted');
        }
    }
}

function scrollToPlayerItem(spotNumber) {
    const item = playerItems[spotNumber];
    if (item) {
        item.scrollIntoView({ behavior: 'smooth', block: 'center' });
        item.classList.add('highlighted');
        setTimeout(() => item.classList.remove('highlighted'), 2000);
    }
}

function scrollToMarker(spotNumber) {
    const marker = markers[spotNumber];
    if (marker) {
        marker.scrollIntoView({ behavior: 'smooth', block: 'center' });
        marker.classList.add('highlighted');
        setTimeout(() => marker.classList.remove('highlighted'), 2000);
    }
}

// =====================================================
// Search / Filter
// =====================================================
function filterPlayers() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const showEmpty = toggleEmptyBtn.classList.contains('active');
    const showFilled = toggleFilledBtn.classList.contains('active');

    const filtered = allData.filter(spot => {
        const playerName = (spot[COLUMNS.PLAYER_NAME] || '').toLowerCase();
        const spotNumber = String(spot[COLUMNS.SPOT_NUMBER]).toLowerCase();
        const isEmpty = !spot[COLUMNS.PLAYER_NAME];

        // Boş/Dolu slot filtresi
        if (isEmpty && !showEmpty) return false;
        if (!isEmpty && !showFilled) return false;

        // Arama filtresi
        return playerName.includes(searchTerm) || spotNumber.includes(searchTerm);
    });

    renderPlayerList(filtered);
}

function toggleFilter(button) {
    button.classList.toggle('active');
    filterPlayers();
}

// =====================================================
// Resizer - Sidebar genişliği ayarlama
// =====================================================
function initResizer() {
    let isResizing = false;
    let startX, startWidth;

    resizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startWidth = listSection.offsetWidth;
        resizer.classList.add('active');
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        const diff = startX - e.clientX;
        const newWidth = Math.min(Math.max(startWidth + diff, 250), 600);
        listSection.style.width = newWidth + 'px';
    });

    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            resizer.classList.remove('active');
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
    });
}

// =====================================================
// Tooltip
// =====================================================
function showTooltip(event, spot) {
    const playerName = spot[COLUMNS.PLAYER_NAME];
    const spotNumber = spot[COLUMNS.SPOT_NUMBER];

    // Ek bilgileri topla
    const extraInfo = Object.entries(spot)
        .filter(([key]) => !Object.values(COLUMNS).includes(key) && spot[key])
        .map(([key, value]) => `<div>${key}: ${value}</div>`)
        .join('');

    tooltip.innerHTML = `
        <div class="tooltip-title">Sıra #${spotNumber}</div>
        <div class="tooltip-player">${playerName || 'Boş Slot'}</div>
        ${extraInfo ? `<div class="tooltip-info">${extraInfo}</div>` : ''}
    `;

    tooltip.classList.add('visible');
    updateTooltipPosition(event);
}

function hideTooltip() {
    tooltip.classList.remove('visible');
}

function updateTooltipPosition(event) {
    const x = event.clientX + 15;
    const y = event.clientY + 15;

    // Ekran sınırlarını kontrol et
    const rect = tooltip.getBoundingClientRect();
    const maxX = window.innerWidth - rect.width - 20;
    const maxY = window.innerHeight - rect.height - 20;

    tooltip.style.left = `${Math.min(x, maxX)}px`;
    tooltip.style.top = `${Math.min(y, maxY)}px`;
}

// =====================================================
// Statistics
// =====================================================
function updateStats() {
    const totalSpots = allData.length;
    totalSpotsEl.textContent = totalSpots;
}

// =====================================================
// Resize Handler
// =====================================================
function handleResize() {
    // Marker'ları yeniden konumlandır
    createMarkers();
}

// =====================================================
// Initialize
// =====================================================
async function init() {
    try {
        // Verileri çek
        allData = await fetchData();

        // UI'ı göster
        loadingEl.style.display = 'none';
        contentEl.style.display = 'block';

        // Resim yüklendiğinde marker'ları oluştur
        if (mapImage.complete) {
            createMarkers();
        } else {
            mapImage.onload = createMarkers;
        }

        // Oyuncu listesini oluştur
        renderPlayerList(allData);

        // İstatistikleri güncelle
        updateStats();

        // Resizer'ı başlat
        initResizer();

        // Event listeners
        searchInput.addEventListener('input', filterPlayers);
        toggleEmptyBtn.addEventListener('click', () => toggleFilter(toggleEmptyBtn));
        toggleFilledBtn.addEventListener('click', () => toggleFilter(toggleFilledBtn));
        window.addEventListener('resize', handleResize);
        document.addEventListener('mousemove', (e) => {
            if (tooltip.classList.contains('visible')) {
                updateTooltipPosition(e);
            }
        });

    } catch (error) {
        loadingEl.style.display = 'none';
        errorEl.style.display = 'flex';
        errorEl.querySelector('p').innerHTML = `
            Veriler yüklenirken hata oluştu.<br>
            <small style="color: #a0a0a0">
                Lütfen Google Sheets'in "Web'de yayınla" özelliğinin aktif olduğundan emin olun.<br>
                Hata: ${error.message}
            </small>
        `;
    }
}

// Sayfa yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', init);
