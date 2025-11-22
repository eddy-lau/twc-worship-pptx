<template>
  <div class="form-with-preview">
    <!-- Left Column: Form -->
    <form class="form-column">
      <div class="form-section">
        <label for="songName" class="form-label">
          <i class="fas fa-music me-1"></i>歌名
        </label>
        <div class="input-group">
          <input type="text" class="form-control" id="songName" v-model="name" placeholder="(請貼上歌名)">
          <button class="btn btn-outline-primary" :disabled="isSearching || name === undefined || name.length == 0"
            @click.prevent="search()">
            <span v-if="isSearching" class="spinner-border spinner-border-sm me-1" role="status"
              aria-hidden="true"></span>
            <i class="fas fa-search me-1"></i>搜尋歌詞
          </button>
        </div>
      </div>
      <div class="form-group">
        <label for="lyrics" class="form-label">
          <i class="fas fa-align-left me-1"></i>歌詞
        </label>
        <textarea class="form-control" id="lyrics" v-model="lyrics" ref="lyricsElement" placeholder="(請貼上歌詞)"
          rows="10"></textarea>

        <div class="form-group my-1">
          <button type="button" class="btn btn-outline-success btn-sm my-1 mx-1" @click="addMarker('1')"
            :disabled="disableMarkerButton">第1節</button>
          <button type="button" class="btn btn-outline-success btn-sm my-1 mx-1" @click="addMarker('2')"
            :disabled="disableMarkerButton">第2節</button>
          <button type="button" class="btn btn-outline-success btn-sm my-1 mx-1" @click="addMarker('3')"
            :disabled="disableMarkerButton">第3節</button>
          <button type="button" class="btn btn-outline-success btn-sm my-1 mx-1" @click="addMarker('C')"
            :disabled="disableMarkerButton">副歌</button>
          <button type="button" class="btn btn-outline-success btn-sm my-1 mx-1" @click="addMarker('B')"
            :disabled="disableMarkerButton">Bridge</button>
          <button type="button" class="btn btn-outline-success btn-sm my-1 mx-1" @click="addPageBreak()"
            :disabled="disablePageBreakButton">新頁</button>
          <button type="button" class="btn btn-outline-primary btn-sm my-1 mx-1" @click="replaceChar()">你 > 祢</button>
          <button type="button" class="btn btn-outline-primary btn-sm my-1 mx-1" @click="formatText()">整理歌詞</button>
        </div>
      </div>
      <div class="form-group">
        <label for="copyright" class="form-label">
          <i class="fas fa-copyright me-1"></i>版權
        </label>
        <textarea class="form-control copyright-input" id="copyright" v-model="copyright" rows="5"
          placeholder="(請貼上版權內容)">
        </textarea>
      </div>
      <div class="form-group">
        <label class="form-label">
          <i class="fas fa-image me-1"></i>背景圖片 (可選)
        </label>
        <div class="background-selector">
          <button type="button" class="btn btn-outline-primary background-btn" @click="openBackgroundModal">
            <i class="fas fa-palette me-2"></i>選擇背景圖片
          </button>

          <div v-if="selectedBackground" class="selected-background">
            <div class="selected-preview">
              <img v-if="selectedBackground.type === 'stock'"
                :src="`${baseUrl}stock-backgrounds/${selectedBackground.value}`" alt="Selected background">
              <div v-else class="custom-image-placeholder">
                <i class="fas fa-image"></i>
                <span>{{ selectedBackground.name }}</span>
              </div>
            </div>
            <div class="selected-info">
              <span class="selected-label">{{ selectedBackground.label }}</span>
              <button type="button" class="btn btn-sm btn-outline-danger" @click="clearBackground()">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Background Modal Teleported to Body -->
      <Teleport to="body">
        <!-- Enhanced Background Selection Modal -->
        <div v-if="showBackgroundModal" class="background-modal-overlay" @click="closeBackgroundModal">
          <div class="background-modal" @click.stop>
            <div class="modal-header">
              <h3 class="modal-title">
                <i class="fas fa-palette me-2"></i>選擇背景圖片
              </h3>
              <button type="button" class="modal-close-btn" @click="closeBackgroundModal">
                <i class="fas fa-times"></i>
              </button>
            </div>

            <div class="modal-body">
              <!-- Quick Actions -->
              <div class="quick-actions">
                <button type="button" class="action-btn no-bg-btn" @click="selectNoBackground()">
                  <i class="fas fa-ban"></i>
                  <span>無背景</span>
                </button>
                <button type="button" class="action-btn upload-btn" @click="triggerFileUpload()">
                  <i class="fas fa-upload"></i>
                  <span>上傳圖片</span>
                </button>
                <input type="file" ref="fileInput" accept="image/*" @change="handleFileUpload" style="display: none;">
                <input type="file" ref="backgroundImageInput" accept="image/*" @change="handleFileUpload"
                  style="display: none;">
              </div>

              <!-- Categories -->
              <div class="categories">
                <button v-for="category in categories" :key="category.id" class="category-btn"
                  :class="{ active: activeCategory === category.id }" @click="setActiveCategory(category.id)">
                  <i :class="category.icon"></i>
                  {{ category.name }}
                </button>
              </div>

              <!-- Background Grid -->
              <div class="backgrounds-container">
                <div v-if="filteredBackgrounds.length === 0" class="no-results">
                  <i class="fas fa-search"></i>
                  <p>此分類沒有背景圖片</p>
                </div>
                <div v-else class="backgrounds-grid">
                  <div v-for="bg in filteredBackgrounds" :key="bg.value" class="background-card"
                    :class="{ selected: isSelected(bg) }" @click="selectStockBackground(bg)">
                    <div class="background-preview">
                      <img :src="`${baseUrl}stock-backgrounds/${bg.value}`" :alt="bg.label" @error="handleImageError">
                      <div class="background-overlay">
                        <i class="fas fa-check-circle selected-icon"></i>
                      </div>
                    </div>
                    <div class="background-info">
                      <span class="background-name">{{ bg.label }}</span>
                      <span class="background-category">{{ getCategoryName(bg.category) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeBackgroundModal">取消</button>
              <button type="button" class="btn btn-primary" @click="confirmSelection()">確定</button>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Preview Modal (kept for backward compatibility) -->
      <PreviewModal v-if="showPreviewModal" :show="showPreviewModal" :name="name" :copyright="copyright"
        :lyrics="lyrics" :background-image="previewBackgroundImage" :template="template"
        @close="showPreviewModal = false" />
    </form>

    <!-- Right Column: Live Preview -->
    <div class="preview-column">
      <LivePreview :name="name" :copyright="copyright" :lyrics="lyrics" :background-image="previewBackgroundImage"
        :template="template" />
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref, computed, watch } from 'vue'
import firebase from 'firebase/app';
import 'firebase/functions';
import { Template } from '../modules/pptx/Template';
import PreviewModal from './PreviewModal.vue';
import LivePreview from './LivePreview.vue';

const props = defineProps<{ template: Template }>()
const name = ref('')
const copyright = ref('')
const lyrics = ref('')
const isSearching = ref(false)
const lyricsElement = ref<HTMLTextAreaElement | null>(null)
const disablePageBreakButton = ref(false)
const disableMarkerButton = ref(false)
const backgroundImageInput = ref<HTMLInputElement>()
const uploadedFile = ref<File | null>(null)
const stockedBackground = ref('')
const showBackgroundModal = ref(false)
const showPreviewModal = ref(false)
const previewBackgroundImage = ref<string>('')
const activeCategory = ref('all')
const fileInput = ref<HTMLInputElement>()

// Watch for background changes and update preview
watch([stockedBackground, uploadedFile], async () => {
  try {
    const bg = await getBackgroundImageDataUrl()
    previewBackgroundImage.value = bg || ''
  } catch (e) {
    console.error('Failed to load background for preview', e)
    previewBackgroundImage.value = ''
  }
})


// Enhanced background data with categories
const categories = [
  { id: 'all', name: '全部', icon: 'fas fa-th' },
  { id: 'nature', name: '自然', icon: 'fas fa-leaf' },
  { id: 'abstract', name: '抽象', icon: 'fas fa-shapes' },
  { id: 'worship', name: '敬拜', icon: 'fas fa-pray' },
  { id: 'animated', name: '動畫', icon: 'fas fa-play-circle' }
]

const stockBackgrounds = [
  { value: '163-1630260_footprints-in-the-sand-wallpaper-footprints-in-the.jpg', label: 'Footprints', category: 'nature' },
  { value: '41dNG1AgmIL._SX425_.jpg', label: 'Abstract Blue', category: 'abstract' },
  { value: '640.jpg', label: 'Gradient BG', category: 'abstract' },
  { value: '9c58d46316e99cbe14be3ca4d74ebdae.jpg', label: 'Forest Path', category: 'nature' },
  { value: 'GetMedia.jpg', label: 'Media BG', category: 'abstract' },
  { value: 'Grok Image 2025-04-12 at 7.38.48 PM.png', label: 'Grok Art', category: 'abstract' },
  { value: 'Picture1.jpg', label: 'Church Scene', category: 'worship' },
  { value: 'Picture10.jpg', label: 'Worship Hall', category: 'worship' },
  { value: 'Picture11.jpg', label: 'Sanctuary', category: 'worship' },
  { value: 'Picture4.jpg', label: 'Cross Light', category: 'worship' },
  { value: 'Picture6.jpg', label: 'Prayer', category: 'worship' },
  { value: 'Picture7.jpg', label: 'Altar', category: 'worship' },
  { value: 'Picture8.jpg', label: 'Chapel', category: 'worship' },
  { value: 'Picture9.jpg', label: 'Worship Space', category: 'worship' },
  { value: 'animated01.gif', label: 'Animated 1', category: 'animated' },
  { value: 'animated02.gif', label: 'Animated 2', category: 'animated' },
  { value: 'hd-road-editing-background-11560093640sgzwr0aeo0.jpg', label: 'HD Road', category: 'nature' },
  { value: 'itl.cat_wallpapersafari_248797.png', label: 'Cat', category: 'nature' },
  { value: 'worship2.jpg', label: 'Worship 2', category: 'worship' }
]

// Computed properties
const filteredBackgrounds = computed(() => {
  if (activeCategory.value === 'all') {
    return stockBackgrounds
  }
  return stockBackgrounds.filter(bg => bg.category === activeCategory.value)
})

const selectedBackground = computed(() => {
  if (stockedBackground.value) {
    const bg = stockBackgrounds.find(b => b.value === stockedBackground.value)
    return bg ? { type: 'stock', value: bg.value, label: bg.label, name: bg.label } : null
  }
  if (uploadedFile.value) {
    return { type: 'custom', value: uploadedFile.value, label: uploadedFile.value.name, name: uploadedFile.value.name }
  }
  return null
})


const wrap = (line: string) => {
  if (!props.template) {
    return ''
  }
  const max_line_length = props.template.lyricsMaxLineLength

  if (line.length <= max_line_length) {
    return [line];
  }

  let lastChar = line.match(/[  ,，.。;；]$/);
  if (lastChar) {
    line = line.substring(0, lastChar.index);
  }

  let result: string[] = [];

  let firstPart = '';
  let secondPart = '';

  let firstMatch = line.substring(0, max_line_length).match(/.+[  ,，.。;；]/);
  if (!firstMatch) {

    firstPart = line.substring(0, max_line_length);
    secondPart = line.substring(max_line_length);

  } else {

    firstPart = firstMatch[0];
    secondPart = line.substring(firstMatch[0].length);
  }

  if (lastChar) {
    secondPart = secondPart + lastChar[0];
  }

  result = result.concat(firstPart);
  result = result.concat(secondPart);

  return result;
}

const formatText = () => {
  let lines = lyrics.value.split('\n');
  lines = lines
    .map(l => l.trim())
    .reduce((r, l) => {
      if (l.length === 0 && r[r.length - 1].length === 0) {
        return r
      }
      r.push(l)
      return r
    }, [] as string[])
    .reduce((r, l) => {
      return r.concat(wrap(l))
    }, [] as string[])
  lyrics.value = lines.join('\n');
}

const replaceChar = () => {
  lyrics.value = lyrics.value.replaceAll('你', '祢')
}

const search = () => {
  isSearching.value = true;
  const searchLyrics = firebase.functions().httpsCallable('searchLyrics');
  searchLyrics(name.value).then(result => {
    if (result.data && result.data.lyrics) {
      lyrics.value = result.data.lyrics;
      copyright.value = result.data.copyright;
      formatText();
    }
    isSearching.value = false;
  }).catch(err => {
    alert(err.toString());
    isSearching.value = false;
  })
}

function pageBreakPosition() {

  if (!lyricsElement.value) {
    return -1
  }

  const cursorPos = lyricsElement.value.selectionStart
  const lyricsText = lyrics.value

  if (cursorPos === 0) {
    // no effect at the beginning of text
    return -1
  }

  // find line start position
  let pos = lyricsText.lastIndexOf('\n', cursorPos - 1)
  pos = pos < 0 ? lyricsText.lastIndexOf('\r', cursorPos - 1) : pos

  if (pos < 0) {
    // first line
    return -1
  }

  const text = lyricsText.substring(pos + 1)
  const marker = /^[\da-zA-Z]\s/
  if (text.match(marker)) {
    // already have marker
    return -1
  }

  const pageBreak = /^\s*[\n\r]/
  if (text.match(pageBreak)) {
    // already have page break
    return -1
  }

  // find previous line
  if (pos > 0) {
    let prevLinePos = lyricsText.lastIndexOf('\r', pos - 1)
    prevLinePos = prevLinePos < 0 ? lyricsText.lastIndexOf('\n', pos - 1) : prevLinePos
    const previousLine = lyricsText.substring(prevLinePos + 1)
    if (previousLine.match(pageBreak)) {
      return -1
    }

  }

  return pos + 1

}

function addPageBreak() {

  const pos = pageBreakPosition()
  if (pos < 0) {
    return
  }

  const lyricsText = lyrics.value
  lyrics.value = lyricsText.slice(0, pos) + `\n${lyricsText.slice(pos)}`
}

function mark(marker: string, text: string) {

  const regex = /^[\da-zA-Z]\s/
  if (text.match(regex)) {
    return text.replace(regex, `${marker} `)
  }

  return `${marker} ${text}`
}

function addMarker(marker: string) {

  if (!lyricsElement.value) {
    return
  }

  const cursorPos = lyricsElement.value.selectionStart
  const lyricsText = lyrics.value

  if (cursorPos === 0) {
    lyrics.value = mark(marker, lyricsText)
    return
  }

  let pos = lyricsText.lastIndexOf('\n', cursorPos - 1)
  pos = pos < 0 ? lyricsText.lastIndexOf('\r', cursorPos - 1) : pos

  if (pos < 0) {
    // first line
    lyrics.value = mark(marker, lyricsText)
    return
  }

  lyrics.value = lyricsText.slice(0, pos + 1) + mark(marker, lyricsText.slice(pos + 1))

}

const getBackgroundImageDataUrl = async (): Promise<string | undefined> => {
  if (stockedBackground.value) {
    return `${import.meta.env.BASE_URL}stock-backgrounds/${stockedBackground.value}`;
  }
  if (uploadedFile.value) {
    const file = uploadedFile.value;
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas not supported'));
            return;
          }
          // Resize to fit within 1920x1080 while maintaining aspect ratio
          const maxWidth = 1920;
          const maxHeight = 1080;
          let { width, height } = img;
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8); // Compress to JPEG with 80% quality
          resolve(dataUrl);
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = reader.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }
  return undefined;
}

