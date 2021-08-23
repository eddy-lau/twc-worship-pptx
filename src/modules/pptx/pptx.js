'use strict';
import pptxgen from "pptxgenjs";
import CCMALogo from './images/ccma_logo_white.png';
import TWCLogo from './images/twc_logo.png';

function addPresentationCover(pres) {

  let slide = newSlideTemplate(pres);

  slide.addText('敬拜讚美', {
     x: '0%', y: '75%', w: '100%', h:'20%',
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

function createMasterSlide(pres, title) {

//  let background = { fill: '0000FF' };

  let h = (1273-946)/(1273-291)*100;
  let y = 100-h;
  let text_background_dimension = {
    x: '0%',
    y: `${y}%`,
    w: '100%',
    h: `${h}%`
  };

  pres.defineSlideMaster({
    title: title,
    background:{
      fill: '0000FF'
    },
    objects: [
      {image:{
        path:CCMALogo,
        x: '3%',
        y: '5%',
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
        fill: { color: "6666FF", transparency:0 }
      }}      
    ]
  });

}

function newSlideTemplate(pres) {

  let slide = pres.addSlide({masterName: 'MASTER'});
  return slide;
}

function addSongCover(pres, name, copyright) {

  let slide = newSlideTemplate(pres);

  slide.addText(`【${name}】`, {
     x: '5%', y: '67%', w: '45%', h:'28%',
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

  if (copyright) {
    slide.addText(`${copyright}`, {
       x: '50%', y: '67%', w: '45%', h:'28%',
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

function addSlide(pres, text) {

  let slide = newSlideTemplate(pres);

  slide.addText(text, {
     x: '0%', y: '67%', w: '100%', h:'28%',
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

function addSong(pres, name, copyright, lyrics) {

  addSongCover(pres, name, copyright);

  let lines = lyrics.split('\n')
  .map( line => line.trim() )
  .filter( line => line.length > 0 );

  for (let i = 0; i<lines.length; i++) {

    let text = lines[i];
    if (i+1<lines.length) {
      let nextLine = lines[i+1];
      if (!nextLine.match(/^[\d副]/)) {
        text += '\n';
        text += nextLine;
        i++;
      }
    }
    addSlide(pres, text);
  }

}

export default function(fileName) {

  let pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';

  createMasterSlide(pres, 'MASTER');

  addPresentationCover(pres);

  return {
    addSong: (name, copyright, lyrics) => addSong(pres, name, copyright, lyrics),
    save: ()=> pres.writeFile(fileName),
    saveBlob: () => pres.write('blob')
  }
}
