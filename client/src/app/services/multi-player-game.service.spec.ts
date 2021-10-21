import { TestBed } from '@angular/core/testing';

import { MultiPlayerGameService } from './multi-player-game.service';

describe('MultiPlayerGameService', () => {
  let service: MultiPlayerGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MultiPlayerGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
