import { TestBed } from '@angular/core/testing';
import { EaselService } from './easel.service';

describe('EaselService', () => {
    let service: EaselService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EaselService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
