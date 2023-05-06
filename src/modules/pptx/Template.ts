import pptxgen from "pptxgenjs";

interface Coords {
  x:pptxgen.Coord
  y:pptxgen.Coord
  w:pptxgen.Coord
  h:pptxgen.Coord  
}

export interface Template {
  readonly name:string
  readonly maxLinesPerSlide: number
  readonly coverTitleY: pptxgen.Coord
  readonly masterTextY: pptxgen.Coord
  readonly lyricsBackgroundTransparency:number
  readonly songNameCoords:Coords
  readonly copyrightCoords:Coords
  readonly lyricsCoords:Coords
  readonly lyricsMaxLineLength:number
}

const FOUR_LINES_TEMPLATE: Template = {

  name: '四行文字在上方',
  maxLinesPerSlide: 4,
  coverTitleY:'5%',
  masterTextY: '0%',
  lyricsBackgroundTransparency: 100,
  songNameCoords: {
      x: '20%',
      y: '0%',
      w: `30%`,
      h: '28%'
  },
  copyrightCoords: {
      x: '50%',
      y: '0%',
      w: '30%',
      h: '28%'
  },
  lyricsCoords: {
      y: '0%',
      w: '70%',
      x: '15%',
      h: '28%'
  },
  lyricsMaxLineLength: 14
}

const TWO_LINES_TEXT_ON_TOP: Template = {

  name: '兩行文字在上方',
  maxLinesPerSlide: 2,
  coverTitleY: '5%',
  masterTextY: '0%',
  lyricsBackgroundTransparency: 100,
  songNameCoords: {
    x: '20%',
    y: '0%',
    w: `30%`,
    h: '28%'
  },
  copyrightCoords: {
    x: '50%',
    y: '0%',
    w: '30%',
    h: '28%',
  },
  lyricsCoords: {
    y: '0%',
    w: '70%',
    x: '15%',
    h: '28%'
  },
  lyricsMaxLineLength: 14
}

const TWO_LINES_TEXT_ON_BOTTOM: Template = {

  name: '兩行文字在下方',
  maxLinesPerSlide: 2,
  coverTitleY:'75%',
  masterTextY: `66%`,
  lyricsBackgroundTransparency:0,
  songNameCoords: {
      x: '5%',
      y: '67%',
      w: '45%',
      h: '28%'
  },
  copyrightCoords: {
      x: '50%',
      y: '67%',
      w: '45%', 
      h: '28%'
  },
  lyricsCoords: {
      y: '67%',
      w: '100%',
      x: '0%', 
      h: '28%'
  },
  lyricsMaxLineLength: 20
}

export const Templates = [
  TWO_LINES_TEXT_ON_TOP,
  TWO_LINES_TEXT_ON_BOTTOM,
  FOUR_LINES_TEMPLATE,
]