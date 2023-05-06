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
    <div class="form-check">
      <div v-for="(t, i) in templates">
        <input class="form-check-input" type="radio" :value="t" v-model="template" :id="`flexCheckDefault${i}`">
        <label class="form-check-label" :for="`flexCheckDefault${i}`">
          {{t.name}}
        </label>
      </div>
    </div>    

    <div v-for="n in songCount" :key="n" class="card my-4">
      <div class="card-header">
        <strong>第 {{n}} 首</strong>
      </div>
      <div class="card-body">
          <add-song-form ref="addSongForm" :template="template"/>
      </div>
      <div v-if="n == songCount" class="card-footer">
        <button class="btn btn-secondary float-right" @click="songCount = songCount + 1">
          新增歌曲
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import AddSongForm from './components/AddSongForm.vue';
import { PPTX, TEMPLATES } from './modules/pptx';
import download from 'downloadjs';

export default defineComponent({
  data() {
    return {
      songCount: 1,
      downloading: false,
      template: ref(TEMPLATES[0]),
      templates: TEMPLATES
    }
  },
  components: {
    'add-song-form': AddSongForm
  },
  computed: {
    addSongForms() {
      return this.$refs.addSongForm as InstanceType<typeof AddSongForm>[]
    },
    songs():{name:string, copyright:string|undefined, lyrics:string}[] {
      let forms = this.addSongForms.map( f => {
        return {
          name: f.name,
          copyright: f.copyright,
          lyrics: f.lyrics
        }
      });
      console.log(forms);

      return forms.filter( s => {
        return s.name && s.lyrics
      });
    }
  },
  methods: {
    async download() {
      this.downloading = true;

      let pptx = new PPTX(this.template);

      if (this.songs.length == 0) {
        alert('請加入最少一首詩歌。');
        this.downloading = false;
        return;
      }

      this.songs.forEach( s => {
        pptx.addSong(
          s.name,
          s.copyright,
          s.lyrics
        );
      });

      const blob = await pptx.saveBlob()
      let mimetype = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
      let cloned = new Blob([blob], {type: mimetype});
      download(cloned, '詩歌.pptx');
      this.downloading = false;

    }
  }
})
</script>

<style scoped>
.container {
  margin-top: 100px;
}
.subtitle {
  font-size: 16px;
}
</style>
