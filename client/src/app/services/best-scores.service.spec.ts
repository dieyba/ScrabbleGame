/* eslint-disable dot-notation */
import { HttpClientModule, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BestScoresService } from './best-scores.service';

describe('BestScoresService', () => {
    let service: BestScoresService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, MatSnackBarModule],
        });
        service = TestBed.inject(BestScoresService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('handleError should return success message', () => {
        const spy = spyOn(service['snack'], 'open');
        service.handleErrorSnackBar(
            new HttpErrorResponse({
                status: HttpStatusCode.Ok,
            }),
        );
        expect(spy).not.toHaveBeenCalled();
    });

    it('handleError should return error message', () => {
        const spy = spyOn(service['snack'], 'open');
        service.handleErrorSnackBar(
            new HttpErrorResponse({
                status: HttpStatusCode.NotFound,
            }),
        );
        expect(spy).toHaveBeenCalledWith(
            'La base de données et/ou le serveur est momentanément indisponible. Veuillez réessayer plus tard!',
            'close',
        );
    });

    it('getBestScores should get', () => {
        const spy = spyOn(service['http'], 'get');
        service.getBestScores('url');
        expect(spy).toHaveBeenCalled();
    });

    it('postBestScore should post', () => {
        const score = 80;
        const spy = spyOn(service['http'], 'post');
        service.postBestScore('Dieyba', score, 'url');
        expect(spy).toHaveBeenCalled();
    });

    it('resetDbBestScores should post', () => {
        const spy = spyOn(service['http'], 'delete');
        service.resetDbBestScores();
        expect(spy).toHaveBeenCalled();
    });
});
