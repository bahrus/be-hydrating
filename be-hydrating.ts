import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeHydratingProps, BeHydratingVirtualProps, BeHydratingActions} from './types';
import {register} from 'be-hive/register.js';
import {addCSSListener, observeCssSelector} from 'xtal-element/lib/observeCssSelector.js';
export class BeHydratingController implements BeHydratingActions{
    #targetQ: Element[] = [];
    onSelector({proxy, selector}: this): void {
        const id = 'a' + (new Date()).valueOf().toString();//TODO:  use crypto uuid when caniuse says I can.
        const callback = async (target: Element) => {
            this.#targetQ.push(target);
            proxy.updateCount++;
        }
        addCSSListener(id, proxy, selector, callback);
    }

    //identical to be-hydrated.  [TODO:  share?]
    doRecursiveSearch(src: any, exports: any){
        for(const key in src){
            const val = src[key];
            switch(typeof val){
                case 'object':
                    if(val){
                        this.doRecursiveSearch(val, exports);
                    }
                    break;
                case 'string':
                    if(val.startsWith('import::')){
                        const importPath = val.substring('import::'.length);
                        src[key] = exports[importPath];
                    }
            }
        }
            
    }

    //almost identical to be-hydrated.  [TODO:  share?]
    async onReadyToMerge({proxy, props, deepMergeProps, complexProps, scriptRefProps, script}: this): Promise<void>{
        let evaluatedProps: any;
        
        if(scriptRefProps!==undefined){
            const modExport = (<any>script)._modExport;
            this.doRecursiveSearch(scriptRefProps, modExport);
        }
        let src = {...props, ...scriptRefProps};
        
        if(complexProps !== undefined){
            const modExport = (<any>script)._modExport;
            for(const key in complexProps){
                const val = complexProps[key];
                const exp = modExport[val];
                if(exp !== undefined){

                }
                src[key] = exp;
            }
        }
        if(deepMergeProps){
            const {mergeDeep} = await import('trans-render/lib/mergeDeep.js');
            mergeDeep(proxy, deepMergeProps);
        }
        Object.assign(proxy, src);
        //TODO:  decrement defer-hydration setting
    }

    //almost identical to be-hydrated.  [TODO:  share?]
    onScriptRef({scriptRef, proxy}: this): void {
        const script = (proxy.getRootNode() as Document).querySelector('#' + scriptRef) as HTMLScriptElement;
        if(script === null) throw '404';
        proxy.script = script;
        if(script.dataset.loaded !== undefined){
            proxy.scriptRefReady = true;
        }else{
            script.addEventListener('load', e => {
                proxy.scriptRefReady = true;
            }, {once: true});
        }
    }



}

export interface BeHydratingController extends BeHydratingProps{}

const tagName = 'be-hydrating';

const ifWantsToBe = 'hydrating';

const upgrade = 'template';

define<BeHydratingProps & BeDecoratedProps<BeHydratingProps, BeHydratingActions>, BeHydratingActions>({
    config:{
        tagName,
        propDefaults:{
            upgrade,
            ifWantsToBe,
            virtualProps: [
                'deferAttrib',
                'deepMergeProps',
                'props',
                'scriptRef',
                'scriptRefProps',
                'complexProps',
                'readyToMerge',
                'scriptRefReady',
                'script',
                'updateCount'
            ],
            proxyPropDefaults:{
                updateCount: 0,
            }
        },
        
        actions:{
            onSelector:'selector'
        }
    },
    complexPropDefaults:{
        controller: BeHydratingController,
    }
});

register(ifWantsToBe, upgrade, tagName);