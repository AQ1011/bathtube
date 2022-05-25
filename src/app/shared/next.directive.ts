import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNext]'
})
export class NextDirective {

  constructor(private elementRef: ElementRef) {
  }
  @HostListener('click')
  nextFunc(){
    let elm = this.elementRef.nativeElement.parentElement as HTMLElement;
    let item = elm.getElementsByClassName("popular-item")
    elm.children[1].className += ' scroll-right'
    // elm.append(item[0]);
    this.delay(500).then(() => {
      for(let i = 0; i < 6; i++){
      elm.children[1].append(item[0]);
      };
      elm.children[1].className = 'popular-list'
    });

  }
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
}
