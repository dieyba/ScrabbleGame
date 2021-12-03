/* eslint-disable @typescript-eslint/no-magic-numbers */
import { DictionaryInterface } from '@app/classes/dictionary/dictionary';
import { GameType } from '@app/classes/game-parameters/game-parameters';
import { WaitingAreaGameParameters } from '@app/classes/waiting-area-game-parameters/waiting-area-game-parameters';
import { GAME_CAPACITY } from '@app/components/game-init-form/game-init-form.component';
import dict_path from 'src/assets/dictionary.json';

describe('WaitingAreaGameParameters', () => {
    let parameters: WaitingAreaGameParameters;
    it('should create an instance', () => {
        parameters = new WaitingAreaGameParameters(GameType.Solo, GAME_CAPACITY, dict_path as DictionaryInterface, 60, false, false, 'Creator Name');
        expect(parameters).toBeTruthy();
    });
    it('should create an instance with an opponent name', () => {
        parameters = new WaitingAreaGameParameters(
            GameType.Solo,
            GAME_CAPACITY,
            dict_path as DictionaryInterface,
            60,
            false,
            false,
            'Creator Name',
            'Virtual Player Name',
        );
        expect(parameters).toBeTruthy();
    });
});
