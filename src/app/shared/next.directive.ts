import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNext]'
})
export class NextDirective {

  constructor(private elementRef: ElementRef) {
    console.log(this.elementRef.nativeElement)
  }
  @HostListener('click')
  nextFunc(){
    let elm = this.elementRef.nativeElement.parentElement.parentElement;
    let item = elm.getElementsByClassName("popular-item")
    // elm.append(item[0]);
    for(let i = 0; i < 6; i++){
      elm.append(item[0]);
    }
  }

}
