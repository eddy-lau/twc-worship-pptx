<template>
  <div class="app-container">
    <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div class="container-fluid">
        <a class="navbar-brand d-flex align-items-center" href="#">
          <img src="/ccma_twc_logo-BqU4bmAt.png" alt="Logo" class="navbar-logo me-3" style="height: 40px;">
          <div class="title-section">
            <h4 class="mb-0 title-main">詩歌PPT製作器</h4>
            <div class="subtitle">中華宣道會大圍堂</div>
          </div>
        </a>
        <button class="btn btn-success"
          :disabled="downloading"
          @click="download()">
          <span v-if="downloading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          <i class="fas fa-download me-1"></i>完成
        </button>
      </div>
    </nav>

    <div class="container main-content">
      <!-- Template Selection -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card template-card">
            <div class="card-header">
              <h5 class="mb-0"><i class="fas fa-palette me-2"></i>選擇模板</h5>
            </div>
            <div class="card-body">
              <div class="template-options">
                <div v-for="(t, i) in templates" :key="i" class="template-option">
                  <input class="form-check-input" type="radio" :value="t" v-model="template" :id="`template${i}`">
                  <label class="form-check-label template-label" :for="`template${i}`">
                    <strong>{{t.name}}</strong>
                    <small class="text-muted d-block">{{t.description || '詩歌PPT模板'}}</small>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Songs -->
      <div v-for="n in songCount" :key="n" class="song-card">
        <div class="card">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0"><i class="fas fa-music me-2"></i>第 {{n}} 首詩歌</h5>
            <span v-if="n > 1" class="badge bg-secondary">{{n}}</span>
          </div>
          <div class="card-body">
            <add-song-form ref="addSongForms" :template="template"/>
          </div>
          <div v-if="n === songCount" class="card-footer">
            <button class="btn btn-outline-primary" @click="songCount = songCount + 1">
              <i class="fas fa-plus me-1"></i>新增歌曲
            </button>
          </div>
        </div>
      </div>

      <!-- PWA Install Prompt -->
      <div id="install-prompt" class="install-prompt">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <strong>安裝應用程式</strong>
            <p class="mb-0 text-muted small">安裝到裝置以獲得更好的體驗</p>
          </div>
          <div>
            <button class="btn btn-primary btn-sm me-2" id="install-btn">安裝</button>
            <button class="btn btn-outline-secondary btn-sm" id="dismiss-btn">稍後</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="app-footer">
      <div class="container-fluid">
        <div class="d-flex justify-content-between align-items-center">
          <div class="footer-info">
            <small class="text-muted">
              <i class="fas fa-code me-1"></i>
              詩歌PPT製作器 v{{ version }}
            </small>
          </div>
          <div class="footer-links">
            <small class="text-muted">
              <i class="fas fa-heart me-1"></i>
              中華宣道會大圍堂
            </small>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AddSongForm from './components/AddSongForm.vue'
import { PPTGenerator, TEMPLATES } from './modules/pptx'
import packageJson from '../package.json'
import downloadjs from 'downloadjs'

// ... existing code ...

const songCount = ref(1)
const downloading = ref(false)
const template = ref(TEMPLATES[0])
const templates = TEMPLATES
const addSongForms = ref<InstanceType<typeof AddSongForm>[]>()
const version = packageJson.version

// PWA Install Prompt
let deferredPrompt: any = null;

onMounted(() => {
  // Listen for the beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    showInstallPrompt();
  });

  // Listen for successful installation
  window.addEventListener('appinstalled', () => {
    hideInstallPrompt();
    deferredPrompt = null;
  });

  // Setup install button
  const installBtn = document.getElementById('install-btn');
  const dismissBtn = document.getElementById('dismiss-btn');

  if (installBtn) {
    installBtn.addEventListener('click', installPWA);
  }

  if (dismissBtn) {
    dismissBtn.addEventListener('click', hideInstallPrompt);
  }
});

const showInstallPrompt = () => {
  const prompt = document.getElementById('install-prompt');
  if (prompt) {
    prompt.classList.add('show');
  }
};

const hideInstallPrompt = () => {
  const prompt = document.getElementById('install-prompt');
  if (prompt) {
    prompt.classList.remove('show');
  }
};

const installPWA = async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    hideInstallPrompt();
  }
};

const download = async () => {
  if (!addSongForms.value) {
    return
  }

  const songs = await Promise.all(addSongForms.value.map(async f => {
    const backgroundImage = await f.getBackgroundImageDataUrl();
    return {
      name: f.name,
      copyright: f.copyright,
      lyrics: f.lyrics,
      backgroundImage
    }
  })).then(songs => songs.filter(s => s.name && s.lyrics))

  if (songs.length == 0) {
    alert('請加入最少一首詩歌。');
    return;
  }

  let pptx = new PPTGenerator(template.value)
  songs.forEach( s => pptx.addSong(s) )

  downloading.value = true;
  const blob = await pptx.saveBlob()
  let mimetype = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
  let cloned = new Blob([blob as BlobPart], {type: mimetype});
  downloadjs(cloned, '詩歌.pptx');
  downloading.value = false;
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  flex-direction: column;
}

.main-content {
  margin-top: 74px;
  padding-bottom: 2rem;
  flex: 1;
  padding-top: 20px;
}

.navbar-logo {
  border-radius: 8px;
}

.template-card {
  background: white;
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
}

.template-options {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.template-option {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1rem 1rem 2rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
  flex: 1;
  min-width: 200px;
  position: relative;
}

.template-option input[type="radio"] {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  margin: 0;
}

.template-label {
  margin-left: 0.5rem;
  cursor: pointer;
}

.template-option:hover {
  border-color: var(--primary-color);
  background-color: rgba(0, 123, 255, 0.05);
}

.song-card {
  margin-bottom: 2rem;
}

.song-card .card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  transition: all 0.3s ease;
}

.song-card .card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.install-prompt {
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  background: white;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: none;
  backdrop-filter: blur(10px);
}

.install-prompt.show {
  display: block;
}

@media (max-width: 768px) {
  .main-content {
    margin-top: 72px;
    padding: 0 1rem;
  }

  .template-options {
    flex-direction: column;
  }

  .template-option {
    min-width: auto;
  }

  .install-prompt {
    left: 10px;
    right: 10px;
  }
}

/* Footer Styles */
.app-footer {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-top: 1px solid #dee2e6;
  padding: 1rem 0;
  margin-top: 3rem;
  position: relative;
}

.footer-info,
.footer-links {
  font-size: 0.875rem;
}

.footer-info i,
.footer-links i {
  color: var(--primary-color);
  opacity: 0.7;
}

@media (max-width: 768px) {
  .app-footer .d-flex {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}
</style>