const selectNoBackground = () => {
  stockedBackground.value = '';
  uploadedFile.value = null;
  if (backgroundImageInput.value) {
    backgroundImageInput.value.value = '';
  }
}

const selectStockBackground = (bg: any) => {
  stockedBackground.value = bg.value;
  uploadedFile.value = null;
  if (backgroundImageInput.value) {
    backgroundImageInput.value.value = '';
  }
}

const triggerFileUpload = () => {
  if (backgroundImageInput.value) {
    backgroundImageInput.value.click();
  }
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    uploadedFile.value = target.files[0];
    // Clear stock selection when uploading file
    stockedBackground.value = '';

    // Close the modal after successful upload
    showBackgroundModal.value = false;
  }
}

const setActiveCategory = (categoryId: string) => {
  activeCategory.value = categoryId;
}

const getCategoryName = (categoryId: string) => {
  const category = categories.find(c => c.id === categoryId);
  return category ? category.name : categoryId;
}

const isSelected = (bg: any) => {
  return stockedBackground.value === bg.value;
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Q0E0QUYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBFcnJvcjwvdGV4dD4KPC9zdmc+';
}

const clearBackground = () => {
  stockedBackground.value = '';
  uploadedFile.value = null;
  if (backgroundImageInput.value) {
    backgroundImageInput.value.value = '';
  }
}

