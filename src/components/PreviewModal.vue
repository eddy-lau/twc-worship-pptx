<template>
  <Teleport to="body">
    <div v-if="show" class="preview-modal-overlay" @click="close">
      <div class="preview-modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">
            <i class="fas fa-eye me-2"></i>預覽 PPT
          </h3>
          <button type="button" class="modal-close-btn" @click="close">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <div class="slides-container">
            <div v-for="(slide, index) in slides" :key="index" class="slide-preview" :style="slideStyle">
              <!-- Background -->
              <div class="slide-background">
                <img v-if="backgroundImage" :src="backgroundImage" alt="Background" />
                <div v-else class="default-background"></div>
              </div>

              <!-- Overlay (for text readability if needed, based on template) -->
              <div v-if="template.lyricsBackgroundTransparency < 100" class="text-overlay" :style="overlayStyle">
              </div>

              <!-- Content -->
              <div class="slide-content">
                <!-- Song Cover Slide -->
                <div v-if="slide.type === 'cover'" class="cover-content">
                  <div class="song-name" :style="getStyle(template.songNameCoords)">
                    【{{ name }}】
                  </div>
                  <div v-if="copyright" class="copyright" :style="getStyle(template.copyrightCoords)">
                    {{ copyright }}
                  </div>
                </div>

                <!-- Lyrics Slide -->
                <div v-else class="lyrics-content">
                  <div v-if="slide.marker" class="marker" :style="getStyle(template.markerCoords)">
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
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, toRefs, CSSProperties } from 'vue'
import { Template } from '../modules/pptx/Template'

const props = defineProps<{
  show: boolean
  name: string
  copyright: string
  lyrics: string
  backgroundImage?: string
  template: Template
}>()

const emit = defineEmits(['close'])
const { show, name, copyright, lyrics, backgroundImage, template } = toRefs(props)

const close = () => {
  emit('close')
}

const slideStyle = computed((): CSSProperties => ({
  aspectRatio: '16/9',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: '#000',
  marginBottom: '2rem',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  borderRadius: '8px'
}))

const overlayStyle = computed((): CSSProperties => {
  const t = template.value
  // Convert pptxgen coords to CSS
  // Assuming masterTextY is top % and h is height %
  // The logic in PPTGenerator for rect is:
  // y: template.masterTextY
  // h: (1273-946)/(1273-291)*100  <-- This seems hardcoded in PPTGenerator.ts line 33
  // Let's approximate or use the logic from PPTGenerator if possible.
  // In PPTGenerator: h = (1273-946)/(1273-291)*100 approx 33.3%?
  // Wait, (1273-946) = 327. (1273-291) = 982. 327/982 = 0.333. So 33.3%.

  // But wait, the template object has specific coords.
  // Let's look at Template.ts again.
  // "兩行文字在下方": masterTextY: '66%', lyricsCoords: { y: '67%', h: '28%' }

  return {
    position: 'absolute',
    left: '0%',
    top: t.masterTextY as string,
    width: '100%',
    height: '33.3%', // Approximate based on PPTGenerator logic
    backgroundColor: '#6666FF',
    opacity: (100 - t.lyricsBackgroundTransparency) / 100
  }
})

const getStyle = (coords: any): CSSProperties => {
  if (!coords) return {}
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
    fontSize: '1.5rem', // Scale down for preview
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    whiteSpace: 'pre-wrap'
  }
}

const getLyricsStyle = (slide: any): CSSProperties => {
  const baseStyle = getStyle(template.value.lyricsCoords)
  if (slide.marker && template.value.markerCoords) {
    // Adjust Y if marker exists, similar to PPTGenerator
    // In PPTGenerator: y = markerHeight + lyricsCoords.y
    // We can try to approximate this or just let them stack if we use flexbox inside a container?
    // But here we are using absolute positioning.
    // Let's just add the marker height to the top.
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
.preview-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  backdrop-filter: blur(5px);
}

.preview-modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 1000px;
  height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f9fa;
}

.modal-body {
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
  background: #e9ecef;
}

.slides-container {
  max-width: 800px;
  margin: 0 auto;
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
  /* Fallback blue */
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

.modal-close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
}

.modal-close-btn:hover {
  color: #343a40;
}
</style>
