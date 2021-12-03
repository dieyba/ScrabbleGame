import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExchangeService } from '@app/services/exchange.service/exchange.service';
import { ManipulationRackService } from '@app/services/manipulation-rack.service/manipulation-rack.service';
import { MAX_LETTER_COUNT, RackService } from '@app/services/rack.service/rack.service';
import { RackComponent } from './rack.component';

/* eslint-disable  @typescript-eslint/no-magic-numbers */
describe('RackComponent', () => {
    let component: RackComponent;
    let fixture: ComponentFixture<RackComponent>;
    let rackServiceSpy: jasmine.SpyObj<RackService>;
    let manipulateRackServiceSpy: jasmine.SpyObj<ManipulationRackService>;
    let exchangeServiceSpy: jasmine.SpyObj<ExchangeService>;

    beforeEach(async () => {
        rackServiceSpy = jasmine.createSpyObj('RackService', ['drawRack', 'select', 'deselect', 'deselectAll', 'handleExchangeSelection'], {
            ['exchangeSelected']: [false, false, false, false, false, false, false],
        });
        manipulateRackServiceSpy = jasmine.createSpyObj('ManipulationRackService', [
            'handleSelection',
            'clearManipValues',
            'selectByLetter',
            'switchLeft',
            'switchRight',
        ]);
        exchangeServiceSpy = jasmine.createSpyObj('ExchangeService', ['handleSelection', 'exchange', 'cancelExchange', 'atLeastOneLetterSelected']);

        await TestBed.configureTestingModule({
            declarations: [RackComponent],
            providers: [
                { provide: RackService, useValue: rackServiceSpy },
                { provide: ManipulationRackService, useValue: manipulateRackServiceSpy },
                { provide: ExchangeService, useValue: exchangeServiceSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RackComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onLeftClick should call selectedLetterPosition and manipulationRackService handleSelection', () => {
        const testEvent = new MouseEvent('click');
        const spy = spyOn(component, 'selectedLetterPosition');
        component.onLeftClick(testEvent);

        expect(spy).toHaveBeenCalled();
        expect(manipulateRackServiceSpy.handleSelection).toHaveBeenCalled();
    });

    it('onRightClick should call selectedLetterPosition, manipulationRackService clearManipValues and exchangeService handleSelection', () => {
        const testEvent = new MouseEvent('click');
        const spy = spyOn(component, 'selectedLetterPosition');
        const spyEvent = spyOn(testEvent, 'preventDefault');
        component.onRightClick(testEvent);

        expect(spy).toHaveBeenCalled();
        expect(spyEvent).toHaveBeenCalled();
        expect(manipulateRackServiceSpy.clearManipValues).toHaveBeenCalled();
        expect(exchangeServiceSpy.handleSelection).toHaveBeenCalled();
    });

    it("onFocusOut shouldn't do anything if browser doesn't have focus", () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mockEvent: any = { relatedTarget: null };

        spyOn(document, 'hasFocus').and.returnValue(false);

        component.onFocusOut(mockEvent);

        expect(rackServiceSpy.deselectAll).not.toHaveBeenCalled();
        expect(manipulateRackServiceSpy.clearManipValues).not.toHaveBeenCalled();
    });

    it('onFocusOut should deselect all letters on rackComponent when focus is on anything but the exchange button', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mockEvent: any = { relatedTarget: null };

        spyOn(document, 'hasFocus').and.returnValue(true);

        component.onFocusOut(mockEvent);

        expect(rackServiceSpy.deselectAll).toHaveBeenCalled();
        expect(manipulateRackServiceSpy.clearManipValues).toHaveBeenCalled();
    });

    it('onFocusOut should deselect all letters on rackComponent when focus is on anything but the exchange button', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mockEvent: any = { relatedTarget: { id: 'notExchangeButton' } };

        spyOn(document, 'hasFocus').and.returnValue(true);

        component.onFocusOut(mockEvent);

        expect(rackServiceSpy.deselectAll).toHaveBeenCalled();
        expect(manipulateRackServiceSpy.clearManipValues).toHaveBeenCalled();
    });

    it("onFocusOut shouldn't deselect all letters on rackComponent when focus is on exchange button", () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mockEvent: any = { relatedTarget: { id: 'exchangeButton' } };

        spyOn(document, 'hasFocus').and.returnValue(true);

        component.onFocusOut(mockEvent);

        expect(rackServiceSpy.deselectAll).not.toHaveBeenCalled();
        expect(manipulateRackServiceSpy.clearManipValues).toHaveBeenCalled();
    });

    it('onKeyDown should call just manipulationRackService switchLeft if we press on arrowleft button', () => {
        const testEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
        component.onKeyDown(testEvent);

        expect(manipulateRackServiceSpy.switchLeft).toHaveBeenCalled();
        expect(manipulateRackServiceSpy.switchRight).not.toHaveBeenCalled();
        expect(manipulateRackServiceSpy.selectByLetter).not.toHaveBeenCalled();
    });

    it('onKeyDown should call just manipulationRackService switchRight if we press on arrowright button', () => {
        const testEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
        component.onKeyDown(testEvent);

        expect(manipulateRackServiceSpy.switchRight).toHaveBeenCalled();
        expect(manipulateRackServiceSpy.switchLeft).not.toHaveBeenCalled();
        expect(manipulateRackServiceSpy.selectByLetter).not.toHaveBeenCalled();
    });

    it('onKeyDown should call manipulationRackService selectByLetter if we press a character else than arowleft and arrowright', () => {
        const testEvent = new KeyboardEvent('keydown', { key: 'd' });
        component.onKeyDown(testEvent);

        expect(manipulateRackServiceSpy.selectByLetter).toHaveBeenCalled();
        expect(manipulateRackServiceSpy.switchLeft).not.toHaveBeenCalled();
        expect(manipulateRackServiceSpy.switchRight).not.toHaveBeenCalled();
    });

    it('onKeyDown should not call any method if we press a button else than a letter, number, special character, arrowleft and arrowright', () => {
        const testEvent = new KeyboardEvent('keydown', { key: 'Space' });
        component.onKeyDown(testEvent);

        expect(manipulateRackServiceSpy.selectByLetter).not.toHaveBeenCalled();
        expect(manipulateRackServiceSpy.switchLeft).not.toHaveBeenCalled();
        expect(manipulateRackServiceSpy.switchRight).not.toHaveBeenCalled();
    });

    it('onWheel should call manipulationRackService switchRight if we scroll down', () => {
        const testEvent = new WheelEvent('wheel', { deltaY: 1 });
        component.onWheel(testEvent);

        expect(manipulateRackServiceSpy.switchRight).toHaveBeenCalled();
        expect(manipulateRackServiceSpy.selectByLetter).not.toHaveBeenCalled();
    });

    it('onWheel should call manipulationRackService switchLeft if we scroll up', () => {
        const testEvent = new WheelEvent('wheel', { deltaY: -1 });
        component.onWheel(testEvent);

        expect(manipulateRackServiceSpy.switchLeft).toHaveBeenCalled();
        expect(manipulateRackServiceSpy.selectByLetter).not.toHaveBeenCalled();
    });

    it('selectedLetterPosition should return the position of the letter selected in the rack', () => {
        const testEvent1 = new MouseEvent('click', { clientX: 45 });
        expect(component.selectedLetterPosition(testEvent1)).toEqual(1);

        const testEvent2 = new MouseEvent('click', { clientX: 439 });
        expect(component.selectedLetterPosition(testEvent2)).toEqual(MAX_LETTER_COUNT);
    });

    it('selectedLetterPosition should return 0 if the click is outside the rack', () => {
        const testEvent1 = new MouseEvent('click', { clientX: -1 });
        expect(component.selectedLetterPosition(testEvent1)).toEqual(0);

        const testEvent2 = new MouseEvent('click', { clientX: 441 });
        expect(component.selectedLetterPosition(testEvent2)).toEqual(0);
    });
});
