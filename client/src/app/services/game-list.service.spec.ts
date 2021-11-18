// import { TestBed } from '@angular/core/testing';
// import { GameParameters } from '@app/classes/game-parameters';
// import * as io from 'socket.io-client';
// import { GameListService } from './game-list.service';

// /* eslint-disable  @typescript-eslint/no-explicit-any */
// /* eslint-disable  @typescript-eslint/no-magic-numbers */
// /* eslint-disable no-unused-vars */
// /* eslint-disable dot-notation */
// class SocketMock {
//     id: string = 'Socket mock';
//     events: Map<string, CallableFunction> = new Map();
//     on(eventName: string, cb: CallableFunction) {
//         this.events.set(eventName, cb);
//     }

//     triggerEvent(eventName: string, ...args: any[]) {
//         const arrowFunction = this.events.get(eventName) as CallableFunction;
//         arrowFunction(...args);
//     }

//     join(...args: any[]) {
//         return;
//     }
//     emit(...args: any[]) {
//         return;
//     }

//     disconnect() {
//         return;
//     }
// }
// describe('GameListService', () => {
//     let service: GameListService;
//     let socketMock: SocketMock;
//     let socketMockSpy: jasmine.SpyObj<any>;
//     beforeEach(() => {
//         TestBed.configureTestingModule({});
//         service = TestBed.inject(GameListService);
//         socketMock = new SocketMock();
//         service['socket'] = socketMock as unknown as io.Socket;
//         socketMockSpy = spyOn(socketMock, 'emit');
//     });

//     it('should be created', () => {
//         expect(service).toBeTruthy();
//     });
//     it('should createRoom ', () => {
//         const game = new GameParameters('dieyba', 60, false);
//         service.createRoom(game);
//         expect(socketMockSpy).toHaveBeenCalledWith('createRoom', {
//             name: 'dieyba',
//             timer: 60,
//             board: false,
//             creatorLetters: [],
//             opponentLetters: [],
//             stock: [],
//         });
//     });
//     it('should deleteRoom ', () => {
//         service.deleteRoom();
//         expect(socketMockSpy).toHaveBeenCalledWith('deleteRoom');
//     });
//     it('should start ', () => {
//         const game = new GameParameters('dieyba', 60, false);
//         game.gameRoom.idGame = 2;
//         const joinerName = 'erika';
//         service.start(game, joinerName);
//         expect(socketMockSpy).toHaveBeenCalledWith('joinRoom', {
//             gameId: game.gameRoom.idGame,
//             joinerName,
//         });
//     });
//     it('should call someoneLeftRoom ', () => {
//         service.someoneLeftRoom();
//         expect(socketMockSpy).toHaveBeenCalledWith('leaveRoom');
//     });
//     it('should call initializeGame ', () => {
//         const roomId = 2;
//         service.initializeGame(roomId);
//         expect(socketMockSpy).toHaveBeenCalledWith('initializeGame', roomId);
//     });
//     it('should getList ', () => {
//         const game = new GameParameters('dieyba', 60, false);
//         service.existingRooms.push(game);
//         service.getList();
//         expect(service.existingRooms.length).toEqual(1);
//     });
//     // it('should catch event getAllGames ', () => {
//     //     let socketMockSpyOn = spyOn(socketMock, 'on');

//     //     expect(socketMockSpyOn).toHaveBeenCalledWith('initializeGame', (game: any) => {
//     //         service.existingRooms = game;
//     //     })
//     // });
// });
