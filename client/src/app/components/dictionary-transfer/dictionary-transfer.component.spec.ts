/* eslint-disable max-lines */
// /* eslint-disable max-lines */
// /* eslint-disable no-underscore-dangle */
// /* eslint-disable dot-notation */
// import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { DictionaryInterface } from '@app/classes/dictionary/dictionary';
// import { DictionaryTransferComponent, ErrorCaseDictionaryTransfer } from '@app/components/dictionary-transfer/dictionary-transfer.component';
// import { DictionaryService } from '@app/services/dictionary.service/dictionary.service';
// import { of, throwError } from 'rxjs';

// describe('DictionaryTransferComponent', () => {
//     let component: DictionaryTransferComponent;
//     let fixture: ComponentFixture<DictionaryTransferComponent>;
//     let dictionaryServiceSpy: jasmine.SpyObj<DictionaryService>;
//     let snackSpy: jasmine.SpyObj<MatSnackBar>;
//     let fileListMock: FileList;

//     const defaultDictionaryList = [
//         {
//             _id: '1',
//             title: 'title',
//             description: 'description',
//             words: [],
//         },
//     ] as unknown as DictionaryInterface[];
//     const dico1 = {
//         _id: '1',
//         title: 'dico1',
//         description: 'description1',
//         words: [],
//     } as DictionaryInterface;

//     beforeEach(async () => {
//         dictionaryServiceSpy = jasmine.createSpyObj('DictionaryService', [
//             'uploadFromString',
//             'getDictionaries',
//             'getDictionary',
//             'postDictionary',
//             'reset',
//             'update',
//             'delete',
//             'handleErrorSnackBar',
//         ]);

//         snackSpy = jasmine.createSpyObj('Snack', ['open']);

//         dictionaryServiceSpy.getDictionaries.and.callFake(() => {
//             return of();
//         });

//         const blob = new Blob(['{"title": "name","description": "A dictionary", "words": ["word"]}']);
//         const file: File = new File([blob], 'filename');
//         fileListMock = {
//             0: file,
//             length: 1,
//             item: () => {
//                 return file;
//             },
//         };

//         await TestBed.configureTestingModule({
//             schemas: [CUSTOM_ELEMENTS_SCHEMA],
//             declarations: [DictionaryTransferComponent],
//             imports: [HttpClientModule, HttpClientTestingModule, MatSnackBarModule, BrowserAnimationsModule],
//             providers: [
//                 { provide: DictionaryService, useValue: dictionaryServiceSpy },
//                 { provide: MatSnackBar, useValue: snackSpy },
//             ],
//         }).compileComponents();
//     });

//     beforeEach(() => {
//         fixture = TestBed.createComponent(DictionaryTransferComponent);
//         component = fixture.componentInstance;
//         component.dictionaryList = defaultDictionaryList;
//         fixture.detectChanges();
//     });

//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });

//     it('ngAfterViewInit should call getDictionaries and updateDictionaryList if there is no error', () => {
//         dictionaryServiceSpy.getDictionaries.and.callFake(() => {
//             return of(defaultDictionaryList);
//         });

//         const spy = spyOn(component, 'updateDictionaryList');

//         component.ngAfterViewInit();

//         expect(dictionaryServiceSpy.getDictionaries).toHaveBeenCalled();
//         expect(spy).toHaveBeenCalled();
//     });

//     it('ngAfterViewInit should call getDictionaries and updateDictionaryList if there is no error', () => {
//         const errorResponse = new HttpErrorResponse({ statusText: 'Unknown Error' });
//         dictionaryServiceSpy.getDictionaries.and.returnValue(throwError(errorResponse));

//         const spy = spyOn(component, 'updateDictionaryList');

//         component.ngAfterViewInit();

//         expect(dictionaryServiceSpy.getDictionaries).toHaveBeenCalled();
//         expect(spy).not.toHaveBeenCalled();
//         expect(dictionaryServiceSpy.handleErrorSnackBar).toHaveBeenCalled();
//     });

//     it('onUpload should do nothing if event is null', () => {
//         const isFileJSONSpy = spyOn(component, 'isFileJSON').and.returnValue(false);
//         snackSpy.open.and.stub();
//         const uploadSpy = spyOn(component, 'upload').and.stub();
//         const readAsTextSpy = spyOn(FileReader.prototype, 'readAsText').and.callFake(() => {
//             component.upload('');
//         });

//         const event: EventTarget | null = null;

//         component.onUpload(event);

//         expect(isFileJSONSpy).not.toHaveBeenCalled();
//         expect(snackSpy.open).not.toHaveBeenCalled();
//         expect(readAsTextSpy).not.toHaveBeenCalled();
//         expect(uploadSpy).not.toHaveBeenCalled();
//     });

//     it('onUpload should do nothing if there is no file', () => {
//         const isFileJSONSpy = spyOn(component, 'isFileJSON').and.returnValue(false);
//         snackSpy.open.and.stub();
//         const uploadSpy = spyOn(component, 'upload').and.stub();
//         const readAsTextSpy = spyOn(FileReader.prototype, 'readAsText').and.callFake(() => {
//             component.upload('');
//         });

