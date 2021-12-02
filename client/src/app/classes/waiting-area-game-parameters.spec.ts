/* eslint-disable @typescript-eslint/no-magic-numbers */
import { GAME_CAPACITY } from '@app/components/form/form.component';
import dict_path from 'src/assets/dictionnary.json';
import { DictionaryInterface } from './dictionary';
import { GameType } from './game-parameters';
import { WaitingAreaGameParameters } from './waiting-area-game-parameters';

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
