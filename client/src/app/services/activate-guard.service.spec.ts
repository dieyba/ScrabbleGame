import { TestBed } from '@angular/core/testing';
import { ActivateGuard } from './activate-guard.service';

describe('ActivateGuard', () => {
    let service: ActivateGuard;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ActivateGuard);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
