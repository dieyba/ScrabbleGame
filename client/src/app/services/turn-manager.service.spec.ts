import { TestBed } from '@angular/core/testing';

import { TurnManagerService } from './turn-manager.service';

describe('TurnManagerService', () => {
    let service: TurnManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TurnManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
