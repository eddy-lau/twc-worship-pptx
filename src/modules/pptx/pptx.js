'use strict';
import pptxgen from "pptxgenjs";
import CCMALogo from './images/ccma_twc_logo.png';
import TWCLogo from './images/twc_logo.png';

const MAX_LINES_PER_SLIDE = 4;

function addPresentationCover(pres, textOnTop) {

  let slide = newSlideTemplate(pres);

  let y = textOnTop ? '5%' : '75%';

  slide.addText('敬拜讚美', {
     x: '0%', y, w: '100%', h:'20%',
     align: 'center',
     shrinkText: true,
     bold: true,
     color: 'FFC000',
     fontFace: 'Microsoft JhengHei',
     fontSize: 68,
     glow: {size: 10, color: '000000', transparency: 0},
     shadow: {type:'outer', color: '7F7F7F', opacity: 0.43, angle: 45, blur: 3, offset: 3},
     lang: 'zh-HK'
  });


}

function createMasterSlide(pres, title, textOnTop) {

//  let background = { fill: '0000FF' };

  let h = (1273-946)/(1273-291)*100;
  let y = textOnTop ? 0 : 100-h;
  let text_background_dimension = {
    x: '0%',
    y: `${y}%`,
    w: '100%',
    h: `${h}%`
  };
  let textBackgroundTransparency = textOnTop ? 100 : 0;

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

function newSlideTemplate(pres) {

  let slide = pres.addSlide({masterName: 'MASTER'});
  return slide;
}

function addSongCover(pres, name, copyright, textOnTop) {

  let slide = newSlideTemplate(pres);

  let y = textOnTop ? '0%': '67%';
  let x = textOnTop ? '20%': '5%';
  let w = textOnTop ? `30%` : '45%';

  slide.addText(`【${name}】`, {
     x, y, w, h:'28%',
     align: 'left',
     shrinkText: true,
     bold: true,
     color: 'FFFFFF',
     fontFace: 'Microsoft JhengHei',
     fontSize: 36,
     glow: {size: 10, color: '000000', transparency: 0},
     shadow: {type:'outer', color: '7F7F7F', opacity: 0.47, angle: 45, blur: 3, offset: 3},
     lang: 'zh-HK'
  });

  let copyrightWidth = textOnTop ? '30%' : '45%';
  if (copyright) {
    slide.addText(`${copyright}`, {
       x: '50%', y, w: copyrightWidth, h:'28%',
       align: 'center',
       shrinkText: true,
       bold: true,
       color: 'FFFFFF',
       fontFace: 'Microsoft JhengHei',
       fontSize: 24,
       glow: {size: 10, color: '000000', transparency: 0},
       shadow: {type:'outer', color: '7F7F7F', opacity: 0.47, angle: 45, blur: 3, offset: 3},
       lang: 'zh-HK'
    });
  }

}

function addSlide(pres, text, textOnTop) {

  let slide = newSlideTemplate(pres);

  let y = textOnTop ? '0%': '67%';
  let w = textOnTop ? '70%' : '100%';
  let x = textOnTop ? '15%' : '0%';

  slide.addText(text, {
     x, y, w, h:'28%',
     align: 'center',
     shrinkText: true,
     bold: true,
     color: 'FFFFFF',
     fontFace: 'Microsoft JhengHei',
     fontSize: 36,
     glow: {size: 10, color: '000000', transparency: 0},
     shadow: {type:'outer', color: '7F7F7F', opacity: 0.47, angle: 45, blur: 3, offset: 3},
     lang: 'zh-HK'
  });
}

function addSong(pres, name, copyright, lyrics, textOnTop) {

  addSongCover(pres, name, copyright, textOnTop);

  let lines = lyrics.split('\n')
  .map( line => line.trim() )
  .filter( line => line.length > 0 );

  let lineCount = 0;
  let text;
  for (let i = 0; i<lines.length; i++) {

    if (lines[i].match(/^[\d副]/) || lineCount == MAX_LINES_PER_SLIDE) {
      addSlide(pres, text, textOnTop);
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
  addSlide(pres, text, textOnTop);

}

export default function(textOnTop) {

  let pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';

  createMasterSlide(pres, 'MASTER', textOnTop);

  addPresentationCover(pres, textOnTop);

  return {
    addSong: (name, copyright, lyrics) => addSong(pres, name, copyright, lyrics, textOnTop),
    saveBlob: () => pres.write('blob')
  }
}
