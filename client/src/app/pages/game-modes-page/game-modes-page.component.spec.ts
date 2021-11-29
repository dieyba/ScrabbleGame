import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { GameModesComponent } from './game-modes-page.component';

describe('GameModesComponent', () => {
    let component: GameModesComponent;
    let fixture: ComponentFixture<GameModesComponent>;
    let matdialog: jasmine.Spy;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GameModesComponent],
            imports: [
                RouterTestingModule,
                HttpClientModule,
                MatRadioModule,
                MatCardModule,
                MatCheckboxModule,
                MatFormFieldModule,
                MatInputModule,
                MatSelectModule,
                BrowserAnimationsModule,
            ],
            providers: [{ provide: MatDialog, useValue: { open: () => new Observable() } }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GameModesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call openDialog', () => {
        const dialogRefSpyObj = jasmine.createSpyObj({ close: false });
        matdialog = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj); // eslint-disable-line deprecation/deprecation
        component.openDialog(true);
        expect(matdialog).toHaveBeenCalled();
    });

    it('openJoinRoom should open dialog', () => {
        const dialogRefSpyObj = jasmine.createSpyObj({ close: false });
        matdialog = spyOn(TestBed.get(MatDialog), 'open').and.returnValue(dialogRefSpyObj); // eslint-disable-line deprecation/deprecation
        component.openJoinRoom(false);
        expect(matdialog).toHaveBeenCalled();
    });
});
