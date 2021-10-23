import { TestBed } from '@angular/core/testing';

import { ManipulationRackService } from './manipulation-rack.service';

describe('ManipulationRackService', () => {
    let service: ManipulationRackService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ManipulationRackService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
