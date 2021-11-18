// import { TestBed } from '@angular/core/testing';
// import { ChatDisplayService } from '@app/services/chat-display.service';
// import { LetterStock } from '@app/services/letter-stock.service';
// import { ChatEntryColor, createErrorEntry } from './chat-display-entry';
// import { DefaultCommandParams } from './commands';
// import { ErrorType } from './errors';
// import { createStockCmd, StockCmd } from './stock-command';
// import { scrabbleLettersToString } from './utilities';

// const PLAYER_NAME = 'Sara';

// /* eslint-disable @typescript-eslint/no-shadow */
// describe('StockCmd', () => {
//     let chatDisplayServiceSpy: jasmine.SpyObj<ChatDisplayService>;
//     const localPlayer = new LocalPlayer(PLAYER_NAME);
//     const stock = new LetterStock();
//     const stockLetters = scrabbleLettersToString(stock.letterStock);
//     const expectedResult = [
//         'a : 9',
//         'b : 2',
//         'c : 2',
//         'd : 3',
//         'e : 15',
//         'f : 2',
//         'g : 2',
//         'h : 2',
//         'i : 8',
//         'j : 1',
//         'k : 1',
//         'l : 5',
//         'm : 3',
//         'n : 6',
//         'o : 6',
//         'p : 2',
//         'q : 1',
//         'r : 6',
//         's : 6',
//         't : 6',
//         'u : 6',
//         'v : 2',
//         'w : 1',
//         'x : 1',
//         'y : 1',
//         'z : 1',
//         '* : 2',
//     ];
//     beforeEach(() => {
//         chatDisplayServiceSpy = jasmine.createSpyObj('ChatDisplayService', { isActiveDebug: false });
//         TestBed.configureTestingModule({
//             providers: [{ provide: ChatDisplayService, useValue: chatDisplayServiceSpy }],
//         });
//     });

//     it('should create an instance', () => {
//         const defaultParams: DefaultCommandParams = { player: localPlayer, serviceCalled: chatDisplayServiceSpy };
//         const stock = new StockCmd(defaultParams, stockLetters);
//         expect(stock).toBeTruthy();
//     });

//     it('should call createStockMessage and return an error message', () => {
//         chatDisplayServiceSpy.isActiveDebug = false;
//         const defaultParams: DefaultCommandParams = { player: localPlayer, serviceCalled: chatDisplayServiceSpy };
//         const stock = new StockCmd(defaultParams, stockLetters);
//         const executionResult = stock.execute();
//         const spy = spyOn(stock, 'createStockMessage').and.callThrough();
//         expect(spy).toHaveBeenCalledTimes(0);
//         expect(executionResult).toEqual({
//             isExecuted: false,
//             executionMessages: [createErrorEntry(ErrorType.ImpossibleCommand, '!réserve')],
//         });
//     });
//     it('should call createStockMessage and return successful execution messages', () => {
//         chatDisplayServiceSpy.isActiveDebug = true;
//         const defaultParams: DefaultCommandParams = { player: localPlayer, serviceCalled: chatDisplayServiceSpy };
//         const stock = new StockCmd(defaultParams, stockLetters);
//         const commandMessage = { color: ChatEntryColor.LocalPlayer, message: PLAYER_NAME + ' >> !réserve' };
//         const expectedMessages = [commandMessage];
//         for (const message of expectedResult) {
//             expectedMessages.push({
//                 color: ChatEntryColor.SystemColor,
//                 message,
//             });
//         }
//         const spy = spyOn(stock, 'createStockMessage').and.callThrough();
//         const executionResult = stock.execute();
//         expect(spy).toHaveBeenCalledOnceWith(stockLetters);
//         expect(executionResult).toEqual({ isExecuted: true, executionMessages: expectedMessages });
//     });

//     it('should execute and return impossible command message', () => {
//         chatDisplayServiceSpy.isActiveDebug = false;
//         const defaultParams: DefaultCommandParams = { player: localPlayer, serviceCalled: chatDisplayServiceSpy };
//         const stock = new StockCmd(defaultParams, stockLetters);
//         expect(stock.createStockMessage(stockLetters)).toEqual(ErrorType.ImpossibleCommand);
//     });

//     it('should create 27 stock messages', () => {
//         chatDisplayServiceSpy.isActiveDebug = true;
//         const defaultParams: DefaultCommandParams = { player: localPlayer, serviceCalled: chatDisplayServiceSpy };
//         const stock = new StockCmd(defaultParams, stockLetters);
//         expect(stock.createStockMessage(stockLetters)).toEqual(expectedResult);
//     });

//     it('createStockCmd should create an instance', () => {
//         const defaultParams: DefaultCommandParams = { player: localPlayer, serviceCalled: chatDisplayServiceSpy };
//         const helpParams = {
//             defaultParams,
//             specificParams: stockLetters,
//         };
//         expect(createStockCmd(helpParams)).toBeTruthy();
//     });
// });
