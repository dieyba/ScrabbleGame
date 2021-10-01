import { TestBed } from '@angular/core/testing';

import { VirtualPlayerService } from './virtual-player.service';

describe('VirtualPlayerService', () => {
  let service: VirtualPlayerService;
  /*let permutationsOfLettersSpy : jasmine.SpyObj<any>;
  let movesWithGivenLetterSpy : jasmine.SpyObj<any>;
  let possibleMovesSpy : jasmine.SpyObj<any>;
  let makeMovesSpy : jasmine.SpyObj<any>;
  let displayMovesSpy : jasmine.SpyObj<any>;
  let displayMoveChatSpy : jasmine.SpyObj<any>;
  let wordifySpy : jasmine.SpyObj<any>;
  let getRandomIntInclusiveSpy : jasmine.SpyObj<any>;
  let findPositionSpy : jasmine.SpyObj<any>;
  let chooseTilesFromRackSpy : jasmine.SpyObj<any>;*/

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VirtualPlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should return a number between min and max', () =>{
    const min = 0;
    const max = 99;
    const result = service.getRandomIntInclusive(0, 99)
    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThanOrEqual(max);
  })
  
  });
