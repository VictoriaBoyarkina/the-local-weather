<template>
    <main class="container text-white">
        <div class="pt-4 mb-8 relative">
            <input
            type="text"
            placeholder="Search for a city"
            class="py-2 px-1 w-full bg-transparent border-b focus:border-weather-secondary focus:outline-none focus:shadow"
            v-model="searchQuery"
            @input="getSearchResults"
            >
            <ul class="absolute bg-weather-secondary text-white w-full shadow-md py-2 px-1 top-[66px]" v-if="mapBoxSearchResults">
                <p v-if="searchError">Sorry, something went wrong, please try again.</p>
                <p v-if="!searchError && mapBoxSearchResults.length === 0">
                No results match your query, try a different term.</p>
                <template v-else>
                    <li v-for="searchResult in mapBoxSearchResults" :key="searchResult.id" class="py-2 cursor-pointer" @click="previewCity(searchResult)">
                        {{ searchResult.place_name }}
                    </li>
                </template>
            </ul>
        </div>
        <div class="flex flex-col gap-4">
            <Suspense>
                <CityList />
                <template #fallback>
                    <CityCardSkeleton />
                </template>
            </Suspense>
        </div>
    </main>
</template>

<script setup>
import CityList from '@/components/CityList.vue';
import { ref } from 'vue';
import axios from "axios";
import { useRouter } from "vue-router";
import CityCardSkeleton from '@/components/CityCardSkeleton.vue';

const router = useRouter();
const searchQuery = ref('');
const queryTimeout = ref(null);
const mapBoxSearchResults = ref(null);
const searchError = ref(null);

const previewCity = (searchResult) => {
    const [city, state] = searchResult.place_name.split(',');
    router.push({
        name: 'cityView',
        params: {
            state: state.replaceAll(" ", ""),
            city: city
        },
        query: {
            lat: searchResult.geometry.coordinates[1],
            lng: searchResult.geometry.coordinates[0],
            preview: true
        }
    })
}

const mapBoxAPIKey = "pk.eyJ1Ijoidmlja2EtYm95YXJraW5hIiwiYSI6ImNsdXB5ZXB3MzI1ZzcyaWxpYTh0cHBoNXUifQ.X_4OcqpCpiIyU8Q1yahwew"

const getSearchResults = () => {
    clearTimeout(queryTimeout.value)
    queryTimeout.value = setTimeout(async () => {
        try {
            if (searchQuery.value !== '') {
                const result = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQuery.value}.json?access_token=${mapBoxAPIKey}&types=place`);
                mapBoxSearchResults.value = result.data.features;
            }
        } catch {
            searchError.value = true;
        }
    }, 300);
    mapBoxSearchResults.value = null;
}
</script>