import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { TextEntryService } from '@app/services/text-entry.service/text-entry.service';
import { TextEntryComponent } from './text-entry.component';
import SpyObj = jasmine.SpyObj;

describe('TextEntryComponent', () => {
    let component: TextEntryComponent;
    let fixture: ComponentFixture<TextEntryComponent>;

    let textEntryServiceSpy: SpyObj<TextEntryService>;

    beforeEach(async () => {
        textEntryServiceSpy = jasmine.createSpyObj('TextEntryService', ['handleInput']);
        TestBed.configureTestingModule({
            declarations: [TextEntryComponent],
            imports: [MatCardModule],

            providers: [{ provide: TextEntryService, useValue: textEntryServiceSpy }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TextEntryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onKeyUpEnter should call textEntryService.handleInput', () => {
        component.onKeyUpEnter();

        expect(textEntryServiceSpy.handleInput).toHaveBeenCalled();
    });
});
