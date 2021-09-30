import { TestBed } from '@angular/core/testing';
import { ScrabbleLetter } from '@app/classes/scrabble-letter';
import { ScrabbleWord, WordOrientation } from '@app/classes/scrabble-word';
import { SquareColor } from '@app/classes/square';

import { BonusService } from './bonus.service';

describe('BonusService', () => {
  let service: BonusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BonusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('totalValue should apply the right bonuses', () => {
    const letter1 = new ScrabbleLetter('a', 1);
    letter1.color = SquareColor.Red;
    const letter2 = new ScrabbleLetter('b', 1);
    const letter3 = new ScrabbleLetter('c', 1);
    const letter4 = new ScrabbleLetter('d', 1);
    letter4.color = SquareColor.Teal;
    const word = new ScrabbleWord();
    word.startPosition = {x:0,y:0};
    word.orientation = WordOrientation.Horizontal;
    word.content = [letter1, letter2, letter3, letter4];
    service.totalValue(word);
    expect(word.value).toEqual(15);
});

it('totalValue should apply the right bonuses', () => {
    const letter1 = new ScrabbleLetter('a', 1);
    letter1.color = SquareColor.Red;
    const letter2 = new ScrabbleLetter('b', 1);
    const letter3 = new ScrabbleLetter('c', 1);
    const word = new ScrabbleWord();
    word.startPosition = {x:0,y:0};
    word.orientation = WordOrientation.Vertical;
    word.content = [letter1, letter2, letter3];
    service.totalValue(word);
    expect(word.value).toEqual(9);
});
});
