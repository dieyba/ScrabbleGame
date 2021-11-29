import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { VirtualPlayerNameService } from './virtual-player-name.service';

describe('VirtualPlayerNameService', () => {
    let service: VirtualPlayerNameService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, HttpClientTestingModule ],
        });
        service = TestBed.inject(VirtualPlayerNameService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getVirtualPlayerNames should call http get', () => {
        const spy = spyOn(service['http'], 'get');
        service.getVirtualPlayerNames('url');
        expect(spy).toHaveBeenCalled();
    });

    it('postVirtualPlayerNames should call http post', () => {
        const spy = spyOn(service['http'], 'post');
        service.postVirtualPlayerNames('url', 'name');
        expect(spy).toHaveBeenCalled();
    });

    it('delete should call http delete', () => {
        const spy = spyOn(service['http'], 'delete');
        service.delete('url', 'name');
        expect(spy).toHaveBeenCalled();
    });

    it('update should call http patch', () => {
        const spy = spyOn(service['http'], 'patch');
        service.update('url', 'id', 'name');
        expect(spy).toHaveBeenCalled();
    });

    it('reset should call http delete', () => {
        const spy = spyOn(service['http'], 'delete');
        service.reset();
        expect(spy).toHaveBeenCalled();
    });
});
