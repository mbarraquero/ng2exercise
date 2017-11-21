import { Directive, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnEnter]'
})
export class OnEnterDirective {

  private static ENTER = 13;
  private static SHIFT = 16;
  shiftPressed: boolean; 

  constructor() { }

  @Input("appOnEnter") onEnter: Function;

  @HostListener("keyup", ["$event"]) onKeyUp(event: KeyboardEvent) {
    if (event.which === OnEnterDirective.ENTER && this.shiftPressed) this.onEnter();
    if (event.which === OnEnterDirective.SHIFT) this.shiftPressed = true;
  }

  @HostListener("keydown", ["$event"]) onKeyDown(event: KeyboardEvent) {
    if (event.which === OnEnterDirective.SHIFT) this.shiftPressed = false;
  }
}
