<template>
  <div class="live-preview-container" :class="{ 'is-empty': isAllEmpty }">
    <div class="preview-header">
      <h4 class="preview-title">
        <i class="fas fa-eye me-2"></i>即時預覽
      </h4>
    </div>

    <div class="preview-body">
      <!-- Placeholder when all fields are empty -->
      <div v-if="isAllEmpty" class="preview-placeholder">
        <div class="placeholder-content">
          <i class="fas fa-music placeholder-icon"></i>
          <h5 class="placeholder-title">開始創建您的詩歌 PPT</h5>
          <p class="placeholder-text">
            請在左側輸入歌名、歌詞和版權信息<br>
            預覽將會即時顯示在這裡
          </p>
          <div class="placeholder-features">
            <div class="feature-item">
              <i class="fas fa-check-circle"></i>
              <span>即時預覽</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-check-circle"></i>
              <span>自動排版</span>
            </div>
            <div class="feature-item">
              <i class="fas fa-check-circle"></i>
              <span>背景自訂</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Actual preview slides -->
      <div v-else class="slides-container" ref="containerRef">
        <div v-for="(slide, index) in slides" :key="index" class="slide-preview" :style="slideStyle">
          <!-- Background -->
          <div class="slide-background">
            <img v-if="backgroundImage" :src="backgroundImage" alt="Background" />
            <div v-else class="default-background"></div>
          </div>

          <!-- Logos (outside background so they position relative to slide) -->
          <img src="/ccma_twc_logo-BqU4bmAt.png" class="logo-ccma" alt="CCMA Logo"
            :style="{ width: logoCCMASize, height: logoCCMASize }" />
          <img src="/twc_logo.png" class="logo-twc" alt="TWC Logo"
            :style="{ width: logoTWCWidth, height: logoTWCHeight }" />

          <!-- Overlay (for text readability if needed, based on template) -->
          <div v-if="template.lyricsBackgroundTransparency < 100" class="text-overlay" :style="overlayStyle">
          </div>

          <!-- Content -->
          <div class="slide-content">
            <!-- Song Cover Slide -->
            <div v-if="slide.type === 'cover'" class="cover-content">
              <div class="song-name" :style="getStyle(template.songNameCoords, 36)">
                【{{ name }}】
              </div>
              <div v-if="copyright" class="copyright" :style="getStyle(template.copyrightCoords, 24)">
                {{ copyright }}
              </div>
            </div>

            <!-- Lyrics Slide -->
            <div v-else class="lyrics-content">
              <div v-if="slide.marker" class="marker" :style="getStyle(template.markerCoords, 22)">
                {{ slide.marker }}
              </div>
              <div class="lyrics-text" :style="getLyricsStyle(slide)">
                {{ slide.text }}
              </div>
            </div>
          </div>

          <div class="slide-number">{{ index + 1 }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs, CSSProperties, ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { Template } from '../modules/pptx/Template'

const props = defineProps<{
  name: string
  copyright: string
  lyrics: string
  backgroundImage?: string
  template: Template
}>()

const { name, copyright, lyrics, backgroundImage, template } = toRefs(props)

// Check if all input fields are empty
const isAllEmpty = computed(() => {
  return !name.value.trim() && !lyrics.value.trim() && !copyright.value.trim()
})

// Track container width for accurate scaling
const containerRef = ref<HTMLElement | null>(null)
const containerWidth = ref(800) // Default width

const updateContainerWidth = () => {
  if (containerRef.value) {
    containerWidth.value = containerRef.value.offsetWidth
  }
}

onMounted(() => {
  updateContainerWidth()
  window.addEventListener('resize', updateContainerWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateContainerWidth)
})

// Watch for changes in empty state and update container width
watch(isAllEmpty, async () => {
  await nextTick() // Wait for DOM to update
  updateContainerWidth()
})

// PPT is 10 inches wide at 96 DPI = 960 pixels
// Calculate scale factor based on actual container width
const scaleFactor = computed(() => containerWidth.value / 960)

const slideStyle = computed((): CSSProperties => ({
  aspectRatio: '16/9',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: '#000',
  marginBottom: '1.5rem',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  borderRadius: '8px'
}))

const overlayStyle = computed((): CSSProperties => {
  const t = template.value
  return {
    position: 'absolute',
    left: '0%',
    top: t.masterTextY as string,
    width: '100%',
    height: '33.3%',
    backgroundColor: '#6666FF',
    opacity: (100 - t.lyricsBackgroundTransparency) / 100
  }
})

// Logo sizes in pixels (inches * 96 DPI * scale factor)
const logoCCMASize = computed(() => {
  const inches = 0.98
  return `${inches * 96 * scaleFactor.value}px`
})

const logoTWCWidth = computed(() => {
  const inches = (186 / 104) * 0.7 // ≈ 1.25 inches
  return `${inches * 96 * scaleFactor.value}px`
})

const logoTWCHeight = computed(() => {
  const inches = 0.7
  return `${inches * 96 * scaleFactor.value}px`
})

const getStyle = (coords: any, fontSizePt: number = 36): CSSProperties => {
  if (!coords) return {}
  // Convert points to pixels with adjusted multiplier for better preview accuracy
  const fontSizePx = fontSizePt * 1.2 * scaleFactor.value
  return {
    position: 'absolute',
    left: coords.x,
    top: coords.y,
    width: coords.w,
    height: coords.h,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: `${fontSizePx}px`,
    fontWeight: 600, // Semi-bold instead of bold for better readability
    // Simulate PPT glow and shadow effects with multiple text-shadows
    // Glow effect (black, size 10px, opacity 1.0) - matches PPT exactly
    // Outer shadow (gray, 45-degree angle, offset 3px, blur 3px, reduced opacity)
    textShadow: `
      0px 0px 0px rgba(0,0,0,1.0),
      0px 0px 5px rgba(0,0,0,1.0),
      0px 0px 10px rgba(0,0,0,1.0),
      0px 0px 15px rgba(0,0,0,0.8),
      0px 0px 20px rgba(0,0,0,0.6),
      3px 3px 6px rgba(127,127,127,0.25)
    `,
    whiteSpace: 'pre-wrap'
  }
}

const getLyricsStyle = (slide: any): CSSProperties => {
  const baseStyle = getStyle(template.value.lyricsCoords, 36) // Lyrics use 36pt
  if (slide.marker && template.value.markerCoords) {
    const markerH = parseFloat(template.value.markerCoords.h as string)
    const currentY = parseFloat(template.value.lyricsCoords.y as string)
    baseStyle.top = `${markerH + currentY}%`
  }
  return baseStyle
}

const slides = computed(() => {
  const result: any[] = []
  const PAGE_BREAK = '--page-break--'

  // 1. Cover Slide
  result.push({ type: 'cover' })

  // 2. Lyrics Slides
  if (!lyrics.value) return result

  let lines = lyrics.value.split('\n')
    .map(line => line.trim())
    .map(line => line.length === 0 ? PAGE_BREAK : line)
    .filter(line => line.length > 0)

  let lineCount = 0
  let text = ''

  const addSlide = (txt: string) => {
    const markers: { [key: string]: string } = {
      'b': 'Bridge', 'B': 'Bridge',
      'c': '副歌', 'C': '副歌'
    }

    let marker = ''
    let content = txt

    if (txt.match(/^[a-zA-Z]/) && template.value.markerCoords) {
      const char = txt.charAt(0)
      if (markers[char]) {
        marker = markers[char]
        content = txt.replace(/^[a-zA-Z]/, '')
      }
    }

    result.push({
      type: 'lyrics',
      text: content,
      marker
    })
  }

  for (const line of lines) {
    if (line === PAGE_BREAK) {
      if (text) {
        addSlide(text)
      }
      text = ''
      lineCount = 0
      continue
    }

    if (line.match(/^[\d副a-zA-Z]/) || lineCount == template.value.maxLinesPerSlide) {
      if (text) {
        addSlide(text)
      }
      text = ''
      lineCount = 0
    }

    if (lineCount == 0) {
      text = line
    } else {
      text += '\n' + line
    }
    lineCount++
  }

  if (text) {
    addSlide(text)
  }

  return result
})

</script>

<style scoped>
.live-preview-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.live-preview-container.is-empty {
  height: auto;
  max-height: 400px;
}

.preview-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e9ecef;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.preview-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  color: white;
}

