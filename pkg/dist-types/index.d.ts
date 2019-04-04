export const COMMAND_RENDER: string;
export class Machine {
constructor(props: any);
componentDidMount(): void;
componentWillUnmount(): void;
forceUpdate(callback: any): void;
render(): any;
setState(partialState: any,callback: any): void;
}
export function NO_ACTIONS(): any;
export const NO_STATE_UPDATE: any[];
export function destructureEvent(eventStruct: any): any;
export function getStateTransducerRxAdapter(RxApi: any): any;
export function renderAction(params: any): any;
export function testMachineComponent(testAPI: any,testScenario: any,machineDef: any): void;
