import {
    Component, ViewChild, ViewContainerRef, ComponentRef, Compiler, ComponentFactory, NgModule,
    ModuleWithComponentFactories, ComponentFactoryResolver, Input, OnInit, OnChanges, SimpleChanges, ElementRef
} from '@angular/core';

import {CommonModule} from '@angular/common';
import {DynamicComponentsModule} from '../dynamic-components/dynamic-components.module';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

declare let FB: any;

@Component({
    selector: 'runtime-content',
    template: '<div #container></div>'
})

export class RuntimeContentComponent implements OnInit, OnChanges {
    @Input() template: string;

    @ViewChild('container', {read: ViewContainerRef})
    container: ViewContainerRef;

    private componentRef: ComponentRef<{}>;

    constructor(private compiler: Compiler, private element: ElementRef, private sanitizer: DomSanitizer) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        for (let propertyName in changes) {
            if (propertyName == 'template') {
                this.compileTemplate();
            }
        }
    }

    ngOnInit() {
        // this.compileTemplate();
    }

    compileTemplate() {
        let metadata = {
            selector: `runtime-component`,  
            template: this.template
        };

        // const regex = '<script[^<]*</script>';
        // const scripts = this.template.match(regex);
        // // // const script = new DOMParser().parseFromString(scripts[0], "text/html");
        // console.log(scripts);
        // const wrapper = document.createElement('div');
        // wrapper.innerHTML= scripts.join();
        // console.log(wrapper.childNodes);
        // wrapper.childNodes.forEach((node) => {
        //     document.getElementsByTagName('head')[0].appendChild(node);
        // });
        // document.getElementsByTagName('head')[0].appendChild(wrapper.childNodes);
        // document.getElementsByTagName('head')[0].append(scripts[0]);

        let factory = this.createComponentFactorySync(this.compiler, metadata, null);

        if (this.componentRef) {
            this.componentRef.destroy();
            this.componentRef = null;
        }
        this.componentRef = this.container.createComponent(factory);

        setTimeout(() => {
            FB.XFBML.parse(this.element.nativeElement);
        });

    }

    private createComponentFactorySync(compiler: Compiler, metadata: Component, componentClass: any): ComponentFactory<any> {
        const cmpClass = componentClass || class RuntimeComponent {
                name: string = 'Runtime-Component'
            };
        const decoratedCmp = Component(metadata)(cmpClass);

        @NgModule({
            declarations: [decoratedCmp],
            imports: [
                CommonModule,
                DynamicComponentsModule
            ]
        })
        class RuntimeComponentModule {
        }

        let module: ModuleWithComponentFactories<any> = compiler.compileModuleAndAllComponentsSync(RuntimeComponentModule);
        return module.componentFactories.find(f => f.componentType === decoratedCmp);
    }

}