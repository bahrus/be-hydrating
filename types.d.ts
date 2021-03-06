import {BeDecoratedProps} from 'be-decorated/types';

export interface BeHydratingVirtualProps{
    deferAttrib: string,
    /**
     * Props that need to be deep merged into the target element.
     */
    deepMergeProps: any,
    /**
     * JSON-serializable props
     */
    props: any,
    /**
     * Id of a script tag that uses be-exportable to export constants.
     */
    scriptRef: string,
    /**
     * Non-JSON-serializable props
     */
    scriptRefProps:any,
    /**
     * Non-JSON-serializable props
     */
    complexProps:any,
    /**
     * Internal setting that tracks if all the merge can begin.
     */
    readyToMerge: boolean,
    /**
     * Internal setting that tracks if the scriptRef is ready.
     */
    scriptRefReady: boolean,
    script: HTMLScriptElement,
    selector: string,

    updateCount: number,
}

export interface BeHydratingProps extends BeHydratingVirtualProps{
    proxy: HTMLTemplateElement & BeHydratingVirtualProps;
}

export interface BeHydratingActions{
    //intro(proxy: Element & BeHydratingVirtualProps, target: Element, beDecorProps: BeDecoratedProps): void;
    onSelector(self: this): void;
}