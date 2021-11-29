import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DictionaryTransferComponent } from './dictionary-transfer.component';

describe('DictionaryTransferComponent', () => {
    let component: DictionaryTransferComponent;
    let fixture: ComponentFixture<DictionaryTransferComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DictionaryTransferComponent],
            imports: [HttpClientModule, HttpClientTestingModule, MatSnackBarModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DictionaryTransferComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
