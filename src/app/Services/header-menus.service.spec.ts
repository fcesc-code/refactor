import { TestBed } from '@angular/core/testing';

import { HeaderMenusService } from './header-menus.service';

describe('HeaderMenusService', () => {
  let service: HeaderMenusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeaderMenusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
