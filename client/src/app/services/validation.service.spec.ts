// import { TestBed } from '@angular/core/testing';
// import { Dictionary, DictionaryType } from '@app/classes/dictionary';
// import { LocalPlayer } from '@app/classes/local-player';
// import { ScrabbleBoard } from '@app/classes/scrabble-board';
// import { ScrabbleLetter } from '@app/classes/scrabble-letter';
// import { ScrabbleWord } from '@app/classes/scrabble-word';
// import { Axis } from '@app/classes/utilities';
// import { Vec2 } from '@app/classes/vec2';
// import { ValidationService, WAIT_TIME } from '@app/services/validation.service';
// import { GridService } from './grid.service';

// /* eslint-disable  @typescript-eslint/no-explicit-any */
// /* eslint-disable  @typescript-eslint/no-magic-numbers */
// describe('ValidationService', () => {
//     let service: ValidationService;
//     let isWordValidSpy: jasmine.SpyObj<any>;
//     let convertScrabbleWordToStringSpy: jasmine.SpyObj<any>;
//     let gridServiceSpy: jasmine.SpyObj<GridService>;

//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             providers: [{ provide: GridService, useValue: gridServiceSpy }],
//         });
//         service = TestBed.inject(ValidationService);

//         gridServiceSpy = jasmine.createSpyObj('GridService', ['scrabbleBoard', 'drawLetter']);
//         isWordValidSpy = spyOn<any>(service, 'isWordValid').and.callThrough();
//         convertScrabbleWordToStringSpy = spyOn<any>(service, 'convertScrabbleWordToString').and.callThrough();
//         service.dictionary = new Dictionary(DictionaryType.Default);

//         gridServiceSpy.scrabbleBoard = new ScrabbleBoard(false);
//         gridServiceSpy.scrabbleBoard.generateBoard(false);
//     });

//     it('should be created', () => {
//         expect(service).toBeTruthy();
//     });

//     it('isWordValid should return true if word is valid', () => {
//         const validWord = 'portee';
//         expect(service.isWordValid(validWord)).toEqual(true);
//     });

//     it('isWordValid should return false if word is invalid', () => {
//         const validWord = 'porte-feuille';
//         expect(service.isWordValid(validWord)).toEqual(false);
//     });

//     it('convertScrabbleWordToString should return a string of the scrabble word', () => {
//         const letter1: ScrabbleLetter = new ScrabbleLetter('D', 1);
//         const letter2: ScrabbleLetter = new ScrabbleLetter('é', 2);
//         const letter3: ScrabbleLetter = new ScrabbleLetter('j', 4);
//         const letter4: ScrabbleLetter = new ScrabbleLetter('à', 3);
//         const word: ScrabbleLetter[] = [letter1, letter2, letter3, letter4];
//         expect(service.convertScrabbleWordToString(word)).toEqual('deja');
//     });

//     it('if words is not null, validateWordsAndCalculateScore should call convertScrabbleWordToString and isWordValid', () => {
//         const letter1: ScrabbleLetter = new ScrabbleLetter('D', 1);
//         gridServiceSpy.scrabbleBoard.squares[0][0].occupied = true;
//         gridServiceSpy.scrabbleBoard.squares[0][0].isValidated = false;
//         const letter2: ScrabbleLetter = new ScrabbleLetter('é', 2);
//         gridServiceSpy.scrabbleBoard.squares[0][1].occupied = true;
//         gridServiceSpy.scrabbleBoard.squares[0][1].isValidated = false;
//         const letter3: ScrabbleLetter = new ScrabbleLetter('j', 4);
//         gridServiceSpy.scrabbleBoard.squares[0][2].occupied = true;
//         gridServiceSpy.scrabbleBoard.squares[0][2].isValidated = false;
//         const letter4: ScrabbleLetter = new ScrabbleLetter('à', 3);
//         gridServiceSpy.scrabbleBoard.squares[0][3].occupied = true;
//         gridServiceSpy.scrabbleBoard.squares[0][3].isValidated = false;
//         const word1: ScrabbleWord = new ScrabbleWord();
//         word1.content = [letter1, letter2, letter3, letter4];
//         word1.orientation = Axis.V;
//         word1.startPosition = new Vec2(0, 0);
//         const words: ScrabbleWord[] = [word1];
//         service.validateWords(words);
//         expect(convertScrabbleWordToStringSpy).toHaveBeenCalled();
//         expect(isWordValidSpy).toHaveBeenCalled();
//     });

