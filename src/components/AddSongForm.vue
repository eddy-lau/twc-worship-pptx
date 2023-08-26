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
        placeholder="(請貼上歌詞)"
        rows="10"></textarea>
      <button type="button" class="btn btn-outline-primary btn-sm float-right my-1"
      @click="formatText()">整理歌詞</button>
      <button type="button" class="btn btn-outline-primary btn-sm float-right my-1 mx-2"
      @click="replaceChar()">你 > 祢</button>
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
    .filter( l=>l.length > 0)
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

defineExpose({name, lyrics, copyright})
</script>
