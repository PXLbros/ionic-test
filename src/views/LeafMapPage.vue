<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Interactive Map</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="status-bar" :class="{ online: isOnline, offline: !isOnline }">
        {{ isOnline ? 'Online' : 'Offline' }} Mode
      </div>
      <div id="map" style="height: 100%; width: 100%;"></div>
      <div id="progress-wrapper" class="progress-wrapper">
        <div id="progressbar" class="progress-bar"></div>
      </div>

      <div v-if="selectedLocation" class="modal-overlay" :style="overlayStyle" @click="handleOverlayClick" style="opacity: 0"></div>

      <transition name="slide">
        <div v-if="selectedLocation" 
             class="info-panel"
             :style="panelStyle"
             @touchstart="handleTouchStart"
             @touchmove="handleTouchMove"
             @touchend="handleTouchEnd">
          <!-- Drag handle indicator -->
          <div class="drag-handle">
            <div class="drag-handle-line"></div>
          </div>
          
          <div class="info-panel-header">
            <h2>{{ selectedLocation.Title }}</h2>
            <button class="close-button" @click="closeInfoPanel">×</button>
          </div>
          <div class="info-panel-content">
            <img :src="'/modal-img/' + selectedLocation.modalImage + '.jpg'" class="location-icon" />
            <div class="location-details">
              <p>{{ selectedLocation.Content }}</p>
            </div>
          </div>
        </div>
      </transition>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import { onMounted, onUnmounted, ref } from 'vue';
import L from 'leaflet';
import { tileLayerOffline, savetiles } from 'leaflet.offline';
import localforage from 'localforage';
import 'leaflet/dist/leaflet.css';
import { saveOutline, trashOutline } from 'ionicons/icons';

