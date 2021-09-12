import { TestBed } from '@angular/core/testing';

import { WordBuilderService } from './word-builder.service';

describe('WordBuilderService', () => {
  let service: WordBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
