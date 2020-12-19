
const indices = {
    geonameid: 0,
    name: 1,
    asciiname: 2,
    alternatenames: 3,
    latitude: 4,
    longitude: 5,
    cc2: 9,
    population: 14,
    elevation: 15,
    dem: 16,
    timezone: 17
};

const context = document.getElementById("map").getContext("2d");

const image = new Image();
image.onload = () => {
    let map = document.getElementById("map");
    map.width = image.width;
    map.height = image.height;
    if(data) {
        drawMap();
    } else {
        clear();
    }
}

function loadImage() {
    image.src = element("imageselector").value;
}

let texts;
let cities;
let data;

function updateMap() {
    data = data.split("\n");
    data = data.map(item => item.split("\t"));
    cities = data;
    drawMap();
}

function drawMap() {
    clear();
    texts = [];

    cities.forEach(city => {
            let population = city[indices.population];
            let populationNumber = parseInt(population);
            if(populationNumber < parseInt(element("minpopulation").value) || population == undefined) {
                return;
            }

            drawCity(parseInt(city[indices.longitude]), parseInt(city[indices.latitude]), populationNumber, city[indices.name]);
        }
    );

    if(element("showtext").checked) {
        drawTexts();
    }
}

function clear() {
    context.clearRect(0, 0, image.width, image.height);
    context.drawImage(image, 0, 0);
}

function drawCity(longitude, latitude, population, name) {
    let longitudeValue = image.width / 360;
    let latitudeValue = image.height / 180;

    let size = 0;
    if(element("adjust").checked) {
        let arbitrarySizeScaling = 250 / image.width / image.height;
        size = Math.sqrt(population * arbitrarySizeScaling);
    } else {
        let arbitrarySizeScaling = 10 / image.width / image.height;
        size = population * arbitrarySizeScaling;
    }

    let x = (longitude + 180) * longitudeValue;
    let y = (-latitude + 90) * latitudeValue;

    drawCircle(x, y, size);

    if(element("showtext").checked && population > 10000000) {
        texts.push([name, x, y, size]);
    }
}

function drawTexts() {
    texts.forEach(text => {
        drawText(text[0], text[1], text[2], text[3], "white");
    });
}

function randInt(lower, upper) {
    return Math.floor(Math.random() * upper) + lower;
}

function drawCircle(x, y, size) {
    context.beginPath();
    context.ellipse(x, y, size / 2, size / 2, 0, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
}

function drawText(text, x, y, size, color) {
    context.font = size + "px serif";
    context.fillStyle = color;
    context.fillText(text, x, y);
    context.fillStyle = "black";
}

function element(elem) {
    return document.getElementById(elem);
}

function changeImageLimit(input) {
    if(input.checked) {
        element("map").classList.add("limited");
    } else {
        element("map").classList.remove("limited");
    }
}