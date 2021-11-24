import { TestBed } from '@angular/core/testing';
import { VirtualPlayerNameManager } from './virtual-player-name-manager';

describe('AdminService', () => {
    let service: VirtualPlayerNameManager;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(VirtualPlayerNameManager);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
