<template>
  <form>
    <div class="form-group">
      <label for="songName">歌名</label>
      <div class="input-group">
        <input type="text" class="form-control" id="songName" v-model="name"
        placeholder="(請貼上歌名)">
        <div class="input-group-append">
          <button class="btn btn-outline-primary"
            :disabled="isSearching || name === undefined || name.length == 0"
            @click.prevent="search()">
            <span v-if="isSearching" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            搜尋歌詞
          </button>
        </div>
      </div>
    </div>
    <div class="form-group">
      <label for="lyrics">歌詞</label>
      <textarea class="form-control" id="lyrics" v-model="lyrics"
        ref="lyricsElement"
        placeholder="(請貼上歌詞)"
        rows="10"></textarea>

      <div class="form-group my-1">
        <button type="button" class="btn btn-outline-success btn-sm my-1 mx-1"
        @click="addMarker('1')" :disabled="disableMarkerButton">第1節</button>        
        <button type="button" class="btn btn-outline-success btn-sm my-1 mx-1"
        @click="addMarker('2')" :disabled="disableMarkerButton">第2節</button>
        <button type="button" class="btn btn-outline-success btn-sm my-1 mx-1"
        @click="addMarker('3')" :disabled="disableMarkerButton">第3節</button>
        <button type="button" class="btn btn-outline-success btn-sm my-1 mx-1"
        @click="addMarker('C')" :disabled="disableMarkerButton">副歌</button>
        <button type="button" class="btn btn-outline-success btn-sm my-1 mx-1"
        @click="addMarker('B')" :disabled="disableMarkerButton">Bridge</button>
        <button type="button" class="btn btn-outline-success btn-sm my-1 mx-1"
        @click="addPageBreak()" :disabled="disablePageBreakButton">新頁</button>
        <button type="button" class="btn btn-outline-primary btn-sm my-1 mx-1"
        @click="replaceChar()">你 > 祢</button>
        <button type="button" class="btn btn-outline-primary btn-sm my-1 mx-1"
        @click="formatText()">整理歌詞</button>
    </div>
    </div>
    <div class="form-group">
      <label for="copyright">版權</label>
      <textarea class="form-control copyright-input" id="copyright" v-model="copyright"
        rows="5"
        placeholder="(請貼上版權內容)">
      </textarea>
    </div>
    <div class="form-group">
      <label>背景圖片 (可選)</label>
      <div class="d-flex align-items-center mb-2">
        <button type="button" class="btn btn-outline-primary" data-toggle="modal" data-target="#backgroundModal" @click="modalOpen = true">選擇背景</button>
        <span v-if="stockedBackground" class="ml-2 text-success">已選擇: {{ getSelectedLabel() }}</span>
        <span v-else-if="backgroundImageInput && backgroundImageInput.files && backgroundImageInput.files[0]" class="ml-2 text-success">已上傳: {{ backgroundImageInput.files[0].name }}</span>
        <button v-if="stockedBackground || (backgroundImageInput && backgroundImageInput.files && backgroundImageInput.files[0])" type="button" class="btn btn-outline-secondary btn-sm ml-2" @click="clearBackground()">清除</button>
      </div>
    </div>

    <!-- Background Selection Modal -->
    <div class="modal fade" id="backgroundModal" tabindex="-1" role="dialog" aria-labelledby="backgroundModalLabel" aria-hidden="true" @hidden.bs.modal="modalOpen = false">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="backgroundModalLabel">選擇背景圖片</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <button type="button" class="btn btn-outline-secondary" @click="selectBackground('')">無背景 (預設)</button>
            </div>
            <div class="mb-3">
              <label class="form-label">上傳自訂圖片：</label>
              <input type="file" class="form-control-file" id="backgroundImage" ref="backgroundImageInput" accept="image/*" @change="onFileChange">
            </div>
            <hr>
            <h6>現成背景：</h6>
            <div v-if="modalOpen" class="stock-backgrounds-grid">
              <div v-for="bg in stockBackgrounds" :key="bg.value" 
                   class="stock-bg-item" 
                   :class="{ selected: stockedBackground === bg.value }"
                   @click="selectBackground(bg.value)">
                <img :src="`${baseUrl}stock-backgrounds/${bg.value}`" :alt="bg.label" class="img-thumbnail">
                <small class="text-center d-block">{{ bg.label }}</small>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">關閉</button>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">

import { ref, computed } from 'vue'
import firebase from 'firebase/app';
import 'firebase/functions';
import { Template } from '../modules/pptx/Template';

const props = defineProps<{template:Template}>()
const name = ref('')
const copyright = ref('')
const lyrics = ref('')
const isSearching = ref(false)
const lyricsElement = ref<HTMLTextAreaElement|null>(null)
const disablePageBreakButton = ref(false)
const disableMarkerButton = ref(false)
const backgroundImageInput = ref<HTMLInputElement>()
const stockedBackground = ref('')
const modalOpen = ref(false)

