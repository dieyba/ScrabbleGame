import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { VirtualPlayerNameManagerComponent } from './virtual-player-name-manager.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('VirtualPlayerNameManagerComponent', () => {
    let component: VirtualPlayerNameManagerComponent;
    let fixture: ComponentFixture<VirtualPlayerNameManagerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [VirtualPlayerNameManagerComponent],
            imports: [HttpClientModule, MatSnackBarModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VirtualPlayerNameManagerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