//         const eventMock = { files: undefined };
//         const event: EventTarget | null = eventMock as unknown as EventTarget;

//         component.onUpload(event);

//         expect(isFileJSONSpy).not.toHaveBeenCalled();
//         expect(snackSpy.open).not.toHaveBeenCalled();
//         expect(readAsTextSpy).not.toHaveBeenCalled();
//         expect(uploadSpy).not.toHaveBeenCalled();
//     });

//     it('onUpload should do nothing if file is not a JSON', () => {
//         const isFileJSONSpy = spyOn(component, 'isFileJSON').and.returnValue(false);
//         snackSpy.open.and.stub();
//         const uploadSpy = spyOn(component, 'upload').and.stub();
//         const readAsTextSpy = spyOn(FileReader.prototype, 'readAsText').and.callFake(() => {
//             component.upload('');
//         });

//         const eventMock = { files: fileListMock };
//         const event: EventTarget | null = eventMock as unknown as EventTarget;

//         component.onUpload(event);

//         expect(isFileJSONSpy).toHaveBeenCalled();
//         expect(snackSpy.open).toHaveBeenCalledWith('Le fichier doit être un «.json»', 'fermer');
//         expect(readAsTextSpy).not.toHaveBeenCalled();
//         expect(uploadSpy).not.toHaveBeenCalled();
//     });

//     it('onUpload should call readAsText if everything is ok', () => {
//         const isFileJSONSpy = spyOn(component, 'isFileJSON').and.returnValue(true);
//         snackSpy.open.and.stub();
//         const uploadSpy = spyOn(component, 'upload').and.stub();
//         const readAsTextSpy = spyOn(FileReader.prototype, 'readAsText').and.callFake(() => {
//             component.upload('');
//         });

//         const eventMock = { files: fileListMock };
//         const event: EventTarget | null = eventMock as unknown as EventTarget;

//         component.onUpload(event);

//         expect(isFileJSONSpy).toHaveBeenCalled();
//         expect(snackSpy.open).not.toHaveBeenCalled();
//         expect(readAsTextSpy).toHaveBeenCalled();
//         expect(uploadSpy).toHaveBeenCalled();
//     });

//     it('upload should open a "snack" and update this.lastUploadedDictionary', () => {
//         const noDictionary = { _id: 0, title: 'no title', description: 'no description', words: ['no words'] };
//         component.lastUploadedDictionary = noDictionary;

//         dictionaryServiceSpy.uploadFromString.and.callFake(() => {
//             return of(dico1);
//         });

//         component.upload('');

//         expect(component.lastUploadedDictionary).toEqual(dico1);
//         expect(snackSpy.open).toHaveBeenCalledWith('Téléversement réussi!', 'Fermer');
//     });

//     it('upload should call handleErrorSnackBar', () => {
//         const noDictionary = { _id: 0, title: 'no title', description: 'no description', words: ['no words'] };
//         component.lastUploadedDictionary = noDictionary;

//         const errorResponse = new HttpErrorResponse({ statusText: 'Unknown Error' });
//         dictionaryServiceSpy.uploadFromString.and.returnValue(throwError(errorResponse));

//         component.upload('');

//         expect(component.lastUploadedDictionary).toEqual(noDictionary);
//         expect(snackSpy.open).not.toHaveBeenCalled();
//     });

//     it('onDictionarySelection should set selected dictionaries and others', () => {
//         component.dictionaryList = [dico1];
//         const editTitleSpy = spyOn(component.editTitle, 'setValue');
//         const editDescriptionSpy = spyOn(component.editDescription, 'setValue');

//         component.onDictionarySelection(0);

//         expect(component.selectedDictionary).toEqual(dico1);
//         expect(editTitleSpy).toHaveBeenCalled();
//         expect(editDescriptionSpy).toHaveBeenCalled();
//     });

//     it('onDownload should call download when there is no error', () => {
//         const downloadSpy = spyOn(component, 'download').and.stub();
//         dictionaryServiceSpy.getDictionary.and.callFake(() => {
//             return of(dico1);
//         });

//         component.onDownload();

//         expect(downloadSpy).toHaveBeenCalledWith(dico1);
//     });

//     it('onDownload should call handleErrorSnackBar', () => {
//         const errorResponse = new HttpErrorResponse({ statusText: 'Unknown Error' });
//         dictionaryServiceSpy.getDictionary.and.returnValue(throwError(errorResponse));

//         component.onDownload();

//         expect(dictionaryServiceSpy.handleErrorSnackBar).toHaveBeenCalled();
//     });

//     it('download should create a element to be able to download the JSON', () => {
//         const createElementSpy = spyOn(document, 'createElement').and.callThrough();
//         component.download(dico1);
//         expect(createElementSpy).toHaveBeenCalled();
//     });

