import {BeDecoratedProps} from 'be-decorated/types';

export interface BeHydratingVirtualProps{
    props: any,
    scriptRef: string,
    complexProps:any,
    readyToMerge: boolean,
    noBlockingAttrib: boolean,
    scriptRefReady: boolean,
    script: HTMLScriptElement,
}

export interface ByHydratingProps extends BeHydratingVirtualProps{
    proxy: Element & BeHydratingVirtualProps;
}

export interface BeHydratingActions{
    intro(proxy: Element & BeHydratingVirtualProps, target: Element, beDecorProps: BeDecoratedProps): void;
}