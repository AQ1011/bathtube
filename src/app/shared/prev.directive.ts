import { Directive,ElementRef, HostListener  } from '@angular/core';

@Directive({
  selector: '[appPrev]'
})
export class PrevDirective {

  constructor(private elementRef: ElementRef) { }
  @HostListener('click')
  prevFunc(){
    let elm = this.elementRef.nativeElement.parentElement;
    let item = elm.getElementsByClassName("popular-item")
    elm.children[1].className += ' scroll-left'
    // elm.prepend(item[item.length - 1]);
    this.delay(500).then(() => {
      for(let i = 0; i < 6; i++){
        elm.children[1].prepend(item[item.length - 1]);
      }
      elm.children[1].className = 'popular-list'
    });
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
}
