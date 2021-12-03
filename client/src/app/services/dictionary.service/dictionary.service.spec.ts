/* eslint-disable dot-notation */
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DictionaryInterface } from '@app/classes/dictionary/dictionary';
import { DictionaryService } from './dictionary.service';

describe('DictionaryService', () => {
    let service: DictionaryService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule, MatSnackBarModule],
        });
        service = TestBed.inject(DictionaryService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    // it('uploadFromString should call postDictionary', () => {
    //     const spy = spyOn(service, 'postDictionary');
    //     service.uploadFromString('dico.json');
    //     expect(spy).toHaveBeenCalled();
    // });

    it('getDictionaries should call http get', () => {
        const spy = spyOn(service['http'], 'get');
        service.getDictionaries('url');
        expect(spy).toHaveBeenCalled();
    });

    it('getDictionary should call http get', () => {
        const spy = spyOn(service['http'], 'get');
        service.getDictionary('url', 'dicoName');
        expect(spy).toHaveBeenCalled();
    });

    it('postDictionary should call http post', () => {
        const dico = {
            _id: 'id',
            title: 'title',
            description: 'description',
            words: [],
        } as DictionaryInterface;
        const spy = spyOn(service['http'], 'post');
        service.postDictionary(dico, 'dicoName');
        expect(spy).toHaveBeenCalled();
    });

    it('reset should call http delete', () => {
        const spy = spyOn(service['http'], 'delete');
        service.reset();
        expect(spy).toHaveBeenCalled();
    });

    it('update  should call http patch', () => {
        const spy = spyOn(service['http'], 'patch');
        service.update('url', 'dicoName', 'id', 'newTitle', 'newDescription');
        expect(spy).toHaveBeenCalled();
    });

    it('delete should call http delete', () => {
        const spy = spyOn(service['http'], 'delete');
        service.delete('id');
        expect(spy).toHaveBeenCalled();
    });
});
