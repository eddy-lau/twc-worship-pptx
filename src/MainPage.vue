<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
    <a class="navbar-brand" href="#"><h4>詩歌PPT製作器</h4><div class="subtitle text-secondary">中華宣道會大圍堂</div></a>
    <button class="btn btn-success float-right"
      :disabled="downloading"
      @click="download()">
      <span v-if="downloading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      完成
    </button>
  </nav>
  <div class="container">
    <div v-for="n in songCount" :key="n" class="card my-4">
      <div class="card-header">
        <strong>第 {{n}} 首</strong>
      </div>
      <div class="card-body">
          <add-song-form :ref=" 'addSongForm' + n"/>
      </div>
      <div v-if="n == songCount" class="card-footer">
        <button class="btn btn-secondary float-right" @click="songCount = songCount + 1">
          新增歌曲
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import AddSongForm from './components/AddSongForm.vue';
import PPTX from './modules/pptx';
import download from 'downloadjs';

export default {
  data() {
    return {
      songCount: 1,
      downloading: false
    }
  },
  components: {
    'add-song-form': AddSongForm
  },
  computed: {
    songs() {
      let forms = [];
      for (let i = 1; i<=this.songCount; i++) {
        let data = {
          name: this.$refs['addSongForm'+i].name,
          copyright: this.$refs['addSongForm'+i].copyright,
          lyrics: this.$refs['addSongForm'+i].formattedLyrics,
        };
        forms.push(data);
      }

      return forms.filter( s => {
        return s.name && s.lyrics
      });
    }
  },
  methods: {
    download() {
      this.downloading = true;

      let pptx = PPTX();

      if (this.songs.length == 0) {
        alert('請加入最少一首詩歌。');
        return;
      }

      this.songs.forEach( s => {
        pptx.addSong(
          s.name,
          s.copyright,
          s.lyrics
        );
      });

      pptx.saveBlob().then( blob => {
        let mimetype = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        let cloned = new Blob([blob], {type: mimetype});
        return download(cloned, '詩歌.pptx');
      }).then( () => {
        this.downloading = false;
      });

    }
  }
}
</script>

<style scoped>
.container {
  margin-top: 100px;
}
.subtitle {
  font-size: 16px;
}
</style>
