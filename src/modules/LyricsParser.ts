'use strict';

export interface SlideData {
  type: 'cover' | 'lyrics';
  text?: string;
  marker?: string;
}

export interface Template {
  maxLinesPerSlide: number;
  markerCoords?: any;
  lyricsCoords?: any;
}

export class LyricsParser {
  private static readonly PAGE_BREAK = '--page-break--';
  private static readonly MARKERS: { [key: string]: string } = {
    'b': 'Bridge', 'B': 'Bridge',
    'c': '副歌', 'C': '副歌'
  };

  /**
   * Parse lyrics text into slides
   * @param lyrics The raw lyrics text
   * @param template Template configuration
   * @returns Array of slide data
   */
  static parseLyricsToSlides(lyrics: string, template: Template): SlideData[] {
    const result: SlideData[] = [];

    // 1. Cover Slide
    result.push({ type: 'cover' });

    // 2. Lyrics Slides
    if (!lyrics) return result;

    const lines = this.preprocessLines(lyrics);
    let lineCount = 0;
    let text = '';

    for (const line of lines) {
      if (line === this.PAGE_BREAK) {
        if (text) {
          result.push(this.createLyricsSlide(text, template));
        }
        text = '';
        lineCount = 0;
        continue;
      }

      if (this.shouldStartNewSlide(line, lineCount, template)) {
        if (text) {
          result.push(this.createLyricsSlide(text, template));
        }
        text = '';
        lineCount = 0;
      }

      if (lineCount === 0) {
        text = line;
      } else {
        text += '\n' + line;
      }
      lineCount++;
    }

    if (text) {
      result.push(this.createLyricsSlide(text, template));
    }

    return result;
  }

  /**
   * Preprocess lyrics lines
   */
  private static preprocessLines(lyrics: string): string[] {
    return lyrics.split('\n')
      .map(line => line.trim())
      .map(line => line.length === 0 ? this.PAGE_BREAK : line)
      .filter(line => line.length > 0);
  }

  /**
   * Determine if a new slide should be started
   */
  private static shouldStartNewSlide(line: string, lineCount: number, template: Template): boolean {
    return line.match(/^[\d副a-zA-Z]/) !== null || lineCount === template.maxLinesPerSlide;
  }

  /**
   * Create a lyrics slide with marker processing
   */
  private static createLyricsSlide(text: string, template: Template): SlideData {
    let marker = '';
    let content = text;

    if (text.match(/^[a-zA-Z]/) && template.markerCoords) {
      const char = text.charAt(0);
      if (this.MARKERS[char]) {
        marker = this.MARKERS[char];
        content = text.replace(/^[a-zA-Z]/, '');
      }
    }

    return {
      type: 'lyrics',
      text: content,
      marker
    };
  }

  /**
   * Get marker text for a given marker character
   */
  static getMarkerText(markerChar: string): string | undefined {
    return this.MARKERS[markerChar];
  }

  /**
   * Check if a line starts with a marker
   */
  static hasMarker(line: string): boolean {
    return line.match(/^[a-zA-Z]/) !== null && this.MARKERS[line.charAt(0)] !== undefined;
  }

  /**
   * Extract marker and content from a line
   */
  static extractMarker(line: string): { marker: string; content: string } {
    if (this.hasMarker(line)) {
      const char = line.charAt(0);
      return {
        marker: this.MARKERS[char],
        content: line.replace(/^[a-zA-Z]/, '')
      };
    }
    return { marker: '', content: line };
  }
}