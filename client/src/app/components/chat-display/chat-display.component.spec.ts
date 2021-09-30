import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthorType, ChatDisplayEntry, ChatEntryColor } from 'src/app/classes/chat-display-entry';
import { ChatDisplayComponent } from './chat-display.component';

describe('ChatDisplayComponent', () => {
    let chatDisplay: ChatDisplayComponent;
    let fixture: ComponentFixture<ChatDisplayComponent>;

    const systemEntry: ChatDisplayEntry = { authorType: AuthorType.System, color: ChatEntryColor.SystemColor, message: 'error message' };
    const playerEntry: ChatDisplayEntry = { authorType: AuthorType.LocalPlayer, color: ChatEntryColor.LocalPlayer, message: 'player message' };

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

    // TODO : Demander dans le forum commment tester des functions qui utilise seulement des elements html
    // it("'scrollDown' should scroll to the bottom of 'input' element", () => {
    //     const SCROLL_HEIGHT = 100;
    //     const SCROLL_VALUE_FROM_TOP = 50;

    //     chatDisplay.chatDisplayBox.nativeElement.scrollHeight = SCROLL_HEIGHT;
    //     chatDisplay.chatDisplayBox.nativeElement.scrollTop = SCROLL_VALUE_FROM_TOP;
    //     // const bannerDe: DebugElement = fixture.debugElement;
    //     // const bannerEl: HTMLElement = bannerDe.nativeElement;
    //     // const input = bannerEl.querySelector('input');
    //     // input?.scrollHeight = SCROLL_HEIGHT;
    //     // input?.scrollTop = SCROLL_VALUE_FROM_TOP;

    //     chatDisplay.scrollDown();
    //     expect(chatDisplay.chatDisplayBox.nativeElement.scrollTop).toEqual(SCROLL_HEIGHT);
    // });
});
