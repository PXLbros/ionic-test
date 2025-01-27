<template>
  <ion-page>
    <ion-header>
      <ion-toolbar :translucent="true">
        <ion-buttons slot="start">
          <ion-back-button default-href="/fair/plan-your-visit"></ion-back-button>
        </ion-buttons>
        <ion-title>FAQ</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <!-- Notification Banner -->
      <div class="notification" v-if="showNotification">
        FAQ Section Brown at Full Capacity...
      </div>

      <div class="main">
        <div class="main__image">
          <svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none">
            <path d="M62 55.1111V6.88889C62 3.1 58.9 0 55.1111 0H6.88889C3.1 0 0 3.1 0 6.88889V55.1111C0 58.9 3.1 62 6.88889 62H55.1111C58.9 62 62 58.9 62 55.1111ZM18.9444 36.1667L27.5556 46.5344L39.6111 31L55.1111 51.6667H6.88889L18.9444 36.1667Z" fill="#1E5EAE"/>
          </svg>
        </div>

        <div class="main__content">
          <h1 class="main__content-title">{{ faqPageData.title }}</h1>
          <p class="main__content-text">
            Find answers to frequently asked questions about the New York State Fair.
          </p>
        </div>

        <div class="expandable-sections">
          <div
            v-for="(section, index) in faqSections"
            :key="index"
            class="expandable-section"
            @click="toggleSection(index)"
          >
            <div class="expandable-section__header">
              <h2>{{ section.title }}</h2>
              <svg
                class="expandable-section__icon"
                :class="{ 'expanded': section.isExpanded }"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 9L12 15L18 9" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div
              v-show="section.isExpanded"
              class="expandable-section__content"
              v-html="section.content"
            >
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonContent, IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton } from '@ionic/vue';
import { ref, onMounted } from 'vue';
import { useDataStore } from '@/stores/data';

interface FAQSection {
  title: string;
  content: string;
  isExpanded: boolean;
}

interface FAQPageData {
  title: string;
  content: string;
  updatedAt: string;
}

const dataStore = useDataStore();
const showNotification = ref(true);
const faqPageData = ref<FAQPageData>({
  title: 'FAQ',
  content: '',
  updatedAt: ''
});

const faqSections = ref<FAQSection[]>([]);

// Improved HTML content parser
// New parsing function for your Vue component
const parseHTMLContent = (htmlContent: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const sections: FAQSection[] = [];

  // Find all h3 elements (question headers)
  const questions = doc.querySelectorAll('h3');

  questions.forEach((question) => {
    let content = '';
    let currentNode = question.nextElementSibling;

    // Collect all content until the next h3 or the end
    while (currentNode && currentNode.tagName !== 'H3') {
      const text = currentNode.textContent?.trim();
      if (text) {
        content += text + ' ';
      }
      currentNode = currentNode.nextElementSibling;
    }

    // Clean the question text:
    // 1. Remove bullet points (• or · or any other bullet character)
    // 2. Remove non-breaking spaces (&nbsp;)
    // 3. Trim whitespace
    const questionText = question.textContent
      ?.trim()
      .replace(/^[·•\s\u2022\u00b7\-]+|^\s*[·•\u2022\u00b7\-]\s*/g, '')  // More aggressive bullet point removal
      .replace(/&nbsp;|&#8226;/g, '')  // Remove HTML entities
      .trim();

    if (questionText && content.trim()) {
      sections.push({
        title: questionText,
        content: `<p>${content.trim()}</p>`,
        isExpanded: false
      });
    }
  });

  return sections;
};


onMounted(async () => {
  // Get the FAQ page data
  const pageData = dataStore.data.nysfairWebsite.pages['your-visit/faq'];
  if (pageData) {
    faqPageData.value = {
      title: pageData.title,
      content: pageData.content,
      updatedAt: pageData.updatedAt
    };

    // Parse the HTML content into sections
    faqSections.value = parseHTMLContent(pageData.content);
    console.log('Parsed sections:', faqSections.value);
  }
});

const toggleSection = (index: number) => {
  faqSections.value = faqSections.value.map((section, i) => ({
    ...section,
    isExpanded: i === index ? !section.isExpanded : section.isExpanded
  }));
};
</script>

<style lang="scss" scoped>
.notification {
  background-color: #FFF3CD;
  color: #856404;
  padding: 12px 20px;
  text-align: center;
  border-bottom: 1px solid #FFEEBA;
}

.main {
  min-height: calc(100% - 56px);
  display: flex;
  flex-direction: column;
  gap: 24px;


  &__image {
    margin: 30px;
    margin-bottom: 0px;
    background-color: #EFF2F6;
    border-radius: 24px;
    height: 25vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__content {
    padding: 0 30px;

    &-title {
      font-size: 24px;
      font-weight: 700;
      color: #333333;
      margin-bottom: 12px;
    }

    &-text {
      color: #666666;
      line-height: 1.5;
    }
  }
}

.expandable-sections {
  display: flex;
  flex-direction: column;
}

.expandable-section {
  border-top: 1px solid #D9E3ED;
  background: #EEF2F6;

  &:last-child {
    border-bottom: 1px solid #D9E3ED;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    cursor: pointer;

    h2 {
      list-style: none !important;
      font-size: 18px;
      list-style-type: none;
      font-weight: 700;
      color: #333333;
      margin: 0;
      padding-right: 16px;
      &::before {
        content: none;
      }
      &::marker {
        display: none;
      }
    }
  }

  &__icon {
    transition: transform 0.3s ease;
    flex-shrink: 0;

    &.expanded {
      transform: rotate(180deg);
    }
  }

  &__content {
    padding: 0 20px 20px 20px;
    color: #666666;
    line-height: 1.5;

    :deep(p) {
      display: block;

    }
    :deep(p::first-letter) {
      text-transform: capitalize;

    }

    :deep(a) {
      color: #1E5EAE;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    :deep(hr) {
      border: none;
      border-top: 1px solid #D9E3ED;
      margin: 20px 0;
    }

    :deep(strong) {
      font-weight: 600;
      color: #333333;
    }
  }
}
</style>
