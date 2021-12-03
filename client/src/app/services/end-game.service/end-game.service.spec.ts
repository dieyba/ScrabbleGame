import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { EndGameService } from './end-game.service';

describe('EndGameService', () => {
    let service: EndGameService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatSnackBarModule, HttpClientModule],
        });
        service = TestBed.inject(EndGameService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