const stockBackgrounds = [
  { value: '163-1630260_footprints-in-the-sand-wallpaper-footprints-in-the.jpg', label: 'Footprints' },
  { value: '41dNG1AgmIL._SX425_.jpg', label: 'Abstract' },
  { value: '640.jpg', label: '640 BG' },
  { value: '9c58d46316e99cbe14be3ca4d74ebdae.jpg', label: 'Nature' },
  { value: 'GetMedia.jpg', label: 'GetMedia' },
  { value: 'Grok Image 2025-04-12 at 7.38.48 PM.png', label: 'Grok' },
  { value: 'Picture1.jpg', label: 'Pic 1' },
  { value: 'Picture10.jpg', label: 'Pic 10' },
  { value: 'Picture11.jpg', label: 'Pic 11' },
  { value: 'Picture4.jpg', label: 'Pic 4' },
  { value: 'Picture6.jpg', label: 'Pic 6' },
  { value: 'Picture7.jpg', label: 'Pic 7' },
  { value: 'Picture8.jpg', label: 'Pic 8' },
  { value: 'Picture9.jpg', label: 'Pic 9' },
  { value: 'animated01.gif', label: 'Animated 1' },
  { value: 'animated02.gif', label: 'Animated 2' },
  { value: 'hd-road-editing-background-11560093640sgzwr0aeo0.jpg', label: 'HD Road' },
  { value: 'itl.cat_wallpapersafari_248797.png', label: 'Cat' },
  { value: 'worship2.jpg', label: 'Worship 2' }
]


const wrap = (line:string) => {
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

  let result:string[] = [];

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
    .map( l => l.trim() )
    .reduce( (r, l) => {
      if (l.length === 0 && r[r.length-1].length === 0) {
        return r
      } 
      r.push(l)
      return r
    }, [] as string[])
    .reduce( (r,l) => {
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
  searchLyrics(name.value).then( result => {
    if (result.data && result.data.lyrics) {
      lyrics.value = result.data.lyrics;
      copyright.value = result.data.copyright;
      formatText();
    }
    isSearching.value = false;
  }).catch( err => {
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
  let pos = lyricsText.lastIndexOf('\n', cursorPos-1)
  pos = pos < 0 ? lyricsText.lastIndexOf('\r', cursorPos-1) : pos

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
  if( pos < 0) {
    return
  }

  const lyricsText = lyrics.value
  lyrics.value = lyricsText.slice(0, pos) + `\n${lyricsText.slice(pos)}`
}

function mark(marker:string, text:string) {

  const regex = /^[\da-zA-Z]\s/
  if (text.match(regex)) {
    return text.replace(regex, `${marker} `)
  }

  return `${marker} ${text}`
}

function addMarker(marker:string) {

  if (!lyricsElement.value) {
    return
  }

  const cursorPos = lyricsElement.value.selectionStart
  const lyricsText = lyrics.value

  if (cursorPos === 0) {
    lyrics.value = mark(marker, lyricsText)
    return
  }

  let pos = lyricsText.lastIndexOf('\n', cursorPos-1)
  pos = pos < 0 ? lyricsText.lastIndexOf('\r', cursorPos-1) : pos

  if (pos < 0) {
    // first line
    lyrics.value = mark(marker, lyricsText)
    return
  }

  lyrics.value = lyricsText.slice(0, pos+1) + mark(marker, lyricsText.slice(pos+1))

}

const getBackgroundImageDataUrl = async (): Promise<string | undefined> => {
  if (stockedBackground.value) {
    return `${import.meta.env.BASE_URL}stock-backgrounds/${stockedBackground.value}`;
  }
  if (backgroundImageInput.value && backgroundImageInput.value.files && backgroundImageInput.value.files[0]) {
    const file = backgroundImageInput.value.files[0];
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

const getSelectedLabel = () => {
  if (!stockedBackground.value) return '';
  const bg = stockBackgrounds.find(b => b.value === stockedBackground.value);
  return bg ? bg.label : stockedBackground.value;
}

const selectBackground = (value: string) => {
  stockedBackground.value = value;
  // Clear uploaded file if selecting stock
  if (backgroundImageInput.value) {
    backgroundImageInput.value.value = '';
  }
}

const clearBackground = () => {
  stockedBackground.value = '';
  if (backgroundImageInput.value) {
    backgroundImageInput.value.value = '';
  }
}

const onFileChange = () => {
  // Clear stock selection when uploading file
  stockedBackground.value = '';
}

const baseUrl = computed(() => import.meta.env.BASE_URL)

defineExpose({name, lyrics, copyright, getBackgroundImageDataUrl})
</script>

<style scoped>
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

.stock-bg-item:hover {
  border: 2px solid #007bff;
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
</style>
