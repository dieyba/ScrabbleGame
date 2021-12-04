import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatDisplayEntry, ChatEntryColor } from 'src/app/classes/chat-display-entry/chat-display-entry';
import { ChatDisplayComponent } from './chat-display.component';

describe('ChatDisplayComponent', () => {
    let chatDisplay: ChatDisplayComponent;
    let fixture: ComponentFixture<ChatDisplayComponent>;

    const systemEntry: ChatDisplayEntry = { color: ChatEntryColor.SystemColor, message: 'error message' };
    const playerEntry: ChatDisplayEntry = { color: ChatEntryColor.LocalPlayer, message: 'player message' };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ChatDisplayComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ChatDisplayComponent);
        chatDisplay = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(chatDisplay).toBeTruthy();
    });

    it("method 'isNewEntry' should return true if 'lastEntry' is undefined", () => {
        const result = chatDisplay.isNewEntry(playerEntry);

        expect(result).toEqual(true);
    });

    it("method 'isNewEntry' should return true if 'lastEntry' is not equal to 'entry'", () => {
        chatDisplay.lastEntry = systemEntry;

        const result = chatDisplay.isNewEntry(playerEntry);

        expect(result).toEqual(true);
    });

    it("method 'isNewEntry' should return false if 'lastEntry' is equal to 'entry'", () => {
        chatDisplay.lastEntry = systemEntry;

        const result = chatDisplay.isNewEntry(systemEntry);

        expect(result).toEqual(false);
    });

    it("method 'updateScroll' should call 'scrollDown' AND 'this.lastEntry' should be equal to 'entry' if 'isNewEntry()' is true", () => {
        const isNewEntrySpy = spyOn(chatDisplay, 'isNewEntry').and.returnValue(true);
        const scrollDownSpy = spyOn(chatDisplay, 'scrollDown').and.stub();

        chatDisplay.updateScroll(playerEntry);

        expect(isNewEntrySpy).toHaveBeenCalled();
        expect(chatDisplay.lastEntry).toEqual(playerEntry);
        expect(scrollDownSpy).toHaveBeenCalled();
    });

    it("method 'updateScroll' should not call 'scrollDown' if 'isNewEntry()' is false", () => {
        const isNewEntrySpy = spyOn(chatDisplay, 'isNewEntry').and.returnValue(false);
        const scrollDownSpy = spyOn(chatDisplay, 'scrollDown').and.stub();

        chatDisplay.updateScroll(playerEntry);

        expect(isNewEntrySpy).toHaveBeenCalled();
        expect(scrollDownSpy).not.toHaveBeenCalled();
    });

    it('scrollDown should set scrollTop to scrollHeight', () => {
        chatDisplay.scrollDown();
        expect(chatDisplay.chatDisplayBox.nativeElement.scrollTop).toEqual(0);
    });
});
