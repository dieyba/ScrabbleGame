import { TestBed } from '@angular/core/testing';

import { CommandInvokerService } from './command-invoker.service';

describe('CommandInvokerService', () => {
  let service: CommandInvokerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommandInvokerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
