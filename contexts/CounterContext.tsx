import { createContext, useState } from "react";
import { View } from "react-native";


interface ICounterInterface {
    counter: number,
    setCounter: (x: number) => any
}
const CounterContext = createContext<ICounterInterface>({ counter: 0, setCounter: () => { } })


export const CounterProvider: React.FC<{ children?: any }> = (props) => {
    const [counter, setCounter] = useState(0)
    return (
        <CounterContext.Provider value={{ counter, setCounter }}>
            {props.children}
        </CounterContext.Provider>
    )
}

export default CounterContext
