import { TestBed } from '@angular/core/testing';
import { MouseWordPlacerService } from './mouse-word-placer.service';

describe('MouseWordPlacerService', () => {
    let service: MouseWordPlacerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MouseWordPlacerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
