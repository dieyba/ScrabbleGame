import { TestBed } from '@angular/core/testing';

import { MouseHandlerService } from './mouse-handler.service';

describe('MouseHandlerService', () => {
    let service: MouseHandlerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(MouseHandlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
