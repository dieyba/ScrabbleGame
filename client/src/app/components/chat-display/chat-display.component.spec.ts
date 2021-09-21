import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatDisplayComponent } from './chat-display.component';

describe('ChatDisplayComponent', () => {
    let chatDisplay: ChatDisplayComponent;
    let fixture: ComponentFixture<ChatDisplayComponent>;

    // TODO update tests!!
    // let systemEntry: ChatEntry = { authorType:AuthorType.System, color:ChatEntryColor.SystemColor, message:"error message"};
    // let playerEntry: ChatEntry = { authorType: AuthorType.Player, color:ChatEntryColor.PlayerColor, message:"player message"};
    // let adversaryEntry: ChatEntry = { authorType:AuthorType.Adversary, color:ChatEntryColor.AdversaryColor, message:"adversary message"};
    // const isAdversary = true;

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

    // TODO update test!!

    // it('should add entries to entry array', () => {
    //     expect(chatDisplay.entries.length).toBe(0);
    //     chatDisplay.addErrorMessage( systemEntry.message);
    //     expect(chatDisplay.entries.length).toBe(1);
    //     chatDisplay.addPlayerEntry(!isAdversary, playerEntry.message);
    //     expect(chatDisplay.entries.length).toBe(2);
    //     chatDisplay.addPlayerEntry(isAdversary, playerEntry.message);
    //     expect(chatDisplay.entries.length).toBe(3);
    // });

    // it('should add entries in the array with the right values', () => {
    //     chatDisplay.addErrorMessage(systemEntry.message);
    //     expect(chatDisplay.entries[chatDisplay.entries.length-1].authorType).toBe(AuthorType.System);
    //     expect(chatDisplay.entries[chatDisplay.entries.length-1].color).toBe(ChatEntryColor.SystemColor);
    //     expect(chatDisplay.entries[chatDisplay.entries.length-1].message).toBe(systemEntry.message);

    //     chatDisplay.addPlayerEntry(!isAdversary, playerEntry.message);
    //     expect(chatDisplay.entries[chatDisplay.entries.length-1].authorType).toBe(AuthorType.Player);
    //     expect(chatDisplay.entries[chatDisplay.entries.length-1].color).toBe(ChatEntryColor.PlayerColor);
    //     expect(chatDisplay.entries[chatDisplay.entries.length-1].message).toBe(playerEntry.message);

    //     chatDisplay.addPlayerEntry(isAdversary, adversaryEntry.message);
    //     expect(chatDisplay.entries[chatDisplay.entries.length-1].authorType).toBe(AuthorType.Adversary);
    //     expect(chatDisplay.entries[chatDisplay.entries.length-1].color).toBe(ChatEntryColor.AdversaryColor);
    //     expect(chatDisplay.entries[chatDisplay.entries.length-1].message).toBe(adversaryEntry.message);
    // });
});
