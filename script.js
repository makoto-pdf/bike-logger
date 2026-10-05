// ====================
// 地図
// ====================

const map = L.map('map').setView([35.0116, 135.7681], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);


// 仮のGPS走行データ
const route = [
    [35.0116, 135.7681],
    [35.0130, 135.7700],
    [35.0150, 135.7730],
    [35.0170, 135.7760],
    [35.0190, 135.7790]
];


// 走行ルートを線で表示
const polyline = L.polyline(route, {
    color: 'blue',
    weight: 5
}).addTo(map);


// スタート地点
L.marker(route[0])
    .addTo(map)
    .bindPopup('スタート');


// ゴール地点
L.marker(route[route.length - 1])
    .addTo(map)
    .bindPopup('ゴール');


// ルート全体が見えるように自動調整
map.fitBounds(polyline.getBounds());


// ====================
// 速度グラフ
// ====================

const ctx = document.getElementById('speedChart');

new Chart(ctx, {
    type: 'line',

    data: {
        labels: ['0分', '1分', '2分', '3分', '4分', '5分'],

        datasets: [{
            label: '速度 (km/h)',
            data: [0, 18, 25, 22, 30, 27],
            borderWidth: 3,
            tension: 0.3
        }]
    },

    options: {
        responsive: true,

        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});


// ====================
// 標高データ
// ====================

const distance = [0, 1, 2, 3, 4, 5, 6, 7];

const elevation = [
    100,
    110,
    125,
    120,
    135,
    150,
    145,
    160
];


// ====================
// 獲得標高を計算
// ====================

let elevationGain = 0;

for (let i = 1; i < elevation.length; i++) {

    const difference = elevation[i] - elevation[i - 1];

    // 標高が上がったときだけ加算
    if (difference > 0) {
        elevationGain += difference;
    }
}


// ====================
// 獲得標高をWebページに表示
// ====================

document.getElementById('elevationGain').textContent =
    Math.round(elevationGain) + ' m';


// ====================
// 標高グラフ
// ====================

const elevationCtx = document.getElementById('elevationChart');

new Chart(elevationCtx, {
    type: 'line',

    data: {
        labels: distance,

        datasets: [{
            label: '標高 (m)',
            data: elevation,

            borderWidth: 3,
            tension: 0.3,

            // 上り・下りで色を変える
            segment: {

                borderColor: function(context) {

                    const start = context.p0DataIndex;
                    const end = context.p1DataIndex;

                    if (elevation[end] > elevation[start]) {
                        return 'green';   // 上り
                    } else {
                        return 'blue';    // 下り
                    }
                }
            }
        }]
    },

    options: {

        responsive: true,

        scales: {

            x: {
                title: {
                    display: true,
                    text: '距離 (km)'
                }
            },

            y: {
                title: {
                    display: true,
                    text: '標高 (m)'
                }
            }
        }
    }
});