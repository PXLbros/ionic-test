<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/fair"></ion-back-button>
        </ion-buttons>
        <ion-title>NY State Fair Map</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-card class="header-card">
        <ion-card-header class="header-card__header">
          <ion-card-title>Food Finder Map</ion-card-title>
          <ion-card-subtitle>Find your favorite fair food</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <ion-searchbar
            v-model="searchQuery"
            placeholder="Search for food or place"
            @ionInput="handleSearch"
          ></ion-searchbar>
          <ion-select v-model="selectedFoodType" placeholder="Select food type" @ionChange="handleSearch">
            <ion-select-option value="">Select Food Types</ion-select-option>
            <ion-select-option v-for="type in uniqueFoodTypes" :key="type" :value="type">
              {{ type }}
            </ion-select-option>
          </ion-select>
          <ion-select v-model="selectedDietaryRestriction" placeholder="Select food restrictions" @ionChange="handleSearch">
            <ion-select-option value="">None</ion-select-option>
            <ion-select-option v-for="restriction in restrictions" :key="restriction" :value="restriction">
              {{ restriction }}
            </ion-select-option>
          </ion-select>
          <ion-select v-model="selectedMapStyle" placeholder="Select map style" @ionChange="changeMapStyle">
            <ion-select-option value="mapbox://styles/mapbox/streets-v11">Streets</ion-select-option>
            <ion-select-option value="mapbox://styles/mapbox/outdoors-v11">Outdoors</ion-select-option>
            <ion-select-option value="mapbox://styles/mapbox/light-v10">Light</ion-select-option>
            <ion-select-option value="mapbox://styles/mapbox/dark-v10">Dark</ion-select-option>
            <ion-select-option value="mapbox://styles/mapbox/satellite-streets-v11">Satellite Streets</ion-select-option>
          </ion-select>
        </ion-card-content>
      </ion-card>
      <ion-content class="ion-padding">
        <div class="map" ref="mapContainer" style="width: 100%; height: 100%"></div>
      </ion-content>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonSearchbar, IonSelect, IonSelectOption } from '@ionic/vue';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default defineComponent({
  name: 'MapPage',
  components: {
    IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar,
    IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonSearchbar,
    IonSelect, IonSelectOption
  },
  setup() {
    const mapContainer = ref<HTMLElement | null>(null);
    const searchQuery = ref('');
    const selectedFoodType = ref('');
    const selectedDietaryRestriction = ref('');
    const selectedMapStyle = ref('mapbox://styles/mapbox/streets-v11');
    let map: mapboxgl.Map;
    const markers: mapboxgl.Marker[] = [];

    const foodPlaces = [
      {
        name: "Tasty Treats",
        types: ["hamburger", "pizza", "dessert"],
        coordinates: [-76.2157, 43.073],
        dietaryOptions: ["vegetarian"]
      },
      {
        name: "Fair Favorites",
        types: ["hotdog", "corndog", "fries"],
        coordinates: [-76.2170, 43.0745],
        dietaryOptions: ["gluten-free"]
      },
      {
        name: "Sweet & Savory",
        types: ["ice cream", "popcorn", "nachos"],
        coordinates: [-76.2140, 43.0720],
        dietaryOptions: ["vegetarian", "gluten-free"]
      },
      {
        name: "International Delights",
        types: ["tacos", "sushi", "pasta"],
        coordinates: [-76.2180, 43.0735],
        dietaryOptions: ["vegetarian", "vegan", "gluten-free"]
      },
      {
        name: "Comfort Food Corner",
        types: ["mac and cheese", "fried chicken", "BBQ"],
        coordinates: [-76.2130, 43.0740],
        dietaryOptions: []
      }
    ];

    const restrictions = ["vegetarian", "vegan", "gluten-free"];

    const uniqueFoodTypes = computed(() => {
      const types = new Set(foodPlaces.flatMap(place => place.types));
      return Array.from(types).sort();
    });

    const addMarker = (place: typeof foodPlaces[0]) => {
      const marker = new mapboxgl.Marker()
        .setLngLat(place.coordinates as [number, number])
        .setPopup(new mapboxgl.Popup().setHTML(`
          <h3>${place.name}</h3>
          <p>Offers: ${place.types.join(', ')}</p>
          <p>Dietary options: ${place.dietaryOptions.length > 0 ? place.dietaryOptions.join(', ') : 'None'}</p>
        `))
        .addTo(map);
      markers.push(marker);
    };

    const handleSearch = () => {
      markers.forEach(marker => marker.remove());
      markers.length = 0;

      const filteredPlaces = foodPlaces.filter(place =>
        (place.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        place.types.some(type => type.toLowerCase().includes(searchQuery.value.toLowerCase()))) &&
        (selectedFoodType.value === '' || place.types.includes(selectedFoodType.value)) &&
        (selectedDietaryRestriction.value === '' || place.dietaryOptions.includes(selectedDietaryRestriction.value))
      );

      filteredPlaces.forEach(addMarker);
    };

    const changeMapStyle = () => {
      map.setStyle(selectedMapStyle.value);
    };

    onMounted(() => {
      if (mapContainer.value) {
        mapboxgl.accessToken = 'pk.eyJ1IjoibWtldHRlbGthbXAiLCJhIjoiY2xhaXljbjZ3MDQ0NDN2bndzZnJrc3FxMyJ9.LEl_hT5f2QSxqw2LTf03lQ';
        map = new mapboxgl.Map({
          container: mapContainer.value,
          style: selectedMapStyle.value,
          center: [-76.2157, 43.073],
          zoom: 14
        });

        map.addControl(new mapboxgl.NavigationControl());

        foodPlaces.forEach(addMarker);

        setTimeout(() => {
          map.resize();
        }, 100);
      }
    });

    return {
      mapContainer,
      searchQuery,
      selectedFoodType,
      selectedDietaryRestriction,
      selectedMapStyle,
      uniqueFoodTypes,
      restrictions,
      handleSearch,
      changeMapStyle
    };
  }
});
</script>

<style scoped lang="scss">
.header-card {
  padding-bottom: 0px;
  margin-bottom: 0px;

  &__header {
    padding-bottom: 0px;
  }
}
.ion-padding {
  height: 60%;
}
.map-section {
  padding: 15px;
}
.map {
  width: 100%;
  height: 50%;
  padding: 15px;
  border-radius: 10px;
}
.mapboxgl-canvas {
  width: 100%;
  height: 100%;
  border-radius: 30px;
}
:deep .mapboxgl-popup-content {
  background-color: black;
  padding: 10px;
  border-radius: 8px;
  h3 {
    color: white;
    margin-top: 0px;
    font-size: 18px;
  }
  p {
    color: white;
  }
  button {
    margin: 5px;
  }
}
</style>