const openBackgroundModal = () => {
  showBackgroundModal.value = true;
}

const closeBackgroundModal = () => {
  showBackgroundModal.value = false;
}

const confirmSelection = () => {
  showBackgroundModal.value = false;
}

const baseUrl = ''

defineExpose({ name, lyrics, copyright, getBackgroundImageDataUrl })
</script>

<style scoped>
/* Two-Column Layout */
.form-with-preview {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 2rem;
  height: 100%;
  max-width: 100%;
}

.form-column {
  overflow-y: auto;
  padding-right: 1rem;
}

.preview-column {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
}

/* Responsive: Stack on smaller screens */
@media (max-width: 1200px) {
  .form-with-preview {
    grid-template-columns: 1fr;
  }

  .preview-column {
    position: relative;
    height: 600px;
    margin-top: 2rem;
  }
}

.stock-backgrounds-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
}

.stock-bg-item {
  cursor: pointer;
  text-align: center;
  padding: 5px;
  border-radius: 5px;
  transition: border-color 0.2s;
}

.stock-bg-item.selected {
  border: 2px solid #28a745;
  background-color: #f8f9fa;
}

.stock-bg-item img {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 3px;
}

.stock-bg-item small {
  display: block;
  margin-top: 5px;
  font-size: 0.8em;
  color: #666;
}

