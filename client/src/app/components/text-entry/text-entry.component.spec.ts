import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TextEntryService } from '@app/services/text-entry.service';
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

    // TODO Test number of characters entered by user. User most not be able to enter
    //      more than 512 characters
});
