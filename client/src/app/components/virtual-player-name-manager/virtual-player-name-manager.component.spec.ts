/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VirtualPlayerName, VirtualPlayerNameService } from '@app/services/virtual-player-name.service/virtual-player-name.service';
import { of, throwError } from 'rxjs';
import { VirtualPlayerNameManagerComponent } from './virtual-player-name-manager.component';

describe('VirtualPlayerNameManagerComponent', () => {
    let component: VirtualPlayerNameManagerComponent;
    let fixture: ComponentFixture<VirtualPlayerNameManagerComponent>;
    let virtualPlayerNameServiceSpy: jasmine.SpyObj<VirtualPlayerNameService>;

    const defaultBeginnerVirtualPlayerNames = [
        { _id: '1', name: 'Erika' },
        { _id: '2', name: 'Sara' },
        { _id: '3', name: 'Etienne' },
    ];
    const defaultExpertVirtualPlayerNames = [
        { _id: '1', name: 'Dieyba' },
        { _id: '2', name: 'Kevin' },
        { _id: '3', name: 'Ariane' },
    ];
    const randomName = { _id: '4', name: 'Riri' } as VirtualPlayerName;

    beforeEach(async () => {
        virtualPlayerNameServiceSpy = jasmine.createSpyObj('VirtualPlayerNameService', [
            'getVirtualPlayerNames',
            'postVirtualPlayerNames',
            'delete',
            'update',
            'reset',
        ]);

        virtualPlayerNameServiceSpy.getVirtualPlayerNames.and.callFake(() => {
            return of(defaultBeginnerVirtualPlayerNames);
        });

        await TestBed.configureTestingModule({
            declarations: [VirtualPlayerNameManagerComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [HttpClientModule, HttpClientTestingModule, MatSnackBarModule, BrowserAnimationsModule],
            providers: [{ provide: VirtualPlayerNameService, useValue: virtualPlayerNameServiceSpy }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VirtualPlayerNameManagerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.beginnerNameList = [
            { _id: '1', name: 'Erika' },
            { _id: '2', name: 'Sara' },
            { _id: '3', name: 'Etienne' },
        ];
        component.expertNameList = [
            { _id: '1', name: 'Dieyba' },
            { _id: '2', name: 'Kevin' },
            { _id: '3', name: 'Ariane' },
        ];
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('isUntouchable should return true if the selected name is among the first 3 of one of the tab', () => {
        component.beginnerNameList = defaultBeginnerVirtualPlayerNames;
        component.expertNameList = defaultExpertVirtualPlayerNames;
        component.beginnerNameList.push({ _id: '4', name: 'Riri' });
        component.expertNameList.push({ _id: '4', name: 'Lulu' });

        component.selectedName = component.beginnerNameList[3];
        expect(component.isUntouchable()).toBeFalse();

        component.selectedName = component.expertNameList[3];
        expect(component.isUntouchable()).toBeFalse();

        component.selectedName = component.beginnerNameList[0];
        expect(component.isUntouchable()).toBeTrue();

        component.selectedName = component.expertNameList[0];
        expect(component.isUntouchable()).toBeTrue();
    });

    it('addName should call virtualPlayerNameService postVirtualPlayerNames if the name to add is valid', () => {
        virtualPlayerNameServiceSpy.postVirtualPlayerNames.and.callFake(() => {
            return of({ _id: '1', name: 'Riri' });
        });

        component.newName.setValue('Riri9.');
        component.addName(component.beginnerNameList, 'url');
        expect(virtualPlayerNameServiceSpy.postVirtualPlayerNames).not.toHaveBeenCalled();

        component.newName.setValue('Riri');
        component.addName(component.beginnerNameList, 'url');
        expect(virtualPlayerNameServiceSpy.postVirtualPlayerNames).toHaveBeenCalled();
    });

    it('addName should handle error when getting one', () => {
        const spy = spyOn(component['snack'], 'open');
        component.newName.setValue('Riri');

        const errorResponse = new HttpErrorResponse({ statusText: 'Unknown Error' });
        virtualPlayerNameServiceSpy.postVirtualPlayerNames.and.returnValue(throwError(errorResponse));
        component.addName(component.beginnerNameList, 'url');
        expect(spy).toHaveBeenCalled();

        const errorResponse2 = new HttpErrorResponse({ statusText: 'known Error' });
        virtualPlayerNameServiceSpy.postVirtualPlayerNames.and.returnValue(throwError(errorResponse2));
        component.addName(component.beginnerNameList, 'url');
        expect(spy).toHaveBeenCalled();
    });

    it('isBeginnerTab should return true if the selected name is in the beginnerNameList tab', () => {
        component.selectedName = component.beginnerNameList[0];
        expect(component.isBeginnerTab()).toBeTrue();

        component.selectedName = component.expertNameList[0];
        expect(component.isBeginnerTab()).toBeFalse();
    });

    it('deleteName should call isUntouchable', () => {
        virtualPlayerNameServiceSpy.delete.and.callFake(() => {
            return of({ _id: '4', name: 'Riri' } as VirtualPlayerName);
        });

        const spy = spyOn(component, 'isUntouchable');
        component.deleteName();

        expect(spy).toHaveBeenCalled();
    });

    it('deleteName should call isBeginnerTab', () => {
        virtualPlayerNameServiceSpy.delete.and.callFake(() => {
            return of({ _id: '4', name: 'Riri' } as VirtualPlayerName);
        });

        component.beginnerNameList.push(randomName);
        component.selectedName = randomName;
        const spy = spyOn(component, 'isBeginnerTab');
        component.deleteName();

        expect(spy).toHaveBeenCalled();
    });

    it('deleteName should not call delete if we try to delete or isBeginnerTab an untouchable name', () => {
        component.selectedName = component.beginnerNameList[0];
        const deleteSpy = spyOn(component, 'delete' as any);
        const isBeginnerTabSpy = spyOn(component, 'isBeginnerTab');
        component.deleteName();

        expect(deleteSpy).not.toHaveBeenCalled();
        expect(isBeginnerTabSpy).not.toHaveBeenCalled();
    });

    it('deleteName should call delete', () => {
        component.beginnerNameList.push(randomName);
        component.expertNameList.push(randomName);

        const spy = spyOn<any>(component, 'delete');
        component.selectedName = component.beginnerNameList[3];
        component.deleteName();
        expect(spy).toHaveBeenCalled();

        component.selectedName = component.expertNameList[3];
        component.deleteName();
        expect(spy).toHaveBeenCalled();
    });

    it('updateName should call isUntouchable', () => {
        const spy = spyOn(component, 'isUntouchable');
        component.updateName();
        expect(spy).toHaveBeenCalled();
    });

    it('updateName should call isBeginnerTab if the updated name is empty', () => {
        virtualPlayerNameServiceSpy.update.and.callFake(() => {
            return of({ _id: '1', name: 'Riri' });
        });

        component.beginnerNameList.push(randomName);
        // component.expertNameList.push(randomName);

        const spy = spyOn<any>(component, 'isBeginnerTab').and.callThrough();
        component.editName.setValue('');
        component.updateName();
        expect(spy).not.toHaveBeenCalled();

        component.editName.setValue('Riri');

        component.selectedName = randomName;
        component.updateName();
        expect(spy).toHaveBeenCalled();
    });

    it('updateName should call delete', () => {
        virtualPlayerNameServiceSpy.update.and.callFake(() => {
            return of({ _id: '1', name: 'Riri' });
        });
        component.expertNameList.push(randomName);
        component.selectedName = randomName;
        component.editName.setValue('Riri');

        component.updateName();
        expect(virtualPlayerNameServiceSpy.update).toHaveBeenCalled();
    });

    it('onSelect should call isUntouchable', () => {
        const spy = spyOn<any>(component, 'isUntouchable');
        component.onSelect({ _id: '4', name: 'Riri' });
        expect(spy).toHaveBeenCalled();
    });

    it('onSelect should set editName and selectedName with the value of the parameter', () => {
        component.onSelect(component.beginnerNameList[0]);
        expect(component.editName.value).not.toEqual(component.beginnerNameList[0].name);
        expect(component.selectedName).toEqual(component.beginnerNameList[0]);

        component.beginnerNameList.push({ _id: '4', name: 'Riri' });
        component.selectedName = component.beginnerNameList[3];
        component.onSelect(component.beginnerNameList[3]);
        expect(component.editName.value).toEqual(component.beginnerNameList[3].name);
        expect(component.selectedName).toEqual(component.beginnerNameList[3]);
    });

    it('delete should call virtualPlayerNameService delete', () => {
        component.beginnerNameList.push(randomName);
        virtualPlayerNameServiceSpy.delete.and.callFake(() => {
            return of(randomName);
        });

        component['index'] = 3;
        component['delete'](component.beginnerNameList, 'url');
        expect(virtualPlayerNameServiceSpy.delete).toHaveBeenCalled();
    });

    it('delete should delete the element sent by the delete request', () => {
        const randomName2 = { _id: '4', name: 'Riri' };
        component.beginnerNameList.push(randomName2);
        component.selectedName = randomName2;
        virtualPlayerNameServiceSpy.delete.and.returnValue(of(randomName2));

        component['index'] = 3;
        component['delete'](component.beginnerNameList, 'url');

        expect(virtualPlayerNameServiceSpy.delete).toHaveBeenCalled();
        expect(component.beginnerNameList.length).toEqual(3);
    });

    it('delete should catch error when getting one', () => {
        const spy = spyOn(component['snack'], 'open');

        const errorResponse = new HttpErrorResponse({ statusText: 'Unknown Error' });
        virtualPlayerNameServiceSpy.delete.and.returnValue(throwError(errorResponse));

        component['index'] = 4;
        component['delete'](component.beginnerNameList, 'url');
        expect(spy).toHaveBeenCalled();

        const errorResponse2 = new HttpErrorResponse({ statusText: 'known Error' });
        virtualPlayerNameServiceSpy.delete.and.returnValue(throwError(errorResponse2));
        component['delete'](component.beginnerNameList, 'url');
        expect(spy).toHaveBeenCalled();
    });

    it('update should call virtualPlayerNameService update if the name to update with is valid', () => {
        virtualPlayerNameServiceSpy.update.and.callFake(() => {
            return of({ _id: '1', name: 'Riri' });
        });

        component['index'] = 4;

        component.editName.setValue('Riri9.');
        component['update'](component.beginnerNameList, 'url');
        expect(virtualPlayerNameServiceSpy.update).not.toHaveBeenCalled();

        component.editName.setValue('Riri');
        component['update'](component.beginnerNameList, 'url');
        expect(virtualPlayerNameServiceSpy.update).toHaveBeenCalled();
    });

    it('update should handle error when getting one', () => {
        const spy = spyOn(component['snack'], 'open');
        component.newName.setValue('Riri');
        component['index'] = 4;

        const errorResponse = new HttpErrorResponse({ statusText: 'Unknown Error' });
        virtualPlayerNameServiceSpy.update.and.returnValue(throwError(errorResponse));
        component['update'](component.beginnerNameList, 'url');
        expect(spy).toHaveBeenCalled();

        const errorResponse2 = new HttpErrorResponse({ error: 'Ce nom existe d??j??', statusText: 'known Error' });
        virtualPlayerNameServiceSpy.update.and.returnValue(throwError(errorResponse2));
        component['update'](component.beginnerNameList, 'url');
        expect(spy).toHaveBeenCalled();

        const errorResponse3 = new HttpErrorResponse({ statusText: 'known Error' });
        virtualPlayerNameServiceSpy.update.and.returnValue(throwError(errorResponse3));
        component['update'](component.beginnerNameList, 'url');
        expect(spy).toHaveBeenCalled();
    });
});