.preview-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
  background: #e9ecef;
}

.slides-container {
  max-width: 100%;
}

.slide-preview {
  background: white;
  border: 1px solid #dee2e6;
}

.slide-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.slide-background img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-background {
  width: 100%;
  height: 100%;
  background: #0000FF;
}

.logo-ccma {
  position: absolute;
  top: 3%;
  left: 3%;
  object-fit: contain;
  z-index: 1;
}

.logo-twc {
  position: absolute;
  top: 5%;
  right: 3%;
  object-fit: contain;
  z-index: 1;
}

.slide-content {
  position: relative;
  z-index: 10;
  width: 100%;
  height: 100%;
}

.slide-number {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  z-index: 20;
}

/* Placeholder Styles */
.preview-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 210px;
  padding: 1rem 0.5rem;
}

.placeholder-content {
  text-align: center;
  padding: 1rem 1rem;
  max-width: 280px;
}

.placeholder-icon {
  font-size: 2.1rem;
  color: #667eea;
  margin-bottom: 0.7rem;
  opacity: 0.8;
}

.placeholder-title {
  color: #495057;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.placeholder-text {
  color: #6c757d;
  margin-bottom: 1rem;
  line-height: 1.4;
  font-size: 0.75rem;
}

.placeholder-features {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  align-items: center;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #495057;
  font-size: 0.7rem;
}

.feature-item i {
  color: #28a745;
  font-size: 0.75rem;
}
</style>