/* Modern Form Styles */
.form-section {
  margin-bottom: 2rem;
}

.form-label {
  font-weight: 600;
  color: var(--dark-text);
  margin-bottom: 0.5rem;
  display: block;
}

.lyrics-textarea {
  font-family: 'Courier New', monospace;
  line-height: 1.5;
  resize: vertical;
  min-height: 200px;
}

.lyrics-controls {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.lyrics-controls .btn {
  margin: 0.125rem;
  white-space: nowrap;
}

.copyright-input {
  font-size: 0.875rem;
  font-family: 'Courier New', monospace;
}

/* Background selection styles */
.background-selection {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.background-status {
  font-size: 0.875rem;
  font-weight: 500;
}

/* Modal improvements */
.modal-content {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
}

.modal-header {
  border-bottom: 1px solid #dee2e6;
}

.modal-body {
  padding: 1rem;
}

@media (max-width: 768px) {
  .lyrics-controls .btn {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
  }

  .stock-backgrounds-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    max-height: 300px;
  }
}

/* Background Selector */
.background-selector {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.background-btn {
  align-self: flex-start;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.selected-background {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px solid #e9ecef;
}

.selected-preview {
  width: 60px;
  height: 45px;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #dee2e6;
}

.selected-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.custom-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  color: #6c757d;
  font-size: 0.75rem;
}

.custom-image-placeholder i {
  font-size: 1rem;
  margin-bottom: 2px;
}

.selected-info {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.selected-label {
  font-weight: 500;
  color: #495057;
}

/* Enhanced Modal Styles */
.background-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  backdrop-filter: blur(2px);
}

.background-modal {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 900px;
  width: 95%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.modal-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.modal-close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.modal-close-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.modal-body {
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
}

/* Quick Actions */
.quick-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.action-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem 1rem;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  background: #f8f9fa;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  border-color: #007bff;
  background: #e7f3ff;
  color: #007bff;
}

.action-btn i {
  font-size: 1.5rem;
}

.upload-btn {
  border-color: #28a745;
}

.upload-btn:hover {
  border-color: #28a745;
  background: #e8f5e8;
  color: #28a745;
}

/* Categories */
.categories {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.category-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #dee2e6;
  border-radius: 20px;
  background: white;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.category-btn:hover {
  border-color: #007bff;
  color: #007bff;
}

.category-btn.active {
  background: #007bff;
  border-color: #007bff;
  color: white;
}

/* Backgrounds Container */
.backgrounds-container {
  min-height: 300px;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #6c757d;
}

.no-results i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

/* Backgrounds Grid */
.backgrounds-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

.background-card {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid transparent;
  transition: all 0.2s ease;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.background-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.background-card.selected {
  border-color: #28a745;
  box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.2);
}

.background-preview {
  position: relative;
  width: 100%;
  height: 120px;
  overflow: hidden;
}

.background-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.2s ease;
}

.background-card:hover .background-preview img {
  transform: scale(1.05);
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(40, 167, 69, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.background-card.selected .background-overlay {
  opacity: 1;
}

.selected-icon {
  color: white;
  font-size: 2rem;
}

.background-info {
  padding: 0.75rem;
  background: white;
}

.background-name {
  display: block;
  font-weight: 500;
  color: #495057;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.background-category {
  display: block;
  font-size: 0.75rem;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  background: #f8f9fa;
}

/* Responsive Design */
@media (max-width: 768px) {
  .background-modal {
    width: 98%;
    max-height: 95vh;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }

  .quick-actions {
    flex-direction: column;
  }

  .categories {
    justify-content: center;
  }

  .backgrounds-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.75rem;
  }

  .selected-background {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}
</style>
