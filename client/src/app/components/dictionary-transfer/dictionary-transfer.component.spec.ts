/* eslint-disable no-underscore-dangle */
/* eslint-disable dot-notation */
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DictionaryInterface } from '@app/classes/dictionary';
import { DictionaryService } from '@app/services/dictionary.service';
import { of, throwError } from 'rxjs';
import { DictionaryTransferComponent, ErrorCaseDictionaryTransfer } from './dictionary-transfer.component';

describe('DictionaryTransferComponent', () => {
    let component: DictionaryTransferComponent;
    let fixture: ComponentFixture<DictionaryTransferComponent>;
    let dictionaryServiceSpy: jasmine.SpyObj<DictionaryService>;

    const defaultDictionary = [
        {
            _id: '1',
            title: 'title',
            description: 'description',
            words: [],
        },
    ] as DictionaryInterface[];
    const dico1 = {
        _id: '1',
        title: 'dico1',
        description: 'description1',
        words: [],
    } as DictionaryInterface;

    beforeEach(async () => {
        dictionaryServiceSpy = jasmine.createSpyObj('DictionaryService', [
            'uploadFromString',
            'getDictionaries',
            'getDictionary',
            'postDictionary',
            'reset',
            'update',
            'delete',
            'handleErrorSnackBar',
        ]);

        dictionaryServiceSpy.getDictionaries.and.callFake(() => {
            // return of(defaultDictionary);
            return of();
        });

        await TestBed.configureTestingModule({
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            declarations: [DictionaryTransferComponent],
            imports: [HttpClientModule, HttpClientTestingModule, MatSnackBarModule, BrowserAnimationsModule],
            providers: [{ provide: DictionaryService, useValue: dictionaryServiceSpy }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DictionaryTransferComponent);
        component = fixture.componentInstance;
        component.dictionaryList = defaultDictionary;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('updateTitleAndDescription should call snackBar open when the dictionary isnt in the tab or if it is the default dictionary', () => {
        component.selectedDictionary = component.dictionaryList[0];
        const spy = spyOn(component['snack'], 'open');
        component.updateTitleAndDescription('newTitle', 'newDescription');
        expect(spy).toHaveBeenCalled();
    });

    it('updateTitleAndDescription should call snackBar open the new title or description is invalid', () => {
        const spy = spyOn(component['snack'], 'open');

        component.dictionaryList.push(dico1);
        component.selectedDictionary = dico1;
        component.editTitle.setValue('1wrongTitle');
        component.updateTitleAndDescription('newTitle', 'newDescription');
        expect(spy).toHaveBeenCalled();
    });

    it('updateTitleAndDescription should calldictionaryService update', () => {
        const updatedDico = { _id: dico1._id, title: 'newTitle', description: 'newDescription', words: [] } as DictionaryInterface;
        dictionaryServiceSpy.update.and.callFake(() => {
            return of(updatedDico);
        });

        component.dictionaryList.push(dico1);
        component.selectedDictionary = dico1;
        component.editTitle.setValue('titre test');
        component.editDescription.setValue('petite description pour test');

        component.updateTitleAndDescription(updatedDico.title, updatedDico.description);
        expect(dictionaryServiceSpy.update).toHaveBeenCalled();
    });

    it('updateTitleAndDescription should catch error when getting one', () => {
        const spy = spyOn(component['snack'], 'open');
        const updatedDico = { _id: dico1._id, title: 'newTitle', description: 'newDescription', words: [] } as DictionaryInterface;

        component.dictionaryList.push(dico1);
        component.selectedDictionary = dico1;
        component.editTitle.setValue('titre test');
        component.editDescription.setValue('petite description pour test');

        const errorResponse = new HttpErrorResponse({ error: 'test error' });
        dictionaryServiceSpy.update.and.returnValue(throwError(errorResponse));
        component.updateTitleAndDescription(updatedDico.title, updatedDico.description);

        expect(spy).not.toHaveBeenCalled();

        const errorResponse2 = new HttpErrorResponse({ error: 'Ce titre existe déjà' });
        dictionaryServiceSpy.update.and.returnValue(throwError(errorResponse2));
        component.updateTitleAndDescription(updatedDico.title, updatedDico.description);

        expect(spy).toHaveBeenCalled();
        expect(dictionaryServiceSpy.update).toHaveBeenCalledTimes(2);
    });

    it('deleteDictionary should call snackBar open when the dictionary isnt in the tab or if it is the default dictionary', () => {
        component.selectedDictionary = component.dictionaryList[0];
        const spy = spyOn(component['snack'], 'open');
        component.deleteDictionary(component.selectedDictionary);
        expect(spy).toHaveBeenCalledWith(ErrorCaseDictionaryTransfer.Untouchable, 'fermer');
    });

    it('deleteDictionary should call dictionaryService delete', () => {
        dictionaryServiceSpy.delete.and.callFake(() => {
            return of(dico1);
        });

        component.dictionaryList.push(dico1);
        component.selectedDictionary = component.dictionaryList[1];
        component.deleteDictionary(component.selectedDictionary);

        expect(dictionaryServiceSpy.delete).toHaveBeenCalled();
    });

    it('deleteDictionary should handle error when getting one', () => {
        dictionaryServiceSpy.delete.and.callFake(() => {
            return of();
        });
        const spy = spyOn(component['snack'], 'open');

        const errorResponse = new HttpErrorResponse({ statusText: 'Unknown Error' });
        dictionaryServiceSpy.delete.and.returnValue(throwError(errorResponse));

        component.dictionaryList.push(dico1);
        component.selectedDictionary = component.dictionaryList[1];
        component.deleteDictionary(component.selectedDictionary);

        const errorResponse2 = new HttpErrorResponse({ statusText: 'test error' });
        dictionaryServiceSpy.delete.and.returnValue(throwError(errorResponse2));
        component.deleteDictionary(component.selectedDictionary);

        expect(spy).toHaveBeenCalledTimes(2);
    });
});
