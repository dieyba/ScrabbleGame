import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { VirtualPlayerNameManager } from './virtual-player-name-manager';

describe('VirtualPlayerNameManager', () => {
    let service: VirtualPlayerNameManager;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
        });
        service = TestBed.inject(VirtualPlayerNameManager);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
