import API_KEY from "./config.js";

const addEvent = () => {
  const form = document.querySelector("form")!;
  form.addEventListener("submit", submitHandler);
};

const renderTable = () => {
  const tableHeaders = document.querySelectorAll("th");
  for (let i = 0; i < tableHeaders.length; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    tableHeaders[i].textContent = date.toLocaleDateString();
  }
};

const getInput = () => {
  const input = document.querySelector("input")!;
  return input.value;
};

const validate = (inputValue: string) => {
  if (inputValue.trim() === "" || !inputValue) {
    return false;
  } else {
    return true;
  }
};

const getCoordinates = async (inputValue: string) => {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${inputValue}&limit=1&appid=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error("Couldn't fetch coordinates");
    }
    const data = await response.json();
    return data[0];
  } catch {
    throw new Error("Couldn't fetch coordinates");
  }
};

const getWeather = async (lat: string, lon: string) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error("Couldn't fetch weather");
    }
    const data = await response.json();
    return data.daily;
  } catch {
    throw new Error("Couldn't fetch weather");
  }
};

const addWeather = (dailyWeather: { summary: string }[]) => {
  const tableData = document.querySelectorAll("td");
  console.log(dailyWeather);
  for (let i = 0; i < tableData.length; i++) {
    tableData[i].textContent = dailyWeather[i].summary;
  }
};

const submitHandler = async (event: Event) => {
  event.preventDefault();
  const loadingText = document.querySelector("p")!;
  loadingText.style.display = "block";
  const inputValue = getInput();
  const isValid = validate(inputValue);
  if (!isValid) {
    alert("Please input valid value");
    return;
  }
  try {
    const coordinates = await getCoordinates(inputValue);
    const dailyWeather = await getWeather(coordinates.lat, coordinates.lon);
    addWeather(dailyWeather);
  } catch (err: unknown) {
    if (err instanceof Error) {
      alert(err.message);
    }
  }
  loadingText.style.display = "none";
};

addEvent();
renderTable();
