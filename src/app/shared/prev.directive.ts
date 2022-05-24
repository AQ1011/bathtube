import { Directive,ElementRef, HostListener  } from '@angular/core';

@Directive({
  selector: '[appPrev]'
})
export class PrevDirective {

  constructor(private elementRef: ElementRef) { }
  @HostListener('click')
  prevFunc(){
    let elm = this.elementRef.nativeElement.parentElement.parentElement;
    let item = elm.getElementsByClassName("popular-item")
    // elm.prepend(item[item.length - 1]);
    for(let i = 0; i < 6; i++){
      elm.prepend(item[item.length - 1]);
    }
  }

}
