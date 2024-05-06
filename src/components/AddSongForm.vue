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
  </form>
</template>

<script setup lang="ts">

import { ref } from 'vue'
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

setInterval( ()=> {
  disablePageBreakButton.value = pageBreakPosition() < 0
  disableMarkerButton.value = !lyricsElement.value || !lyricsElement.value.matches(':focus')
}, 500)

defineExpose({name, lyrics, copyright})
</script>
