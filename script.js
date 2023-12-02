let endMillis = Date.now();
let daysMillis = convertDaysInMillis(16);
let startMillis = endMillis - daysMillis;

function convertDaysInMillis(days){
  return days * 24 * 60 * 60 * 1000;
}

function createFormattedDate(millis) {
  let date = new Date(millis);
  let [year,month,day] = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
  return `${year}-${month}-${day}`;
}

/*let end_date = new Date(endMillis);
let start_date = new Date(startMillis);


let [endYear,endMonth,endDay] = [end_date.getFullYear(), end_date.getMonth() + 1, end_date.getDate()];
let [startYear,startMonth,startDay] = [start_date.getFullYear(), start_date.getMonth() + 1, start_date.getDate()];
console.log(endYear,endMonth,endDay)
console.log(startYear,startMonth,startDay)*/

let start = createFormattedDate(startMillis)
let end = createFormattedDate(endMillis)

//let start =`${startYear}-${startMonth}-${startDay}`;
//let end =`${endYear}-${endMonth}-${endDay}`;
let apiKey = '30xRBRiF7vslOw9Sq8p5mRN3gxAc56UX1lgfjvkD';


//let astronomyPictures = 'mock/astronomy-pictures.json';
let astronomyPictures = `https://api.nasa.gov/planetary/apod?start_date=${start}&end_date=${end}&api_key=${apiKey}`;

let mainPicture = document.querySelector('#main-picture');
let picturesContainer = document.querySelector('.pictures-container');



let fetchPictures = () => {
  let pictures = fetch(astronomyPictures)
    .then(res => {
      if(res.ok){
        return res.json()
      } else {
        throw new Error(res.status)
      }
    })
      .catch(
        error => {
          console.log(error)
          mainPicture.textContent = error;
        }
      )
  return pictures;
}

let fetchedPictures = fetchPictures()
  .then(
    pictures => {
      console.log(pictures);
      // estrarre l'immagine odierna
      createMainPicture(pictures.at(-1));

      // creare il contenuto di main picture
      // prendere le pictures restanti
      // popolare la sezione previous image
      createToPreviousPictures(pictures.reverse().slice(1));
      // Attenzione: la prima immagine dovrà essere quella di ieri, poi quella di 2 giorni fa e così via
    }
  )  

let createMainPicture = (picture) => {
  mainPicture.innerHTML = '';

  let img = document.createElement('img');

  let imgContent = checkMediaType(picture);
  img.src = imgContent;
  mainPicture.append(img);

  let container = document.createElement('div');
  container.classList.add('text-container');
  
  let title = document.createElement('h3');
  title.textContent = picture.title;

  let explanation = document.createElement('p');
  explanation.textContent = picture.explanation;
  
  let copyright = document.createElement('p');
  copyright.textContent = picture.copyright;

  container.append(title);
  container.append(explanation);
  container.append(copyright);
  
  mainPicture.append(container);
}
 'mock/placeholder.webp'

 function checkMediaType(picture) {
  if(picture.media_type === 'image') {
    return picture.url;
  } else if(picture.media_type === 'video') {
    // Se abbiamo scaricato un video, possiamo mostrare la thumbnail
    return picture.thumbnail_url;
  }
}


let createToPreviousPictures = (pictures) =>{
  picturesContainer.innerHTML = '';

  pictures.map(picture => {
    let pictureContainer = document.createElement('div');
    pictureContainer.classList.add('picture-container');

    pictureContainer.addEventListener('click', ()=> {
      showDetails(picture);
    })


    let img = document.createElement('img');
    let imgContent = checkMediaType(picture);
    img.src = imgContent;
    /*if(picture.media_type === 'image'){
      img.src = picture.url;
    } else if(picture.media_type === 'ideo') {
      img.src = picture.thumbnail_url;
    } else {
      img.src = 'mock/placeholder.webp'
    }*/

    pictureContainer.append(img);
    picturesContainer.append(pictureContainer);
  })
  
}

let closeButton = document.querySelector('#close-button')
let pictureDetailsContainer = document.querySelector('#picture-details-container')

let showDetails = (picture) => {
  let pictureDetailsTitle = document.querySelector('#picture-title')
  let pictureDetailsImg = document.querySelector('#picture-img')
  let pictureDetailsDescription = document.querySelector('#picture-description')
  let pictureDetailsCopyright = document.querySelector('#picture-copyright')

  pictureDetailsTitle.textContent = picture.title
  pictureDetailsDescription.textContent = picture.explanation
  pictureDetailsCopyright.textContent = picture.copyright
  let imgContent = checkMediaType(picture);
  pictureDetailsImg.src = imgContent;

  pictureDetailsContainer.style.display = 'flex'
}

  closeButton.addEventListener('click', () => {
    pictureDetailsContainer.style.display = 'none'
  })

  window.addEventListener('keydown', (e) => {
    if(e.key === 'Escape'){
      pictureDetailsContainer.style.display = 'none'
    }
  })  

  window.addEventListener('click', (e) => {
    if(e.target == pictureDetailsContainer) {
      pictureDetailsContainer.style.display = 'none';
    }
  })



const curiosityData = 'https://mars.nasa.gov/rss/api/?feed=weather&category=msl&feedtype=json';


let fetchCuriosityData = () => {
  let data = fetch(curiosityData)
  .then(res => res.json())
  .then(data => data.soles)
  
  return data;
}

fetchCuriosityData().then(
  res => {
    let marsWeatherData = [];
    for(let i=0; i < 668; i++){
      marsWeatherData.push(res[i]);
    }
    return marsWeatherData;
  }
)
.then(data => {
  let today = data[0];
  document.querySelector('#mars-today').innerHTML = `
  <h2> Curiosity Today!</h2>
  <p>This is my ${today.sol} Martian day</p>
  <p>Today the weather is Sunny</p>`
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(() =>{myChart(data)});

})


let myChart = (WeatherData) => {

    let formattedData = WeatherData.map(data => {
      return [data.sol, +data.min_temp, +data.max_temp]
    })

    let chartData = [
      ['Date', 'Min', 'Max']
    ];

    formattedData = formattedData.reverse();
    for(let data of formattedData){
      chartData.push(data)
    }

    let options = {
      title: 'Mars Weather Data',
      curveType: 'function',
      legend: { position: 'bottom' },
      hAxis:{
        title: 'Sols'
      },
      vAxis:{
        title: 'Temperature (°C)'
      }
    };

    let finalData = new google.visualization.arrayToDataTable(chartData);

    
    let chart = new google.visualization.LineChart(document.getElementById('mars-data'));
    chart.draw(finalData, options);

}



