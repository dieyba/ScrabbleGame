import { TestBed } from '@angular/core/testing';

import { BestScoresService } from './best-scores.service';

describe('BestScoresService', () => {
  let service: BestScoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BestScoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
