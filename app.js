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
// Orijinal WoWDB koordinatları (800x600 viewport) → 1024x681 haritaya dönüştürüldü
// Dönüşüm formülü: newX = 1.257 * oldX - 203, newY = 1.26 * oldY - 78
const SPOT_COORDINATES = {
    0: { x: 412, y: 460 },   // WoWDB: 489, 427
    1: { x: 658, y: 538 },   // WoWDB: 685, 489
    2: { x: 432, y: 363 },   // WoWDB: 505, 350 (referans)
    3: { x: 615, y: 538 },   // WoWDB: 651, 489
    4: { x: 619, y: 417 },   // WoWDB: 654, 393
    5: { x: 640, y: 546 },   // WoWDB: 671, 495
    6: { x: 578, y: 561 },   // WoWDB: 621, 507
    7: { x: 623, y: 570 },   // WoWDB: 657, 514
    8: { x: 683, y: 451 },   // WoWDB: 705, 420
    9: { x: 417, y: 402 },   // WoWDB: 493, 381
    10: { x: 609, y: 466 },  // WoWDB: 646, 432
    11: { x: 450, y: 493 },  // WoWDB: 519, 453
    12: { x: 483, y: 577 },  // WoWDB: 546, 520
    13: { x: 667, y: 520 },  // WoWDB: 692, 475
    14: { x: 682, y: 474 },  // WoWDB: 704, 438
    15: { x: 692, y: 335 },  // WoWDB: 712, 328
    16: { x: 585, y: 426 },  // WoWDB: 627, 400
    17: { x: 452, y: 517 },  // WoWDB: 521, 472
    18: { x: 429, y: 417 },  // WoWDB: 503, 393
    19: { x: 593, y: 601 },  // WoWDB: 633, 539
    20: { x: 657, y: 377 },  // WoWDB: 684, 361
    21: { x: 610, y: 398 },  // WoWDB: 647, 378
    22: { x: 537, y: 576 },  // WoWDB: 589, 519
    23: { x: 687, y: 358 },  // WoWDB: 708, 346
    24: { x: 475, y: 625 },  // WoWDB: 543, 558 (referans)
    25: { x: 478, y: 370 },  // WoWDB: 542, 356
    26: { x: 426, y: 498 },  // WoWDB: 500, 457
    27: { x: 506, y: 475 },  // WoWDB: 564, 439
    28: { x: 437, y: 401 },  // WoWDB: 509, 380
    29: { x: 560, y: 483 },  // WoWDB: 607, 445
    30: { x: 504, y: 513 },  // WoWDB: 562, 469
    31: { x: 624, y: 335 },  // WoWDB: 658, 328
    32: { x: 521, y: 555 },  // WoWDB: 576, 502
    33: { x: 461, y: 480 },  // WoWDB: 528, 443
    34: { x: 592, y: 452 },  // WoWDB: 632, 421
    35: { x: 730, y: 380 },  // WoWDB: 742, 366 (referans)
    36: { x: 485, y: 387 },  // WoWDB: 547, 369
    37: { x: 565, y: 614 },  // WoWDB: 611, 549
    38: { x: 713, y: 368 },  // WoWDB: 729, 354
    39: { x: 716, y: 314 },  // WoWDB: 731, 311
    40: { x: 555, y: 505 },  // WoWDB: 603, 463
    41: { x: 492, y: 450 },  // WoWDB: 553, 419
    42: { x: 712, y: 393 },  // WoWDB: 728, 374
    43: { x: 471, y: 562 },  // WoWDB: 536, 508
    44: { x: 648, y: 362 },  // WoWDB: 677, 349
    45: { x: 625, y: 370 },  // WoWDB: 659, 356
    46: { x: 664, y: 308 },  // WoWDB: 690, 306
    47: { x: 563, y: 444 },  // WoWDB: 609, 414
    48: { x: 576, y: 469 },  // WoWDB: 620, 434
    49: { x: 556, y: 593 },  // WoWDB: 604, 533
    50: { x: 481, y: 498 },  // WoWDB: 544, 457
    51: { x: 600, y: 563 },  // WoWDB: 639, 509
    52: { x: 685, y: 407 },  // WoWDB: 706, 385
    53: { x: 666, y: 412 },  // WoWDB: 691, 389
    54: { x: 456, y: 547 },  // WoWDB: 524, 496
};

// Harita boyutları (koordinatların verildiği kaynak)
const SOURCE_MAP_WIDTH = 1024;
const SOURCE_MAP_HEIGHT = 681;

// Offset ayarları (koordinatları kaydırmak için)
const X_OFFSET = 0;
const Y_OFFSET = 0;

// Scale faktörü (1.0 = normal, 1.05 = %5 zoom-in)
let SCALE = 1;

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
const mapContainer = document.getElementById('mapContainer');
const mapInner = document.getElementById('mapInner');
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
const zoomResetBtn = document.getElementById('zoomReset');