//     it('updateDictionaryList should update the dictionaries and put the selectedDictionary to the first value', () => {
//         const dictionaryList = [dico1, dico1];
//         component.dictionaryList = [];
//         const noDictionary = { _id: 0, title: 'no title', description: 'no description', words: ['no words'] };
//         component.selectedDictionary = noDictionary;

//         component.updateDictionaryList(dictionaryList);

//         expect(component.selectedDictionary).toEqual(dico1);
//         expect(component.dictionaryList[0]).toEqual(dico1);
//         expect(component.dictionaryList[1]).toEqual(dico1);
//     });

//     it("updateTitleAndDescription should call snackBar open when the dictionary isn't in the tab or if it is the default dictionary", () => {
//         component.selectedDictionary = component.dictionaryList[0];
//         component.updateTitleAndDescription('newTitle', 'newDescription');
//         expect(snackSpy.open).toHaveBeenCalled();
//     });

//     it('updateTitleAndDescription should call snackBar open the new title or description is invalid', () => {
//         component.dictionaryList.push(dico1);
//         component.selectedDictionary = dico1;
//         component.editTitle.setValue('1wrongTitle');
//         component.updateTitleAndDescription('newTitle', 'newDescription');
//         expect(snackSpy.open).toHaveBeenCalled();
//     });

//     it('updateTitleAndDescription should call dictionaryService update', () => {
//         const updatedDico = { _id: dico1._id, title: 'newTitle', description: 'newDescription', words: [] } as DictionaryInterface;
//         dictionaryServiceSpy.update.and.callFake(() => {
//             return of(updatedDico);
//         });

//         component.dictionaryList.push(dico1);
//         component.selectedDictionary = dico1;
//         component.editTitle.setValue('titre test');
//         component.editDescription.setValue('petite description pour test');

//         component.updateTitleAndDescription(updatedDico.title, updatedDico.description);
//         expect(dictionaryServiceSpy.update).toHaveBeenCalled();
//     });

//     it('updateTitleAndDescription should catch error when getting one', () => {
//         const updatedDico = { _id: dico1._id, title: 'newTitle', description: 'newDescription', words: [] } as DictionaryInterface;

//         component.dictionaryList.push(dico1);
//         component.selectedDictionary = dico1;
//         component.editTitle.setValue('titre test');
//         component.editDescription.setValue('petite description pour test');

//         const errorResponse = new HttpErrorResponse({ error: 'test error' });
//         dictionaryServiceSpy.update.and.returnValue(throwError(errorResponse));
//         component.updateTitleAndDescription(updatedDico.title, updatedDico.description);

//         expect(snackSpy.open).not.toHaveBeenCalled();

//         const errorResponse2 = new HttpErrorResponse({ error: 'Ce titre existe déjà' });
//         dictionaryServiceSpy.update.and.returnValue(throwError(errorResponse2));
//         component.updateTitleAndDescription(updatedDico.title, updatedDico.description);

//         expect(snackSpy.open).toHaveBeenCalled();
//         expect(dictionaryServiceSpy.update).toHaveBeenCalledTimes(2);
//     });

//     it('deleteDictionary should call snackBar open when the dictionary isnt in the tab or if it is the default dictionary', () => {
//         component.selectedDictionary = component.dictionaryList[0];
//         component.deleteDictionary(component.selectedDictionary);
//         expect(snackSpy.open).toHaveBeenCalledWith(ErrorCaseDictionaryTransfer.Untouchable, 'fermer');
//     });

//     it('deleteDictionary should call dictionaryService delete', () => {
//         dictionaryServiceSpy.delete.and.callFake(() => {
//             return of(dico1);
//         });

//         component.dictionaryList.push(dico1);
//         component.selectedDictionary = component.dictionaryList[1];
//         component.deleteDictionary(component.selectedDictionary);

//         expect(dictionaryServiceSpy.delete).toHaveBeenCalled();
//     });

//     it('deleteDictionary should handle error when getting one', () => {
//         dictionaryServiceSpy.delete.and.callFake(() => {
//             return of();
//         });

//         const errorResponse = new HttpErrorResponse({ statusText: 'Unknown Error' });
//         dictionaryServiceSpy.delete.and.returnValue(throwError(errorResponse));

//         component.dictionaryList.push(dico1);
//         component.selectedDictionary = component.dictionaryList[1];
//         component.deleteDictionary(component.selectedDictionary);

//         const errorResponse2 = new HttpErrorResponse({ statusText: 'test error' });
//         dictionaryServiceSpy.delete.and.returnValue(throwError(errorResponse2));
//         component.deleteDictionary(component.selectedDictionary);

//         expect(snackSpy.open).toHaveBeenCalledTimes(2);
//     });

//     it('isFileJSON should return true if the filename contains ".json"', () => {
//         expect(component.isFileJSON('realJSON.json')).toEqual(true);
//     });

//     it('isFileJSON should return false if the filename doesn\'t contains ".json"', () => {
//         expect(component.isFileJSON('falseJSON.txt')).toEqual(false);
//     });
// });
