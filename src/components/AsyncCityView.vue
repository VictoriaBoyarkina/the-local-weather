<template>
    <div class="flex flex-col flex-1 items-center">
        <!-- Banner -->
        <div v-if="route.query.preview" class="text-white p-4 bg-weather-secondary w-full text-center">
            <p>You are currently previewing this city, click the "+" icon to start tracking this city</p>
        </div>
        <!-- Weather Overveiw -->
        <div class="flex flex-col text-white items-center py-12">
            <h1 class="text-4xl mb-2">{{ route.params.city }}</h1>
            <p class="text-sm mb-12">
                {{ 
                    new Date(weatherData.currentTime).toLocaleDateString("en-GB", {
                        weekday: "short",
                        day: "2-digit",
                        month: "long",
                    })
                }}
                {{ 
                    new Date(weatherData.currentTime).toLocaleTimeString("en-GB", {
                        timeStyle: "short"
                    })
                }}
            </p>
            <p class="text-8xl mb-8">
                {{ Math.round((weatherData.current.temp - 32) * 5 / 9) }}&deg;
            </p>
            <div class="text-center">
                <p>Feels like
                {{ Math.round((weatherData.current.feels_like - 32) * 5 / 9) }}&deg;
                </p>
                <p class="capitalize">
                    {{ weatherData.current.weather[0].description }}
                </p>
                <img alt="weather_icon" class="w-[150px] h-auto" :src="`https://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`">
            </div>
        </div>
        <hr class="border-white border-opacity-10 border w-full">
        <!-- Hourly weather -->
        <div class="max-w-screen-md w-full py-12">
            <div class="mx-8 text-white">
                <h2 class="mb-4">Hourly Weather</h2>
                <div class="flex gap-10 overflow-x-scroll">
                    <div v-for="hourData in weatherData.hourly" :key="hourData.dt" class="flex flex-col gap-4 items-center">
                    <p class="whitespace-nowrap text-md">
                        {{ 
                            new Date(hourData.currentTime).toLocaleString("en-GB", {
                                hour: "numeric",
                                })
                        }}
                    </p>
                    <img alt="weather_icon" class="w-auto h-[50px] object-cover" :src="`https://openweathermap.org/img/wn/${hourData.weather[0].icon}@2x.png`">
                    <p class="text-xl">
                        {{ Math.round((hourData.temp - 32) * 5 / 9) }}&deg;
                    </p>
                    </div>
                </div>
            </div>
        </div>
        <hr class="border-white border-opacity-10 border w-full">
        <!-- Weekly Weather -->
        <div class="max-w-screen-md w-full py-12">
            <div class="mx-8 text-white">
                <h2 class="mb-4">7 Day Forecast</h2>
                <div v-for="day in weatherData.daily" :key="day.dt" class="flex items-center">
                    <p class="flex-1">
                        {{ 
                           new Date(day.dt * 1000).toLocaleDateString("en-GB", {
                                weekday: "long"
                            })
                        }}
                    </p>
                    <img alt="weather_icon" class="w-[50px] h-[50px] object-cover" :src="`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`">
                    <div class="flex gap-2 flex-1 justify-end">
                        <p>H: {{ Math.round((day.temp.max - 32) * 5 / 9) }}</p>
                        <p>L: {{ Math.round((day.temp.min - 32) * 5 / 9) }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex items-center gap-2 py-12 text-white cursor-pointer duration-150 hover:text-red-500" @click="removeCity">
            <i class="fa-solid fa-trash"></i>
            <p>Remove city</p>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';


const route = useRoute();
const getWeatherData = async () => {
    try {
        const weatherData = await axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${route.query.lat}&lon=${route.query.lng}&appid=3ad40b7187ddb678858a812b30c2dbd0&units=imperial`);
        const localOffset = new Date().getTimezoneOffset() * 60000;
        const utc = weatherData.data.current.dt * 1000 + localOffset;
        weatherData.data.currentTime = utc + 1000 + weatherData.data.timezone_offset;

        weatherData.data.hourly.forEach((hour) => {
            const utc = hour.dt * 1000 + localOffset;
            hour.currentTime = utc + 1000 * weatherData.data.timezone_offset;
        })

        await new Promise((res) => setTimeout(res, 1000))
        return weatherData.data;
    } catch(err) {

        console.log(err)
    }
};
const weatherData = await getWeatherData();

console.log(route.query)

const router = useRouter();
const removeCity = () => {
    const cities = JSON.parse(localStorage.getItem('savedCities'));
    const updatedCities = cities.filter((city) => city.id !== route.query.id);
    localStorage.setItem('savedCities', JSON.stringify(updatedCities));
    router.push({
        name: "home",
    })
}
</script>