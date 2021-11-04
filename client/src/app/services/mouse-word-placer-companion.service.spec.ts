import { TestBed } from '@angular/core/testing';

import { MouseWordPlacerCompanionService } from './mouse-word-placer-companion.service';

describe('MouseWordPlacerCompanionService', () => {
  let service: MouseWordPlacerCompanionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MouseWordPlacerCompanionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
