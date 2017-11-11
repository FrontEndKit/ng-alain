import { Component, Input, ViewEncapsulation, ElementRef, Renderer2, OnChanges, SimpleChanges, OnInit, ContentChild, TemplateRef, ContentChildren, QueryList } from '@angular/core';
import { DescListItemComponent } from './desc-list-item.component';

@Component({
    selector: 'desc-list',
    template: `
    <div *ngIf="_title || _titleTpl" class="title">
        <ng-template #defaultTitleContent>{{_title}}</ng-template>
        <ng-template [ngTemplateOutlet]="_titleTpl || defaultTitleContent"></ng-template>
    </div>
    <div nz-row [nzGutter]="gutter">
        <div nz-col [nzXs]="_xs" [nzSm]="_sm" [nzMd]="_md" *ngFor="let i of _items">
            <ng-template [ngTemplateOutlet]="i.tpl"></ng-template>
        </div>
    </div>
    `,
    styleUrls: [ './desc-list.less' ],
    encapsulation: ViewEncapsulation.None
})
export class DescListComponent implements OnChanges, OnInit {

    // region fields

    _title = '';
    _titleTpl: TemplateRef<any>;
    @Input()
    set title(value: string | TemplateRef<any>) {
        if (value instanceof TemplateRef)
            this._titleTpl = value;
        else
            this._title = value;
    }

    @Input() size: 'small' | 'large';

    @Input() gutter = 32;

    @Input() layout: 'horizontal' | 'vertical' = 'horizontal';

    _xs = 24;
    _sm = 12;
    _md = 8;
    @Input() col = 3;

    setClass() {
        this.renderer.removeAttribute(this.el.nativeElement, 'class');

        const ls = [ 'desc-list', this.layout ];
        if (this.size) ls.push('desc-list-' + this.size);

        ls.forEach(cls => this.renderer.addClass(this.el.nativeElement, cls));
    }

    setResponsive() {
        const responsive = ({
            1: { xs: 24 },
            2: { xs: 24, sm: 12 },
            3: { xs: 24, sm: 12, md: 8 },
            4: { xs: 24, sm: 12, md: 6 },
        })[this.col > 4 ? 4 : this.col];

        this._xs = responsive.xs;
        this._sm = responsive.sm;
        this._md = responsive.md;
    }

    @ContentChildren(DescListItemComponent) _items: QueryList<DescListItemComponent>;

    // endregion

    constructor(private el: ElementRef, private renderer: Renderer2) {}

    ngOnInit() {
        this.setClass();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('size' in changes && !changes.size.firstChange)
            this.setClass();
        if ('col' in changes)
            this.setResponsive();
    }
}