export default {
  name: 'MapView',
  components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent },
  setup() {
    let map;
    let baseLayer;
    let saveControl;
    const fairgroundsLocation = [43.0731, -76.2230];
    const progress = ref(0);
    const total = ref(0);
    const isOnline = ref(navigator.onLine); // Check if the user is online
    const selectedLocation = ref(null); // selected location for info panel
    const dragStart = ref(null); // Track touch start for drag
    const currentDrag = ref(0); // Track current drag distance
    const panelStyle = ref({}); // Style object for info panel
    const overlayStyle = ref({}); // Style object for overlay
    const isDragging = ref(false); // Track if user is dragging
    const startY = ref(0); // Track start Y position for drag
    const startScrollTop = ref(0); // Track start scroll position for drag
    const activeMarker = ref(null); // Track active marker selected

    // Handle online/offline status
    const updateOnlineStatus = () => {
      isOnline.value = navigator.onLine;
      console.log(`App is ${navigator.onLine ? 'online' : 'offline'}`);
    };

    // Initialize the map
    const initMap = async () => {
      map = L.map('map').setView(fairgroundsLocation, 15.9);
      
      baseLayer = tileLayerOffline('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abc',
        minZoom: 13,
      }).addTo(map);

      updateOnlineStatus();
      // howdy buddy

      // Add save control with Ionicons
      saveControl = savetiles(baseLayer, {
        zoomlevels: [14, 15, 16, 17, 18],
        confirm(layer, successCallback) {
          const numTiles = layer._tilesforSave.length;
          console.log(`Preparing to save ${numTiles} tiles`);
          if (confirm(`Save ${numTiles} tiles? This will use approximately ${(numTiles * 15 / 1024).toFixed(2)} MB of storage.`)) {
            successCallback();
          }
        },
        confirmRemoval(layer, successCallback) {
          if (confirm('Remove all the stored tiles? The map will not be available offline.')) {
            successCallback();
          }
        },
        saveText: `<ion-icon src="${saveOutline}" aria-hidden="true" title="Save tiles"></ion-icon>`,
        rmText: `<ion-icon src="${trashOutline}" aria-hidden="true" title="Remove tiles"></ion-icon>`,
      });
      saveControl.addTo(map);

      // Event listeners for tile saving progress
      baseLayer.on('savestart', (e) => {
        progress.value = 0;
        total.value = e._tilesforSave.length;
        console.log(`Starting to save ${total.value} tiles...`);
        document.getElementById('progress-wrapper').classList.add('show');
      });

      baseLayer.on('loadtileend', () => {
        progress.value += 1;
        console.log(`Loaded tile ${progress.value}/${total.value}`);
        updateProgressBar();
      });

      baseLayer.on('savetileend', (e) => {
        progress.value += 1;
        console.log(`Saved tile ${progress.value}/${total.value}`);
        updateProgressBar();
      });

      baseLayer.on('saveend', () => {
        console.log('All tiles saved successfully!');
        // Check storage usage
        if (navigator.storage && navigator.storage.estimate) {
          navigator.storage.estimate().then(estimate => {
            const usage = (estimate.usage / 1024 / 1024).toFixed(2);
            const quota = (estimate.quota / 1024 / 1024).toFixed(2);
            console.log(`Storage usage: ${usage}MB out of ${quota}MB`);
          });
        }
        alert('All tiles saved! The map is now available offline.');
      });

      baseLayer.on('tilesremoved', () => {
        console.log('All tiles removed from storage');
        alert('All offline tiles have been removed.');
      });

      // Add custom marker for fairgrounds
      const fairgroundsIcon = L.icon({
        iconUrl: '/icons/fairgroundsl.png',
        iconSize: [62, 62],
        iconAnchor: [31, 62],
        popupAnchor: [0, -62]
      });

      const customMarker = L.marker(fairgroundsLocation, { icon: fairgroundsIcon }).addTo(map);
      customMarker.bindPopup('New York State Fairgrounds', { className: 'wider-popup' });

      // Set map bounds
      const southWest = L.latLng(43.0631, -76.2310);
      const northEast = L.latLng(43.0831, -76.2110);
      const bounds = L.latLngBounds(southWest, northEast);
      map.setMaxBounds(bounds);
      map.setMinZoom(14);
      map.setMaxZoom(18);

      // Plot points from CSV data
      await plotCSVData();
     

      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    };

    // Update progress bar
    const updateProgressBar = () => {
      const percent = (progress.value / total.value) * 100;
      document.getElementById('progressbar').style.width = `${percent}%`;
      document.getElementById('progressbar').innerText = `${progress.value}/${total.value}`;
    };

    // INFO PANEL FUNCTIONS 
    const handleTouchStart = (event) => {
      const panel = event.currentTarget;
      startY.value = event.touches[0].clientY; // Track start Y position 
      startScrollTop.value = panel.scrollTop; // Track start scroll position
      
      // Only initiate drag if we're at the top of the scroll
      isDragging.value = panel.scrollTop <= 0;
      
      if (isDragging.value) {
        dragStart.value = startY.value;
        currentDrag.value = 0;
        panelStyle.value = { transition: 'none' };
      }
    };

    const handleTouchMove = (event) => {
      const panel = event.currentTarget;
      const currentY = event.touches[0].clientY;
      const deltaY = currentY - startY.value;

      if (isDragging.value) {
        // Handle dragging down to close
        if (deltaY > 0) {
          event.preventDefault();
          const dragDelta = currentY - dragStart.value;
          currentDrag.value = dragDelta;
          
          panelStyle.value = {
            transform: `translate(-50%, ${dragDelta}px)`,
            transition: 'none'
          };

          const opacity = Math.max(0.2 - (dragDelta / 1000), 0);
          overlayStyle.value = {
            opacity: opacity
          };
        }
      } else {
        // Normal scrolling behavior
        panel.style.overflow = 'auto';
      }
    };

    const handleTouchEnd = (event) => {
      if (!isDragging.value) return;

      const endY = event.changedTouches[0].clientY;
      const dragDistance = endY - dragStart.value;
      const dragTime = event.timeStamp - dragStart.value;
      const velocity = dragDistance / dragTime;

      dragStart.value = null;
      isDragging.value = false;

      if (dragDistance > 150 || velocity > 0.5) {
        closeInfoPanel();
      } else {
        // Restore panel position
        panelStyle.value = {
          transform: 'translate(-50%, 0)',
          transition: 'transform 0.3s ease-out'
        };
        overlayStyle.value = {
          opacity: 0.2,
          transition: 'opacity 0.3s ease-out'
        };
      }
    };

    const closeInfoPanel = () => {
      // Animate panel out
      panelStyle.value = {
        transform: 'translate(-50%, 100%)',
        transition: 'transform 0.3s ease-out'
      };
      overlayStyle.value = {
        opacity: 0,
        transition: 'opacity 0.3s ease-out'
      };
      
      // Actually close the panel after animation
      setTimeout(() => {
        selectedLocation.value = null;
        panelStyle.value = {};
        overlayStyle.value = {};
      }, 300);
    };

    const handleOverlayClick = (event) => {
      // Close the panel when clicking the overlay
      console.log('clicked overlay');
      closeInfoPanel();
    };

    const plotCSVData = async () => {
      const csvData = [
        { Title: "Eli's Dyes", Locations_latitude: 43.069778, Locations_longitude: -76.217361, icon: 'clothing', modalImage: 'News_NYSF', Content: "Tie-Dye Hoodies, Tie-Dye Overalls, Tie-Dye Sweats, Tie-Dye T-shirts, Tie-Dye Socks, Tie-Dye Undies, Tie-Dye Kid Hoodies, Tie-Dye Sun Glasses, Tie-Dye Hats and Tie-Dye dresses" },
        { Title: "Master Gardener", Locations_latitude: 43.07, Locations_longitude: -76.217583, icon: 'garden', modalImage: 'News_NYSF', Content: "" },
        { Title: "State Parks Visiting Center", Locations_latitude: 43.071012, Locations_longitude: -76.216519, modalImage: 'News_NYSF', icon: 'info', Content: "State Parks Information, State Park's Merchandise, New York State Fair Merchandise" },
        { Title: "Cappy Cones", Locations_latitude: 43.072, Locations_longitude: -76.217284, icon: 'icecream', modalImage: 'News_NYSF', Content: "Ice Cream, Milkshakes, Soda, Water, Ice Cream Floats, Ice Cream Sundaes, Banana Splits, Desserts ala mode." },
        { Title: "Happy L", Locations_latitude: 43.073018, Locations_longitude: -76.218671, icon: 'drink', modalImage: 'News_NYSF', Content: "Bubble Tea, Honey Lemon Tea, Smoothies" },
        { Title: "Sweeties Bloomers", Locations_latitude: 43.074015, Locations_longitude: -76.218704, icon: 'food', modalImage: 'News_NYSF', Content: "Blooming onions, ribbon chips, fresh cut french fries, pizza logs, mozzerella sticks, deep fried pretzel bites, deep fried pickles, tater tots, lemonade, soda, water" },
        { Title: "Generations Concessions", Locations_latitude: 43.07502, Locations_longitude: -76.223848, icon: 'restaurant', modalImage: 'News_NYSF', Content: "100% Real Fruit Smoothies, Bubble Fruit Smoothie, Mangonada, Lemonade in 12 fruit options, Bubble Lemonade, Fresh Cut Regular or Mexican Fruit Cup,  Crazy Pineapple, Sweet/Unsweet Tea, Bubble Tea, Fruit Infused Tea, Bursting Boba Bubbles, Fruit Taco, Bubble Fruit Taco, Walking Banana Pudding, Bottled Water Build Your Own Spud with options such as butter, sour cream, 3 different cheese, Ranch, BBQ Sauce, Buffalo Sauce, Broccoli, Onions/Peppers, Corn, Jalapeno, Smoked Sausage, Chicken, Pulled Pork, Bacon, Shrimp, Philly Steak, and more Popular Options: Philly Cheesesteak, Redneck Hog, Buffalo Chicken, Chicken Bacon Ranch, Buffalo Chicken Bacon Ranch, Veggie, Shrimp Daddy, & Mexican Esquite/Elote Fruit Options for Smoothie, Lemonade, & Tea: Strawberry, Lemon, Banana, Pina Colada, Peach, Raspberry, Mango, Pineapple, Green Apple, Watermelon, Wildberry, & more *Samples of Lemonade upon request" },
        { Title: "Tommy C's", Locations_latitude: 43.076053, Locations_longitude: -76.221299, icon: 'clothing', modalImage: 'News_NYSF', Content: "Beer, wine, distilled spirits, mac n cheese(several variations), Lobster Roll, hot dogs, hamburgers (several varieties), pulled pork, sausage, chicken sandwich, French fries(several varieties), coney's, bacon wrapped scallops, fried ravioli, bang bang shrimp, fried fish sandwich, chicken tenders, chicken nuggets, chicken speedi, hot beef sundae, fried PBJ, fried clams, eggplant fries, pretzel bites, breakfast items" }
      ];

      // Store CSV data in localForage for offline use
      await localforage.setItem('csvData', csvData);

      const storedData = await localforage.getItem('csvData') || csvData;

      // Map icon URLs to icons
      const iconMap = {
        clothing: '/icons/shirt.png',
        garden: '/icons/fairgroundsl.png',
        info: '/icons/chicken-icon.png',
        icecream: '/icons/pig.png',
        drink: '/icons/chicken-icon.png',
        food: '/icons/pig.png',
        restaurant: '/icons/shirt.png'
      };

      storedData.forEach(item => {
        if (item.Locations_latitude && item.Locations_longitude) {
          const icon = L.icon({
            iconUrl: iconMap[item.icon] || '/icons/fairgroundsl.png',
            iconSize: [42, 42],
            iconAnchor: [21, 42],
            popupAnchor: [0, -42]
          });

          const marker = L.marker([item.Locations_latitude, item.Locations_longitude], {icon: icon}).addTo(map);
          // marker.bindPopup(`<b>${item.Title}</b><br>${item.Content}`, { className: 'wider-popup'});

          // Instead of bindPopup, we now use click event to show info panel
          marker.on('click', () => {
            selectedLocation.value = item;
            console.log('clicked item', item);
            // Initialize panel position below screen and animate up
            panelStyle.value = {
              transform: 'translate(-50%, 100%)',
              transition: 'none'
            };
            // Force a reflow to ensure the initial position is set
            requestAnimationFrame(() => {
              panelStyle.value = {
                transform: 'translate(-50%, 0)',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              };
              overlayStyle.value = {
                opacity: 0.2,
                transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              };
            });
            // Optional: Pan map slightly up to ensure marker is visible above panel
            map.panTo([item.Locations_latitude - 0.001, item.Locations_longitude]);
          });
        }
      });
    };

    onMounted(() => {
      window.addEventListener('online', updateOnlineStatus);
      window.addEventListener('offline', updateOnlineStatus);
      initMap();
      
      // Debug storage on mount
      if (navigator.storage && navigator.storage.estimate) {
        navigator.storage.estimate().then(estimate => {
          const usage = (estimate.usage / 1024 / 1024).toFixed(2);
          const quota = (estimate.quota / 1024 / 1024).toFixed(2);
          console.log(`Initial storage usage: ${usage}MB out of ${quota}MB`);
        });
      }
    });

    onUnmounted(() => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      if (map) {
        map.remove();
      }
    });

    return { progress, total, isOnline, selectedLocation, closeInfoPanel, handleOverlayClick, panelStyle, overlayStyle, handleTouchStart, handleTouchMove, handleTouchEnd };
  }
};
</script>