//     it('if one word is not valid, validateWords should return false', () => {
//         const firstLetter: ScrabbleLetter = new ScrabbleLetter('J', 1);
//         const secondLetter: ScrabbleLetter = new ScrabbleLetter("'", 1);
//         const thirdLetter: ScrabbleLetter = new ScrabbleLetter('a', 1);
//         const fourthLetter: ScrabbleLetter = new ScrabbleLetter('i', 1);
//         const word1: ScrabbleWord = new ScrabbleWord();
//         const word2: ScrabbleWord = new ScrabbleWord();
//         word1.content = [firstLetter, secondLetter, thirdLetter, fourthLetter]; // J'ai - non valide word.startPosition= {x:0, y:0};
//         word1.orientation = Axis.V;
//         word1.startPosition = new Vec2(0, 0);
//         word2.content = [thirdLetter, fourthLetter]; // ai - valide word.startPosition= {x:0, y:0};
//         word2.orientation = Axis.H;
//         word2.startPosition = new Vec2(0, 0);
//         const words: ScrabbleWord[] = [word1, word2];
//         expect(service.validateWords(words)).toEqual(false);
//     });
//     // TODO : Not working
//     it('if letters added total is 8, validateWord should return false', () => {
//         const letter1: ScrabbleLetter = new ScrabbleLetter('a', 1);
//         const letter2: ScrabbleLetter = new ScrabbleLetter('p', 1);
//         const letter3: ScrabbleLetter = new ScrabbleLetter('e', 1);
//         const letter4: ScrabbleLetter = new ScrabbleLetter('l', 1);
//         const letter5: ScrabbleLetter = new ScrabbleLetter('s', 1);
//         gridServiceSpy.scrabbleBoard.squares[0][0].occupied = true;
//         gridServiceSpy.scrabbleBoard.squares[0][0].isValidated = false;
//         gridServiceSpy.scrabbleBoard.squares[0][1].occupied = true;
//         gridServiceSpy.scrabbleBoard.squares[0][1].isValidated = false;
//         gridServiceSpy.scrabbleBoard.squares[0][2].occupied = true;
//         gridServiceSpy.scrabbleBoard.squares[0][2].isValidated = false;
//         gridServiceSpy.scrabbleBoard.squares[0][3].occupied = true;
//         gridServiceSpy.scrabbleBoard.squares[0][3].isValidated = false;
//         gridServiceSpy.scrabbleBoard.squares[0][4].occupied = true;
//         gridServiceSpy.scrabbleBoard.squares[0][4].isValidated = false;
//         gridServiceSpy.scrabbleBoard.squares[0][5].occupied = true;
//         gridServiceSpy.scrabbleBoard.squares[0][5].isValidated = false;
//         gridServiceSpy.scrabbleBoard.squares[0][6].occupied = true;
//         gridServiceSpy.scrabbleBoard.squares[0][6].isValidated = false;
//         gridServiceSpy.scrabbleBoard.squares[0][7].occupied = true;
//         gridServiceSpy.scrabbleBoard.squares[0][7].isValidated = false;
//         const word: ScrabbleWord = new ScrabbleWord();
//         word.content = [letter1, letter2, letter2, letter3, letter4, letter4, letter3, letter5];
//         word.orientation = Axis.V;
//         word.startPosition = new Vec2(0, 0);
//         const words: ScrabbleWord[] = [word];
//         expect(service.newLettersCount()).toEqual(8);
//         expect(service.validateWords(words)).toEqual(false);
//     });

//     it('if letters added total is 7, validateWordsAndCalculateScore should add 50 pts bonus', () => {
//         gridServiceSpy.scrabbleBoard.generateBoard(false);
//         const letter1: ScrabbleLetter = new ScrabbleLetter('a', 1);
//         const letter2: ScrabbleLetter = new ScrabbleLetter('p', 1);
//         const letter3: ScrabbleLetter = new ScrabbleLetter('e', 1);
//         const letter4: ScrabbleLetter = new ScrabbleLetter('l', 1);
//         gridServiceSpy.drawLetter(letter1, 0, 0);
//         gridServiceSpy.drawLetter(letter2, 0, 1);
//         gridServiceSpy.drawLetter(letter3, 0, 2);
//         gridServiceSpy.drawLetter(letter4, 0, 3);
//         const word: ScrabbleWord = new ScrabbleWord();
//         word.content = [letter1, letter2, letter2, letter3, letter4, letter4, letter3];
//         word.orientation = Axis.V;
//         word.startPosition = new Vec2(0, 0);
//         const words: ScrabbleWord[] = [word];
//         expect(service.newLettersCount()).toEqual(7);
//         expect(service.calculateScore(words)).toEqual(74); // 24 + 50
//     });

//     it('updatePlayerScore should use bonus when word is valid', () => {
//         const player = new LocalPlayer('Ariane');
//         const letter1: ScrabbleLetter = new ScrabbleLetter('D', 1);
//         const letter2: ScrabbleLetter = new ScrabbleLetter('é', 2);
//         const letter3: ScrabbleLetter = new ScrabbleLetter('j', 4);
//         const letter4: ScrabbleLetter = new ScrabbleLetter('à', 3);
//         const word1: ScrabbleWord = new ScrabbleWord();
//         word1.content = [letter1, letter2, letter3, letter4];
//         word1.orientation = Axis.H;
//         word1.startPosition = new Vec2(0, 0);
//         const words: ScrabbleWord[] = [word1];
//         service.updatePlayerScore(words, player);
//         setTimeout(() => {
//             if (service.isTimerElapsed === true) {
//                 expect(gridServiceSpy.scrabbleBoard.squares[0][0].isValidated).toEqual(true);
//                 expect(service.isTimerElapsed).toEqual(true);
//             }
//         }, WAIT_TIME);
//     });
// });
