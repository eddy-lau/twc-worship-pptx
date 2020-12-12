<template>
  <form>
    <div class="form-group">
      <label for="songName">歌名</label>
      <!--
        <button type="button" class="btn btn-outline-primary btn-sm float-right"
        @click="search()">搜尋
        </button>
      -->
      <input type="text" class="form-control" id="songName" v-model="name"
      placeholder="(請貼上歌名)">
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

<script>

const max_line_length = 18;

function wrap(line) {

  if (line.length <= max_line_length) {
    return [line];
  }

  let lastChar = line.match(/[  ,，.。;；]$/);
  if (lastChar) {
    line = line.substring(0, lastChar.index);
  }

  let result = [];

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


export default {
  data() {
    return {
      name: '',
      copyright: '',
      lyrics: ''
    }
  },
  computed: {
    formattedLyrics() {
      let lines = this.lyrics.split('\n');
      lines = lines
        .map( l => l.trim() )
        .filter( l=>l.length > 0)
        .reduce( (r,l) => {
          return r.concat(wrap(l))
        }, [])
      return lines.join('\n');
    }
  },
  methods: {
    formatText() {
      this.lyrics = this.formattedLyrics;
    },
    search() {
    }
  }
}
</script>