<style>
@import 'leaflet/dist/leaflet.css';

ion-content {
  --padding-top: 10px;
  --padding-bottom: 10px;
  --padding-start: 10px;
  --padding-end: 10px;
}

#map {
  border-radius: 10px;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.leaflet-pane {
  width: 100%;
}

.wider-popup {
  max-width: 250px;
}

.status-bar {
  position: fixed;
  top: 100px;
  right: 10px;
  padding: 8px 16px;
  border-radius: 4px;
  z-index: 1000;
  font-weight: bold;
}

.status-bar.online {
  background-color: #4caf4fd1;
  color: white;
  font-size: 12px;
  backdrop-filter: blur(5px);
}

.status-bar.offline {
  background-color: #f44336d9;
  color: white;
  font-size: 12px;
  backdrop-filter: blur(5px);
}

/* Add styles for Ionicons in Leaflet controls */
.leaflet-control-savetiles .ion-icon {
  font-size: 18px;
  vertical-align: middle;
}


 /* Information panel styles */
.drag-handle {
  width: 100%;
  height: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
}

.drag-handle-line {
  width: 40px;
  height: 4px;
  background-color: #666;
  border-radius: 2px;
}

.info-panel {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 600px;
  background: rgb(21, 21, 21);
  border-radius: 10px;
  box-shadow: 0 -1px 12px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  padding: 16px;
  margin-bottom: 20px;
  max-height: 50vh; /* Changed from 450px to be responsive */
  overflow-y: auto; /* Changed from scroll */
  touch-action: pan-y; /* Allow vertical scrolling */
  user-select: none;
  -webkit-overflow-scrolling: touch; /* For smooth scrolling on iOS */
}

 /* Add styles for the overlay */
 .modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 999; /* Just below the modal */
  backdrop-filter: blur(1px);
  transition: opacity 0.3s ease-out;
}

.info-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.info-panel-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #fff;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 4px 8px;
  color: #666;
}

.info-panel-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.location-icon {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  object-fit: contain;
}

.location-details {
  flex: 1;
}

.location-details p {
  margin: 0;
  color: #ffffffc2;
  line-height: 1.5;
}

/* Remove the previous slide animations since we're handling transitions in JS now */
.slide-enter-active,
.slide-leave-active,
.slide-enter-to,
.slide-leave-to,
.slide-enter-from,
.slide-leave-from {
  transition: none;
}
</style>