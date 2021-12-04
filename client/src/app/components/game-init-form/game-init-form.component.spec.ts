// /* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { GameInitFormComponent } from '@app/components/game-init-form/game-init-form.component';
import { GameListService } from '@app/services/game-list.service/game-list.service';
import { VirtualPlayerName } from '@app/services/virtual-player-name.service/virtual-player-name.service';
import { Observable } from 'rxjs';

describe('GameInitFormComponent', () => {
    let component: GameInitFormComponent;
    let fixture: ComponentFixture<GameInitFormComponent>;
    let gameListServiceSpy: jasmine.SpyObj<GameListService>;
    const list: VirtualPlayerName[] = [
        { _id: '0', name: 'dieyna' },
        { _id: '0', name: 'kevin' },
        { _id: '0', name: 'Arian' },
    ];
    let dialogSpy: jasmine.Spy;
    let matdialog: jasmine.Spy;
    // let dialog: jasmine.SpyObj<MatDialogRef<GameInitFormComponent>> = jasmine.createSpyObj('dialog', ['close']);
    beforeEach(async () => {
        gameListServiceSpy = jasmine.createSpyObj('GameListService', ['createRoom']);

        await TestBed.configureTestingModule({
            declarations: [GameInitFormComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [
                MatRadioModule,
                MatCardModule,
                MatCheckboxModule,
                MatFormFieldModule,
                MatInputModule,
                RouterTestingModule,
                MatSelectModule,
                FormsModule,
                ReactiveFormsModule,
                MatDialogModule,
                BrowserAnimationsModule,
                RouterModule,
                HttpClientModule,
                HttpClientTestingModule,
                MatSnackBarModule,
                BrowserAnimationsModule,
            ],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MatDialogRef, useValue: { close: () => {} } }, // eslint-disable-line @typescript-eslint/no-empty-function
                { provide: Router, useValue: { navigate: () => new Observable() } },
                { provide: MatDialog, useValue: { open: () => new Observable() } },
                { provide: GameListService, useValue: gameListServiceSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GameInitFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('ngOnInit should call createFormControl, createForm and getDatabaseInformation', () => {
        const createFormControlSpy: jasmine.Spy<jasmine.Func> = spyOn(component, 'createFormControl' as any);
        const createFormSpy: jasmine.Spy<jasmine.Func> = spyOn(component, 'createForm' as any);
        const getDatabaseInformation: jasmine.Spy<jasmine.Func> = spyOn(component, 'getDatabaseInformation' as any);
        component.ngOnInit();

        expect(createFormControlSpy).toHaveBeenCalled();
        expect(createFormSpy).toHaveBeenCalled();
        expect(getDatabaseInformation).toHaveBeenCalled();
    });

    it('should call close() ', () => {
        const dialogRefSpyObj = jasmine.createSpyObj({ close: true });
        dialogSpy = spyOn(TestBed.get(MatDialogRef), 'close').and.returnValue(dialogRefSpyObj); // eslint-disable-line deprecation/deprecation
        component.closeDialog();
        expect(dialogSpy).toHaveBeenCalled();
    });

    it('randomPlayer should set selectedName with a name of the list', () => {
        component.selectedPlayer = '';
        component.randomPlayer(list);
        expect(component.selectedPlayer).not.toEqual('');
    });

    it('convert() should open dialog', () => {
        const dialogRefSpyObj = jasmine.createSpyObj({ close: false });
        matdialog = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj); // eslint-disable-line deprecation/deprecation
        component.convert();
        expect(matdialog).toHaveBeenCalled();
    });

    it('should call randomPlayer() if the selected name is equal to the name of the first player', () => {
        component.selectedPlayer = 'dieyna';
        const spy = spyOn(component, 'randomPlayer');
        component.name.setValue('dieyna');
        component.changeName(list);
        expect(spy).toHaveBeenCalled();
    });

    it('should not call randomPlayer() ', () => {
        component.selectedPlayer = 'kevin';
        const spy = spyOn(component, 'randomPlayer');
        component.name.setValue('dieyna');
        component.changeName(list);
        expect(spy).not.toHaveBeenCalled();
    });

    it('form invalid when empty', () => {
        component.submit();
        expect(component.myForm.valid).toBeFalsy();
    });

    it('form valid when submit', () => {
        component.myForm.setValue({
            name: 'dieyna',
            timer: '1:00',
            bonus: true,
            level: 'difficult',
            dictionaryForm: 'Francais',
            opponent: 'Sara',
        });
        component.data.isSolo = true;
        component.submit();
        expect(component.myForm.valid).toBeTrue();
    });

    it('submit should call createRoom when it is multiplayer mode', () => {
        component.myForm.setValue({
            name: 'dieyna',
            timer: '1:00',
            bonus: true,
            level: 'easy',
            dictionaryForm: 'Francais',
            opponent: 'Sara',
        });
        component.data.isSolo = true;
        component.submit();
        expect(gameListServiceSpy.createRoom).not.toHaveBeenCalled();

        component.data.isSolo = false;
        component.submit();
        expect(gameListServiceSpy.createRoom).toHaveBeenCalled();
    });
});
