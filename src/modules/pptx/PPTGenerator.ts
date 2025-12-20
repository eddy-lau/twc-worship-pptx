'use strict';
import pptxgen from "pptxgenjs";
import CCMALogo from './images/ccma_twc_logo.png';
import TWCLogo from './images/twc_logo.png';
import { Template } from "./Template";
import { LyricsParser } from "../LyricsParser";

function addPresentationCover(pres:pptxgen, template:Template) {

  let slide = newSlideTemplate(pres, 'MASTER');

  let y:pptxgen.Coord = template.coverTitleY

  slide.addText('敬拜讚美', {
     x: '0%', y, w: '100%', h:'20%',
     align: 'center',
     shrinkText: true,
     bold: true,
     color: 'FFC000',
     fontFace: 'Microsoft JhengHei',
     fontSize: 68,
     glow: {size: 10, color: '000000', opacity: 1},
     shadow: {type:'outer', color: '7F7F7F', opacity: 0.43, angle: 45, blur: 3, offset: 3},
     lang: 'zh-HK'
  });


}

function createMasterSlide(pres:pptxgen, title:string, template:Template, backgroundImage?:string) {

//  let background = { fill: '0000FF' };

  let h = (1273-946)/(1273-291)*100;
  let y = template.masterTextY
  let text_background_dimension = {
    x: '0%' as pptxgen.Coord,
    y: `${y}%` as pptxgen.Coord,
    w: '100%' as pptxgen.Coord,
    h: `${h}%` as pptxgen.Coord
  };
  let textBackgroundTransparency = template.lyricsBackgroundTransparency

  let backgroundObj: any = {};
  if (backgroundImage) {
    if (backgroundImage.startsWith('data:')) {
      // Handle data URL
      const [mime, base64] = backgroundImage.split(',');
      const mimeType = mime.split(':')[1].split(';')[0]; // e.g., 'image/jpeg'
      const type = mimeType.split('/')[1] === 'jpeg' ? 'jpg' : mimeType.split('/')[1];
      backgroundObj = { data: base64, type };
    } else {
      backgroundObj = { path: backgroundImage };
    }
  } else {
    backgroundObj = { fill: '0000FF' };
  }

  pres.defineSlideMaster({
    title: title,
    background: backgroundObj,
    objects: [
      {image:{
        path:CCMALogo,
        x: '3%',
        y: '3%',
        w: 0.98,
        h: 0.98
      }},
      {image:{
        path:TWCLogo,
        x: '85%',
        y: '5%',
        w: (186/104)*0.7,
        h: 0.7,
      }},
      {rect: {
        ...text_background_dimension,
        fill: { color: "6666FF", transparency:textBackgroundTransparency }
      }}      
    ]
  });

}

function newSlideTemplate(pres:pptxgen, masterName: string) {

  let slide = pres.addSlide({masterName: masterName});
  return slide;
}

function addSongCover(pres:pptxgen, name:string, copyright:string|undefined, template:Template, masterName:string) {

  let slide = newSlideTemplate(pres, masterName);

  slide.addText(`【${name}】`, {
     ...template.songNameCoords,
     align: 'center',
     shrinkText: true,
     bold: true,
     color: 'FFFFFF',
     fontFace: 'Microsoft JhengHei',
     fontSize: 36,
     glow: {size: 10, color: '000000', opacity: 1},
     shadow: {type:'outer', color: '7F7F7F', opacity: 0.47, angle: 45, blur: 3, offset: 3},
     lang: 'zh-HK'
  });

  if (copyright) {
    slide.addText(`${copyright}`, {
       ...template.copyrightCoords,
       align: 'center',
       shrinkText: true,
       bold: true,
       color: 'FFFFFF',
       fontFace: 'Microsoft JhengHei',
       fontSize: 24,
       glow: {size: 10, color: '000000', opacity: 1},
       shadow: {type:'outer', color: '7F7F7F', opacity: 0.47, angle: 45, blur: 3, offset: 3},
       lang: 'zh-HK'
    });
  }

}

function addSlide(pres:pptxgen, text:string, marker:string, template:Template, masterName:string) {

  let slide = newSlideTemplate(pres, masterName);

  let markerHeight = 0;
  if (marker && template.markerCoords) {
    slide.addText(marker, {
      ...template.markerCoords,
      align: 'center',
      shrinkText: true,
      bold: true,
      color: 'FFFFFF',
      fontFace: 'Microsoft JhengHei',
      fontSize: 22,
      glow: {size: 10, color: '000000', opacity: 1},
      shadow: {type:'outer', color: '7F7F7F', opacity: 0.47, angle: 45, blur: 3, offset: 3},
      lang: 'zh-HK'
    });

    markerHeight = parseFloat(`${template.markerCoords.h}`);
  }

  slide.addText(text, {
     ...template.lyricsCoords,
     y: `${ markerHeight + parseFloat(`${template.lyricsCoords.y}`) }%`,
     align: 'center',
     shrinkText: true,
     bold: true,
     color: 'FFFFFF',
     fontFace: 'Microsoft JhengHei',
     fontSize: 36,
     glow: {size: 10, color: '000000', opacity: 1},
     shadow: {type:'outer', color: '7F7F7F', opacity: 0.47, angle: 45, blur: 3, offset: 3},
     lang: 'zh-HK'
  });
}

function addSong(pres:pptxgen, name:string, copyright:string|undefined, lyrics:string, template:Template, masterName:string) {

  addSongCover(pres, name, copyright, template, masterName);

  // Parse lyrics into slides using the shared parser
  const slides = LyricsParser.parseLyricsToSlides(lyrics, template);

  // Add each lyrics slide (skip the cover slide as it's already added)
  for (const slide of slides) {
    if (slide.type === 'lyrics' && slide.text) {
      addSlide(pres, slide.text, slide.marker || '', template, masterName);
    }
  }
}

export class PPTGenerator {

  template:Template
  pres:pptxgen
  masters: Map<string, string> = new Map();

  constructor(template:Template) {
    this.template = template
    this.pres = new pptxgen()

    this.pres.layout = 'LAYOUT_16x9';

    createMasterSlide(this.pres, 'MASTER', template);
    addPresentationCover(this.pres, template);  }

  addSong(song:{name:string, copyright:string|undefined, lyrics:string, backgroundImage?:string}) {
    let masterName = 'MASTER';
    if (song.backgroundImage) {
      if (!this.masters.has(song.backgroundImage)) {
        masterName = `MASTER_${this.masters.size}`;
        this.masters.set(song.backgroundImage, masterName);
        createMasterSlide(this.pres, masterName, this.template, song.backgroundImage);
      } else {
        masterName = this.masters.get(song.backgroundImage)!;
      }
    }
    addSong(this.pres, song.name, song.copyright, song.lyrics, this.template, masterName)
  }

  async saveBlob():Promise<string | ArrayBuffer | Blob | Uint8Array> {
    return this.pres.write({outputType:'blob'})
  }

}