import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExchangeService } from '@app/services/exchange.service';
import { ManipulationRackService } from '@app/services/manipulation-rack.service';
import { RackService } from '@app/services/rack.service';
import { RackComponent, RACK_HEIGHT, RACK_WIDTH } from './rack.component';

describe('RackComponent', () => {
    let component: RackComponent;
    let fixture: ComponentFixture<RackComponent>;
    let manipulationRackServiceSpy: jasmine.SpyObj<ManipulationRackService>;
    let exchangeServiceSpy: jasmine.SpyObj<ExchangeService>;
    let rackServiceSpy: jasmine.SpyObj<RackService>;

    beforeEach(async () => {
        manipulationRackServiceSpy = jasmine.createSpyObj('ManipulationRackService', ['handleSelection', 'clearManipValues']);
        exchangeServiceSpy = jasmine.createSpyObj('ExchangeService', ['handleSelection']);
        rackServiceSpy = jasmine.createSpyObj('RackService', ['deselectAll']);
        await TestBed.configureTestingModule({
            declarations: [RackComponent],
            providers: [
                { provide: ManipulationRackService, useValue: manipulationRackServiceSpy },
                { provide: ExchangeService, useValue: exchangeServiceSpy },
                { provide: RackService, useValue: rackServiceSpy },
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

    it('onLeftClick should call selectedLetterPosition and manipulationRackService', () => {
        const mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
        } as MouseEvent;
        component.onLeftClick(mouseEvent);
        expect(component.selectedLetterPosition).toHaveBeenCalled;
        expect(manipulationRackServiceSpy.handleSelection).toHaveBeenCalled();
    });

    it('rackHeight should return play area rack height', () => {
        expect(component.rackHeight).toEqual(RACK_HEIGHT);
    });

    it('rackWidth should return play area rack width', () => {
        expect(component.rackWidth).toEqual(RACK_WIDTH);
    });
});
