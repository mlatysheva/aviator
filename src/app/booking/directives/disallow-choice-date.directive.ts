import { Directive, ElementRef, Input, OnInit, } from '@angular/core';
import { DateService } from '../services/date.service';

@Directive({
  selector: '[appDisallowChoiceDate]'
})
export class DisallowChoiceDateDirective implements OnInit {
  @Input() isFly: boolean;

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    this.enableElement(this.el);
  }

  enableElement(el: ElementRef) {
    if (this.isFly) {
      const element = el.nativeElement;
      element.style.color = 'grey';
      element.style.cursor = 'not-allowed';
      element.style.pointerEvents = 'none';
      element.style.opacity = '0.5';
    }
  }

}
