export const COMMAND_RENDER: string;
export class Machine {
constructor(props: any);
componentDidMount(): void;
componentWillUnmount(): void;
forceUpdate(callback: any): void;
render(): any;
setState(partialState: any,callback: any): void;
}
export const NO_STATE_UPDATE: any[];
export function testMachineComponent(testAPI: any,testScenario: any,machineDef: any): void;
