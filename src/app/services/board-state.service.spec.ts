import { TestBed, inject } from '@angular/core/testing';

import { BoardStateService } from './board-state.service';

describe('BoardStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BoardStateService]
    });
  });

  it('should be created', inject([BoardStateService], (service: BoardStateService) => {
    expect(service).toBeTruthy();
  }));
});
