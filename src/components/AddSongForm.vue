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

<script lang="ts">

import { defineComponent } from 'vue'
import firebase from 'firebase/app';
import 'firebase/functions';

export default defineComponent({
  props: {
    textOnTop: {type: Boolean}
  },
  data() {
    return {
      name: '',
      copyright: '',
      lyrics: '',
      isSearching: false
    }
  },
  computed: {
    formattedLyrics() {
      let lines = this.lyrics.split('\n');
      lines = lines
        .map( l => l.trim() )
        .filter( l=>l.length > 0)
        .reduce( (r,l) => {
          return r.concat(this.wrap(l))
        }, [] as string[])
      return lines.join('\n');
    }
  },
  methods: {
    wrap(line:string) {

      const max_line_length = this.textOnTop ? 14 : 20;

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
    },
    formatText() {
      this.lyrics = this.formattedLyrics;
    },
    search() {
      this.isSearching = true;
      const searchLyrics = firebase.functions().httpsCallable('searchLyrics');
      searchLyrics(this.name).then( result => {
        if (result.data && result.data.lyrics) {
          this.lyrics = result.data.lyrics;
          this.copyright = result.data.copyright;
          this.formatText();
        }
        this.isSearching = false;
      }).catch( err => {
        alert(err.toString());
        this.isSearching = false;
      })
    }
  }
})
</script>
