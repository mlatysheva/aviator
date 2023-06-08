import { Directive, ElementRef, Input, OnInit, } from '@angular/core';

@Directive({
  selector: '[appDisallowChoiceDate]'
})
export class DisallowChoiceDateDirective implements OnInit {
  // @Input() public isFly: boolean;
  // @Input() public date: string;
  @Input() options: any = {
    isFly: false,
    date: ''
  };

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    this.enableElement(this.el);
  }

  enableElement(el: ElementRef) {
    const element = el.nativeElement;
    if (this.options.isFly) {
      element.style.color = 'grey';
      element.style.cursor = 'not-allowed';
      element.style.pointerEvents = 'none';
      element.style.opacity = '0.5';
      // styles for children
      const children = element.children;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        child.style.color = 'grey';
        child.style.cursor = 'not-allowed';
        child.style.pointerEvents = 'none';
        child.style.opacity = '0.5';
      }
    }
    if (!this.options.isFly && element.id.toString().trim() === this.options.date.toString().trim()) {
      element.classList.add('large');
      element.children[0].children[0].classList.add('big-date');
      element.children[0].children[1].classList.add('big-weekday');
      element.children[0].children[2].classList.add('big-price');

    }
  }

}
