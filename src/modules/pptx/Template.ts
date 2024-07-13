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
  readonly markerCoords?:Coords
}

export const TEMPLATES:Template[] = [
{
  name: '四行文字在上方',
  maxLinesPerSlide: 4,
  coverTitleY:'5%',
  masterTextY: '0%',
  lyricsBackgroundTransparency: 100,
  songNameCoords:  { x: '20%', y: '0%', w: `60%`, h: '15%' },
  copyrightCoords: { x: '20%', y: '15%', w: '60%', h: '20%' },
  lyricsCoords:    { x: '15%', y: '0%', w: '70%', h: '50%' },
  markerCoords:    { x: '15%', y: '0%', w: '70%', h: '10%' },
  lyricsMaxLineLength: 14,
},

{
  name: '兩行文字在上方',
  maxLinesPerSlide: 2,
  coverTitleY: '5%',
  masterTextY: '0%',
  lyricsBackgroundTransparency: 100,
  songNameCoords:  { x: '20%', y: '0%', w: `60%`, h: '15%' },
  copyrightCoords: { x: '20%', y: '15%', w: '60%', h: '20%' },
  lyricsCoords:    { x: '15%', y: '0%', w: '70%', h: '28%' },
  markerCoords:    { x: '15%', y: '0%', w: '70%', h: '10%' },
  lyricsMaxLineLength: 14
},

{
  name: '兩行文字在下方',
  maxLinesPerSlide: 2,
  coverTitleY:'75%',
  masterTextY: `66%`,
  lyricsBackgroundTransparency:0,
  songNameCoords:  { x: '20%', y: '0%', w: `60%`, h: '15%' },
  copyrightCoords: { x: '20%', y: '15%', w: '60%', h: '20%' },
  lyricsCoords:    { x: '0%',  y: '67%', w: '100%', h: '28%' },
  lyricsMaxLineLength: 20
}
]