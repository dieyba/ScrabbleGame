/* eslint-disable @typescript-eslint/no-magic-numbers */
import { DictionaryType } from '@app/classes/dictionary/dictionary';
import { GameType } from '@app/classes/game-parameters/game-parameters';
import { GAME_CAPACITY } from '@app/components/game-init-form/game-init-form.component';
import { WaitingAreaGameParameters } from './waiting-area-game-parameters';

describe('WaitingAreaGameParameters', () => {
    let parameters: WaitingAreaGameParameters;
    it('should create an instance', () => {
        parameters = new WaitingAreaGameParameters(GameType.Solo, GAME_CAPACITY, DictionaryType.Default, 60, false, false, 'Creator Name');
        expect(parameters).toBeTruthy();
    });
    it('should create an instance with an opponent name', () => {
        parameters = new WaitingAreaGameParameters(
            GameType.Solo,
            GAME_CAPACITY,
            DictionaryType.Default, // TODO: see how dictionary type will change with new dictionary feature
            60,
            false,
            false,
            'Creator Name',
            'Virtual Player Name',
        );
        expect(parameters).toBeTruthy();
    });
});
