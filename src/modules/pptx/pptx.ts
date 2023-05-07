'use strict';
import pptxgen from "pptxgenjs";
import CCMALogo from './images/ccma_twc_logo.png';
import TWCLogo from './images/twc_logo.png';
import { Template } from "./Template";

function addPresentationCover(pres:pptxgen, template:Template) {

  let slide = newSlideTemplate(pres);

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

function createMasterSlide(pres:pptxgen, title:string, template:Template) {

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

  pres.defineSlideMaster({
    title: title,
    background:{
      fill: '0000FF'
    },
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

function newSlideTemplate(pres:pptxgen) {

  let slide = pres.addSlide({masterName: 'MASTER'});
  return slide;
}

function addSongCover(pres:pptxgen, name:string, copyright:string|undefined, template:Template) {

  let slide = newSlideTemplate(pres);

  slide.addText(`【${name}】`, {
     ...template.songNameCoords,
     align: 'left',
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

function addSlide(pres:pptxgen, text:string, template:Template) {

  let slide = newSlideTemplate(pres);

  slide.addText(text, {
     ...template.lyricsCoords,
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

function addSong(pres:pptxgen, name:string, copyright:string|undefined, lyrics:string, template:Template) {

  addSongCover(pres, name, copyright, template);

  let lines = lyrics.split('\n')
  .map( line => line.trim() )
  .filter( line => line.length > 0 );

  let lineCount = 0;
  let text;
  for (let i = 0; i<lines.length; i++) {

    if (lines[i].match(/^[\d副]/) || lineCount == template.maxLinesPerSlide) {
      if (text) {
        addSlide(pres, text, template);
      }
      text = "";
      lineCount = 0;
    }

    if (lineCount == 0) {
      text = lines[i];
    } else {
      text += '\n';
      text += lines[i];
    }
    lineCount++;

  }

  if (text) {
    addSlide(pres, text, template);
  }

}

export class PPTX {

  template:Template
  pres:pptxgen

  constructor(template:Template) {
    this.template = template
    this.pres = new pptxgen()

    this.pres.layout = 'LAYOUT_16x9';

    createMasterSlide(this.pres, 'MASTER', template);
    addPresentationCover(this.pres, template);
  
  }

  addSong(song:{name:string, copyright:string|undefined, lyrics:string}) {
    addSong(this.pres, song.name, song.copyright, song.lyrics, this.template)
  }

  async saveBlob():Promise<string | ArrayBuffer | Blob | Uint8Array> {
    return this.pres.write({outputType:'blob'})
  }

}