'use strict';
import pptxgen from "pptxgenjs";
import CCMALogo from './images/ccma_twc_logo.png';
import TWCLogo from './images/twc_logo.png';
import { Template } from "./Template";

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
    backgroundObj = { path: backgroundImage };
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

function addSlide(pres:pptxgen, text:string, template:Template, masterName:string) {

  let slide = newSlideTemplate(pres, masterName);

  const markers:{[key:string]:string} = {
    'b': 'Bridge',
    'B': 'Bridge',
    'c': '副歌',
    'C': '副歌'
  }

  let markerHeight = 0;
  console.log(`WTF: "${text}`)
  if (text.match(/^[a-zA-Z]/) && template.markerCoords) {

    slide.addText(markers[text.charAt(0)], {
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

    text = text.replace(/^[a-zA-Z]/, '')
    markerHeight = parseFloat(`${template.markerCoords.h}`)
  } else {
    console.log('WTF2!!', text, text.match(/^[a-zA-Z]/), template.markerCoords)
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

  const PAGE_BREAK='--page-break--'

  addSongCover(pres, name, copyright, template, masterName);

  let lines = lyrics.split('\n')
  .map( line => line.trim() )
  .map( line => line.length === 0 ? PAGE_BREAK : line )
  .filter( line => line.length > 0 );

  let lineCount = 0;
  let text;
  for (const line of lines) {

    if (line === PAGE_BREAK) {
      if (text) {
        addSlide(pres, text, template, masterName);
      }
      text = "";
      lineCount = 0;
      continue;
    }

    if (line.match(/^[\d副a-zA-Z]/) || lineCount == template.maxLinesPerSlide) {
      if (text) {
        addSlide(pres, text, template, masterName);
      }
      text = "";
      lineCount = 0;
    }

    if (lineCount == 0) {
      text = line;
    } else {
      text += '\n';
      text += line;
    }
    lineCount++;

  }

  if (text) {
    addSlide(pres, text, template, masterName);
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