// =====================================================
// Global State
// =====================================================
let allData = [];
let markers = {};
let playerItems = {};

// Zoom & Pan state
let mapZoom = 1;
let mapPanX = 0;
let mapPanY = 0;
let isDragging = false;
let hasDragged = false;
let dragStartX = 0;
let dragStartY = 0;
let dragStartPanX = 0;
let dragStartPanY = 0;

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
// Zoom & Pan
// =====================================================
function updateMapTransform() {
    mapInner.style.transform = `translate(${mapPanX}px, ${mapPanY}px) scale(${mapZoom})`;

    // Marker boyutlarını zoom'a göre ayarla (ters orantılı)
    const markerScale = 1 / mapZoom;
    document.querySelectorAll('.marker').forEach(marker => {
        marker.style.transform = `translate(-50%, -50%) scale(${markerScale})`;
    });
}

function zoomIn() {
    mapZoom = Math.min(mapZoom * 1.2, 5);
    updateMapTransform();
}

function zoomOut() {
    mapZoom = Math.max(mapZoom / 1.2, 0.5);
    // Pan sınırlarını kontrol et
    constrainPan();
    updateMapTransform();
}

function zoomReset() {
    mapZoom = 1;
    mapPanX = 0;
    mapPanY = 0;
    updateMapTransform();
}

function constrainPan() {
    // Zoom 1'den küçükse pan'i sıfırla
    if (mapZoom <= 1) {
        mapPanX = 0;
        mapPanY = 0;
    }
}

function initZoomPan() {
    // Mouse wheel zoom
    mapContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            zoomIn();
        } else {
            zoomOut();
        }
    }, { passive: false });

    // Drag to pan
    mapContainer.addEventListener('mousedown', (e) => {
        // Zoom butonları veya marker'lara tıklandıysa drag başlatma
        if (e.target.closest('.zoom-controls') || e.target.closest('.marker')) return;

        e.preventDefault();
        isDragging = true;
        hasDragged = false;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        dragStartPanX = mapPanX;
        dragStartPanY = mapPanY;
        mapContainer.classList.add('dragging');
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - dragStartX;
        const deltaY = e.clientY - dragStartY;

        // Minimum 5px hareket olmalı drag sayılması için
        if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
            hasDragged = true;
        }

        mapPanX = dragStartPanX + deltaX;
        mapPanY = dragStartPanY + deltaY;
        updateMapTransform();
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        mapContainer.classList.remove('dragging');
    });

    // Drag sırasında text selection'ı engelle
    mapContainer.addEventListener('selectstart', (e) => {
        if (isDragging) e.preventDefault();
    });

    // Touch support
    let lastTouchDistance = 0;

    mapContainer.addEventListener('touchstart', (e) => {
        if (e.target.closest('.zoom-controls') || e.target.closest('.marker')) return;

        if (e.touches.length === 1) {
            isDragging = true;
            hasDragged = false;
            dragStartX = e.touches[0].clientX;
            dragStartY = e.touches[0].clientY;
            dragStartPanX = mapPanX;
            dragStartPanY = mapPanY;
        } else if (e.touches.length === 2) {
            isDragging = false;
            lastTouchDistance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
        }
    }, { passive: false });

    mapContainer.addEventListener('touchmove', (e) => {
        // Harita üzerinde scroll'u engelle
        if (isDragging || e.touches.length === 2) {
            e.preventDefault();
        }

        if (e.touches.length === 1 && isDragging) {
            const deltaX = e.touches[0].clientX - dragStartX;
            const deltaY = e.touches[0].clientY - dragStartY;

            if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
                hasDragged = true;
            }

            mapPanX = dragStartPanX + deltaX;
            mapPanY = dragStartPanY + deltaY;
            updateMapTransform();
        } else if (e.touches.length === 2) {
            const distance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            if (lastTouchDistance > 0) {
                const scale = distance / lastTouchDistance;
                mapZoom = Math.min(Math.max(mapZoom * scale, 0.5), 5);
                updateMapTransform();
            }
            lastTouchDistance = distance;
        }
    }, { passive: false });

    mapContainer.addEventListener('touchend', () => {
        isDragging = false;
        lastTouchDistance = 0;
    });

    // Button controls
    zoomInBtn.addEventListener('click', zoomIn);
    zoomOutBtn.addEventListener('click', zoomOut);
    zoomResetBtn.addEventListener('click', zoomReset);
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
            updateMapTransform();
        } else {
            mapImage.onload = () => {
                createMarkers();
                updateMapTransform();
            };
        }

        // Oyuncu listesini oluştur
        renderPlayerList(allData);

        // İstatistikleri güncelle
        updateStats();

        // Resizer'ı başlat
        initResizer();

        // Zoom & Pan başlat
        initZoomPan();

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
